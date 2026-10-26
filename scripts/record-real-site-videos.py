#!/usr/bin/env python3
"""Record five REAL Docvelio page sessions, then create portrait narrated demos.
No synthetic site replicas: Chromium navigates to the deployed site.
"""
import os, time, subprocess, tempfile, pathlib, json, argparse
import imageio_ffmpeg
FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()
from playwright.sync_api import sync_playwright
BASE=os.environ.get("DOCVELIO_URL","https://docvelio.com").rstrip("/")
OUT=pathlib.Path("artifacts/docvelio-tiktok"); OUT.mkdir(parents=True,exist_ok=True)
SCENES=[
("01_pdf_tools","/tools/edit-pdf/","Edit PDF files online","Open PDF tools. Explore editing and file actions on Docvelio."),
("02_word_editor","/tools/word-editor/","Edit Word documents","Open the Word editor. Format content and prepare documents online."),
("03_image_studio","/image-editor/","Image Studio","Explore image tools for resizing, cropping and preparing pictures."),
("04_cbm_calculator","/cbm-calculator/","CBM shipping calculator","Enter cargo dimensions and calculate shipping volume."),
("05_spin_wheel","/wheel-of-names/","Spin the Wheel","Add names, spin the wheel, and pick a winner in your browser.")
]
def run(cmd): subprocess.run(cmd,check=True,timeout=120)
def say(text,file):
 run(["espeak-ng","-v","en+f3","-s","154","-a","200","-w",str(file),text])
def navigate(page,route):
 page.goto(BASE+route,wait_until="domcontentloaded",timeout=45000)
 page.wait_for_timeout(1700)
 if "/wheel-of-names/" not in page.url and route=="/wheel-of-names/":raise RuntimeError("Wheel route redirected")
 if page.locator("body").inner_text()[:250].strip()=="":raise RuntimeError("Empty page "+route)
def perform(page,idx):
 if idx==0:
  page.mouse.wheel(0,540);page.wait_for_timeout(950)
  page.mouse.wheel(0,380);page.wait_for_timeout(900)
  # Demo only. Avoid uploading any private files.
 elif idx==1:
  for candidate in ["[contenteditable=true]","#editor",".word-content"]:
   ed=page.locator(candidate).first
   if ed.count() and ed.is_visible():
    try:ed.click(timeout=1200);ed.type("My Docvelio project notes",delay=35);break
    except Exception:pass
  page.wait_for_timeout(950);page.mouse.wheel(0,400)
 elif idx==2:
  page.mouse.wheel(0,520);page.wait_for_timeout(900)
  page.mouse.wheel(0,-180)
 elif idx==3:
  for field,value in [('input[data-field="length"]','60'),('input[data-field="width"]','40'),('input[data-field="height"]','30'),('input[data-field="quantity"]','12')]:
   el=page.locator(field).first
   if el.count():
    try:el.fill(value,timeout=1400)
    except Exception:pass
  page.wait_for_timeout(1200);page.mouse.wheel(0,520)
 elif idx==4:
  ed=page.locator("#entries")
  if not ed.count():raise RuntimeError("Live wheel missing entries field")
  ed.fill("Alex\nJordan\nSam\nTaylor\nMorgan")
  page.wait_for_timeout(850)
  page.locator("#spin").click(timeout=5000)
  page.wait_for_timeout(5500)
 page.wait_for_timeout(1300)
def record(p,idx,scene):
 name,route,title,narration=scene
 with tempfile.TemporaryDirectory() as temp:
  browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
  ctx=browser.new_context(viewport={"width":900,"height":1600},device_scale_factor=1,record_video_dir=temp,record_video_size={"width":900,"height":1600},locale="en-US")
  page=ctx.new_page()
  try:
   navigate(page,route)
   page.wait_for_timeout(1100)
   try:
    perform(page,idx)
   except Exception:
    page.screenshot(path=str(OUT/(name+"_diagnostic.png")),full_page=True)
    (OUT/(name+"_diagnostic.txt")).write_text("URL: "+page.url+"\\nTitle: "+page.title()+"\\n"+page.locator("body").inner_text()[:4000])
    raise
   page.wait_for_timeout(1000)
   observed={"source":page.url,"heading":page.title(),"success":True}
  finally:
   video=page.video
   ctx.close();browser.close()
  source=pathlib.Path(video.path())
  if not source.exists():raise RuntimeError("No browser recording "+name)
  raw=OUT/(name+"_raw.webm");raw.write_bytes(source.read_bytes())
  voice=OUT/(name+"_voice.wav");say(narration,voice)
  # Add readable title and end CTA; actual site remains visible in the main area.
  dest=OUT/(name+".mp4")
  duration=None  # FFmpeg stops at the end of the captured video stream.
  # Preserve the genuine browser recording. imageio FFmpeg builds may omit drawtext.
  run([FFMPEG,"-y","-i",str(raw),"-i",str(voice),"-filter_complex","[1:a]loudnorm=I=-13:TP=-1.5:LRA=9,apad[a]","-map","0:v:0","-map","[a]","-shortest","-r","25","-c:v","libx264","-preset","ultrafast","-crf","25","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart",str(dest)])
  voice.unlink()
  observed["video_file"]=dest.name
  (OUT/(name+".json")).write_text(json.dumps(observed,indent=2))
  print("CAPTURED",dest,"source",observed["source"],flush=True)
def main():
 parser=argparse.ArgumentParser()
 parser.add_argument('--scene',type=int,choices=range(1,6),help='Record one scene (1-5)')
 args=parser.parse_args()
 with sync_playwright() as p:
  for idx,scene in enumerate(SCENES):
   if args.scene is None or idx==args.scene-1:
    record(p,idx,scene)
if __name__=="__main__":main()
