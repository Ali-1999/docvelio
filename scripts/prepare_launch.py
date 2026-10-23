#!/usr/bin/env python3
"""Configure Docvelio owner details, AdSense verification and crawl status.
Run from project root, e.g. py scripts/prepare_launch.py --email hello@docvelio.com --operator 'Your registered name' --jurisdiction 'Your country' --launch.
"""
from pathlib import Path
import argparse, re, sys, html

PROJECT=Path(__file__).resolve().parent.parent
PUBLIC=PROJECT/'public'
p=argparse.ArgumentParser(description='Prepare Docvelio production metadata without inventing owner or Google information.')
p.add_argument('--email',help='REAL working public contact address')
p.add_argument('--operator',help='REAL legal name or business/operator identification')
p.add_argument('--jurisdiction',help='REAL country or region of operation (appropriate level of detail)')
p.add_argument('--publisher',help='Real AdSense publisher ID: pub-XXXXXXXXXXXXXXXX')
p.add_argument('--launch',action='store_true',help='Allow search engines to crawl after owner details and domain setup')
p.add_argument('--preview',action='store_true',help='Put site back into noindex preview state')
a=p.parse_args()
if a.launch and a.preview:p.error('Select only --launch or --preview.')
if a.email and (not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+',a.email) or any(c in a.email for c in '<>"\'')):
    p.error('Email address does not appear valid.')
if a.publisher and not re.fullmatch(r'pub-\d{16}',a.publisher):p.error('Use your own AdSense ID in the format pub-1234567890123456.')
for key in ('operator','jurisdiction'):
    val=getattr(a,key)
    if val and ('<' in val or '>' in val or len(val)>160):p.error(f'Invalid {key}.')
repls={'{{CONTACT_EMAIL}}':a.email,'{{OPERATOR_NAME}}':a.operator,'{{JURISDICTION}}':a.jurisdiction}
changed=0
for doc in PUBLIC.rglob('*.html'):
    before=doc.read_text(encoding='utf-8');d=before
    for marker,value in repls.items():
        if value:d=d.replace(marker,html.escape(value,quote=True))
    if a.publisher:
        # Static verification meta only: no display ads or cookies are loaded by this tag.
        tag=f'<meta name="google-adsense-account" content="ca-{a.publisher}">'
        d=re.sub(r'<meta name="google-adsense-account" content="[^"]*">','',d)
        d=d.replace('</head>',tag+'</head>',1)
    if d!=before:doc.write_text(d,encoding='utf-8');changed+=1
if a.publisher:
    (PUBLIC/'ads.txt').write_text(f'google.com, {a.publisher}, DIRECT, f08c47fec0942fa0\n',encoding='utf-8')
if a.launch:
    remain=[]
    for f in PUBLIC.rglob('*.html'):
        txt=f.read_text(encoding='utf-8')
        if '{{CONTACT_EMAIL}}' in txt or '{{OPERATOR_NAME}}' in txt or '{{JURISDICTION}}' in txt:remain.append(str(f.relative_to(PUBLIC)))
    if remain:
        p.error('Still missing genuine owner/contact details. Re-run with --email, --operator and --jurisdiction before --launch. Pages: '+', '.join(remain[:8]))
    (PUBLIC/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: https://docvelio.com/sitemap.xml\n',encoding='utf-8')
    (PUBLIC/'_headers').write_text('/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n',encoding='utf-8')
    print('LAUNCH FILES ENABLED: search engines can crawl. You must first own/connect docvelio.com and verify site/legal/consent setup.')
elif a.preview:
    (PUBLIC/'robots.txt').write_text('User-agent: *\nDisallow: /\n',encoding='utf-8')
    (PUBLIC/'_headers').write_text('/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n',encoding='utf-8')
    print('PREVIEW FILES ENABLED: search engines blocked. This is not ready for AdSense review.')
print(f'Updated {changed} HTML file(s).')
if a.publisher:print('Updated ads.txt with your supplied ID and added AdSense verification meta; no advertising script was enabled.')
print('Next: review policy wording, test mailbox and all tools, then run npx wrangler deploy.')
