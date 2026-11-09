# Docvelio SEO roadmap schedules: failure diagnosis and recovery

**Checked:** 9 November 2026 (GitHub Action logs from the connected `Ali-1999/docvelio` repo). The user requested that existing scheduled SEO work be repaired rather than marked green without actual evidence.

## Current recurring workflows and evidence

| Workflow | Trigger | Diagnosis | Verified status |
|---|---|---|---|
| [Docvelio SEO health audit](https://github.com/Ali-1999/docvelio/actions/workflows/seo-health.yml) | Daily at `15 3 * * *` UTC, manual dispatch, and main-branch relevant pushes | 9 Nov scheduled run [42608656514](https://github.com/Ali-1999/docvelio/actions/runs/42608656514) failed in `test-excel-formula.cjs`: `SyntaxError: Cannot use import statement outside a module`. Fixing it uncovered a test forbidding a vendor QR library still used by a separate standalone page; fixing that exposed an invalid regex in `seo-health-check.cjs`. | **PASS:** full refreshed source SEO audit [42650531823](https://github.com/Ali-1999/docvelio/actions/runs/42650531823) succeeds with all scheduled source checks. |
| [Check live Google indexability](https://github.com/Ali-1999/docvelio/actions/workflows/live-indexability.yml) | Daily `17 7 * * *` UTC, manual, and relevant pushes | `/sitemap.xml` is challenged by Cloudflare with HTTP 403 `cf-mitigated: challenge`. Earlier diagnostic created five derivative failures by parsing the 403 HTML as XML. | **BLOCKED:** [latest targeted run](https://github.com/Ali-1999/docvelio/actions/runs/42650855917) reports the **single root cause**, preserves `reports/live-indexability.md` as a downloadable artifact, and remains correctly failed until the Cloudflare edge rule is fixed. |
| [Deploy Docvelio to Cloudflare Workers](https://github.com/Ali-1999/docvelio/actions/workflows/deploy-cloudflare.yml) | Main-branch pushes and manual dispatch; **not a cron schedule** | Deployment [42502130371](https://github.com/Ali-1999/docvelio/actions/runs/42502130371) compiled the site but Cloudflare rejected `/accounts/***/workers/scripts/docvelio/assets-upload-session` with **No access to the specified resource**. | **BLOCKED:** GitHub Actions credentials are present but Cloudflare account/Worker scope is unverified or insufficient. Cannot repair without authorized Cloudflare account and GitHub Secrets management. |
| Docvelio tool build check | Push and PR only | Full source pipeline passed on recent pushes | Working. |
| Docvelio real-browser QA | Relevant push/PR/manual only | Cross-browser functional tests succeeded | Working on last verified run. |

**Separate ChatGPT task schedules:** A check of the saved automations found no Docvelio SEO roadmap automation. The recurring SEO jobs inspected here are GitHub Actions schedules.

## Repairs made on 9 November

1. Replaced unsafe `new Function(...ESM source...)` in `scripts/test-excel-formula.cjs` with a real dynamic `import(pathToFileURL(...))`. Tests now invoke the actual Worker module.
2. Updated `scripts/test-europe-tools.cjs` so it tests the **first-party EPC/SEPA QR encoder** without blocking on an unrelated legacy dependency used by the standalone QR Code Generator. The existing dependency is logged for review; we did **not** delete a working tool or falsely claim its dependency was removed.
3. Corrected an invalid Ahrefs regex literal in `scripts/seo-health-check.cjs` that prevented that check from parsing.
4. Updated the daily SEO health workflow to audit **generated source and code**, not live hosting; added a push trigger to verify fixes before the next cron run. The independent live-indexability job still fails appropriately for real Cloudflare availability problems.
5. Updated live-indexability diagnostics to avoid counting derivative missing XML entries when Cloudflare returned a challenge page; saved the report as a GitHub Actions artifact even on failures.

## What the owner needs to do to make the remaining checks green

### 1. Fix the Cloudflare challenge for /sitemap.xml

- Open Cloudflare > docvelio.com > **Security > Analytics > Events**.
- Find the logged Ray ID **a57e0c5b1bcf2f7b-LAX** at approximately **2026-11-09 16:03:34 UTC**. Check the **Service** that applied the challenge.
- If the responsible product supports rules, create the narrowest possible WAF Skip exception for HTTPS GET/HEAD requests to **/sitemap.xml** and only skip the offending feature, retaining logging and other security. Match host and path explicitly.
- **Cloudflare Bot Fight Mode (Free)** cannot be skipped with WAF Skip rules. If it caused the challenge, change its setting after considering the security trade-offs. For Super Bot Fight Mode or managed rules, targeted Skip may be appropriate.
- Rerun the [live Google indexability workflow](https://github.com/Ali-1999/docvelio/actions/workflows/live-indexability.yml); require status **200**, valid XML MIME, expected sitemap URLs and no challenge header.

### 2. Fix Cloudflare deployment permissions

- In Cloudflare, open the account that contains the existing **docvelio** Worker. Copy its account ID from the account's official dashboard.
- Create/adjust a **user-scoped API token**, scoped to the same account and allowing **Workers Editor / Workers Scripts Edit** on that Worker (or Workers product). If deployment changes routes or custom domains, grant the necessary **Workers Routes Write** on the affected zone. Use the minimum necessary scope.
- In GitHub > `Ali-1999/docvelio` > Settings > Secrets and variables > Actions, set or replace **CLOUDFLARE_API_TOKEN** and **CLOUDFLARE_ACCOUNT_ID**. Do **not** paste credentials into issues, chat, commit messages, artifacts or workflow logs.
- Manually run [Deploy Docvelio to Cloudflare Workers](https://github.com/Ali-1999/docvelio/actions/workflows/deploy-cloudflare.yml). Require a successful `assets-upload-session` and actual worker deployment.
- The deployment error is an external Cloudflare authorization failure, **not** a failed generated-site build. Modifying HTML, silencing the deploy step or switching domains will not grant permission.

## Schedule limitations

GitHub scheduled workflows run on the default branch and are **best effort**. GitHub documents that cron jobs may be delayed or even dropped under load. The two cron expressions remain defined; status should be checked on completed runs, not assumed from scheduled timing alone.

The code-based SEO job can pass while the live job fails, by design. Do not modify the live job to report green until the real 403 is resolved.

## References

- [GitHub: Scheduled workflows and delays](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
- [Cloudflare: Workers API token permission requirements](https://developers.cloudflare.com/workers/authorization/workers/)
- [Cloudflare: Skip action for WAF rules](https://developers.cloudflare.com/waf/custom-rules/skip/)
- [Cloudflare: Bot Fight Mode cannot be skipped](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
