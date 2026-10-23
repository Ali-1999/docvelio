/* Browser-only PDF viewer and annotation editor.
 * PDF.js renders previews; pdf-lib writes new PDF content.
 * Content is not removed by the visual whiteout tool (not secure redaction).
 */
(() => {
  'use strict';
  const root = document.querySelector('[data-pdf-app]');
  if (!root) return;
  const byId = id => document.getElementById(id);
  const isEditor = root.dataset.mode === 'edit';
  const input = byId('pdf-file');
  const message = byId('pdf-status');
  const workspace = byId('pdf-workspace');
  const canvas = byId('page-canvas');
  const overlay = byId('annotation-canvas');
  const canvasFrame = byId('canvas-frame');
  const documentName = byId('document-name');
  const pagePosition = byId('page-position');
  const pagePrev = byId('page-prev');
  const pageNext = byId('page-next');
  const zoomIn = byId('zoom-in');
  const zoomOut = byId('zoom-out');
  const zoomLabel = byId('zoom-label');
  const origDownload = byId('original-download');
  const result = byId('pdf-result');
  const outputDownload = byId('download-edited');
  const outputOpen = byId('open-edited');
  const exportButton = byId('export-pdf');
  const undoButton = byId('undo-annotation');
  const eraseButton = byId('clear-page');
  const editorActions = isEditor ? [...root.querySelectorAll('[data-tool-mode]')] : [];
  const textValue = byId('annotation-text');
  const colorValue = byId('annotation-color');
  const fontSize = byId('annotation-size');
  const penWidth = byId('pen-width');
  let originalBytes = null;
  let pdfView = null;
  let fileName = '';
  let pageNo = 1;
  let scale = 1;
  let viewport = null;
  let annotations = new Map();
  let tool = 'text';
  let drag = null;
  let outputUrl = null;
  let originalUrl = null;
  let renderToken = 0;
  let pdfRenderTask = null;
  let busy = false;
  const colorTable = {'#14213a': [0.078, 0.129, 0.227], '#0b62d6':[0.043,0.384,0.839], '#d43434':[0.831,0.204,0.204], '#188263':[0.094,0.51,0.388], '#f7c62a':[0.969,0.776,0.165]};

  function status(text, error=false) {
    message.textContent = window.dvT?.(text) || text;
    message.className = `status ${error ? 'error' : ''}`;
  }
  function hideResult() {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    outputUrl = null;
    if (result) result.hidden = true;
    if (outputDownload) outputDownload.removeAttribute('href');
    if (outputOpen) outputOpen.removeAttribute('href');
  }
  function stateForPage(page) {
    if (!annotations.has(page)) annotations.set(page, []);
    return annotations.get(page);
  }
  function clamp(value,min,max) { return Math.max(min,Math.min(max,value)); }
  const chosenColor = () => (colorValue && colorValue.value) || '#0b62d6';
  const chosenSize = () => clamp(Number(fontSize?.value) || 18, 8, 72);
  const chosenWidth = () => clamp(Number(penWidth?.value) || 3, 1, 16);
  function countAnnotations() { return [...annotations.values()].reduce((n,a) => n + a.length,0); }
  function refreshButtons() {
    const loaded = !!pdfView;
    pagePrev.disabled = !loaded || pageNo <= 1 || busy;
    pageNext.disabled = !loaded || pageNo >= (pdfView?.numPages || 0) || busy;
    zoomIn.disabled = !loaded || scale >= 1.85 || busy;
    zoomOut.disabled = !loaded || scale <= 0.55 || busy;
    if (undoButton) undoButton.disabled = !loaded || !(stateForPage(pageNo).length) || busy;
    if (eraseButton) eraseButton.disabled = !loaded || !(stateForPage(pageNo).length) || busy;
    if (exportButton) exportButton.disabled = !loaded || busy;
    pagePosition.textContent = loaded ? `Page ${pageNo} of ${pdfView.numPages}` : 'No document open';
    zoomLabel.textContent = `${Math.round(scale * 100)}%`;
    if (isEditor && byId('edit-count')) byId('edit-count').textContent = `${countAnnotations()} edit${countAnnotations()===1?'':'s'} added`;
  }
  function rgbOf(hex) {
    const [r,g,b] = colorTable[hex] || colorTable['#0b62d6'];
    return PDFLib.rgb(r,g,b);
  }
  function pointFromEvent(e) {
    const bounds = overlay.getBoundingClientRect();
    const x = clamp((e.clientX - bounds.left) * (viewport.width / bounds.width),0,viewport.width);
    const y = clamp((e.clientY - bounds.top) * (viewport.height / bounds.height),0,viewport.height);
    const [pdfX, pdfY] = viewport.convertToPdfPoint(x,y);
    return {x:pdfX,y:pdfY};
  }
  function toScreen(point) {
    const [x,y] = viewport.convertToViewportPoint(point.x,point.y);
    return {x,y};
  }
  function rectPoints(a,b) {
    const x1=Math.min(a.x,b.x), x2=Math.max(a.x,b.x), y1=Math.min(a.y,b.y), y2=Math.max(a.y,b.y);
    return {x:x1,y:y1,w:x2-x1,h:y2-y1};
  }
  function stroke(ctx,points) {
    if (!points.length) return;
    ctx.beginPath();
    const first=toScreen(points[0]);
    ctx.moveTo(first.x,first.y);
    if (points.length===1) ctx.lineTo(first.x+.1,first.y+.1);
    for (const p of points.slice(1)) { const q=toScreen(p);ctx.lineTo(q.x,q.y); }
    ctx.stroke();
  }
  function paintItem(ctx,item) {
    ctx.save();
    if (item.type==='pen') {
      ctx.strokeStyle=item.color;ctx.lineWidth=item.width*viewport.scale;ctx.lineCap='round';ctx.lineJoin='round';
      stroke(ctx,item.points);
    } else if (item.type==='highlight' || item.type==='whiteout') {
      const r=rectPoints(item.start,item.end);
      const coords=[{x:r.x,y:r.y},{x:r.x+r.w,y:r.y},{x:r.x+r.w,y:r.y+r.h},{x:r.x,y:r.y+r.h}].map(toScreen);
      ctx.beginPath();ctx.moveTo(coords[0].x,coords[0].y);
      for (const p of coords.slice(1))ctx.lineTo(p.x,p.y);
      ctx.closePath();ctx.fillStyle = item.type==='highlight'?item.color:'#fff';
      ctx.globalAlpha=item.type==='highlight'?.28:1;
      ctx.fill();
      if (item.type==='whiteout') {ctx.strokeStyle='#b9cbe0';ctx.lineWidth=.6;ctx.stroke();}
    } else if (item.type==='text') {
      const center=toScreen(item.point);
      const oneRight=toScreen({x:item.point.x+1,y:item.point.y});
      const angle=Math.atan2(oneRight.y-center.y,oneRight.x-center.x);
      ctx.translate(center.x,center.y);ctx.rotate(angle);
      ctx.font=`${item.size * viewport.scale}px Helvetica, Arial, sans-serif`;
      ctx.textBaseline='alphabetic';ctx.fillStyle=item.color;
      const lines = item.text.split('\n');
      lines.forEach((line,i)=>ctx.fillText(line,0,i*item.size*viewport.scale*1.2));
    }
    ctx.restore();
  }
  function drawOverlays() {
    if (!viewport || !overlay) return;
    const dpr=overlay.width/viewport.width;
    const ctx=overlay.getContext('2d');
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,viewport.width,viewport.height);
    for (const item of stateForPage(pageNo)) paintItem(ctx,item);
    if (drag) paintItem(ctx,drag);
  }
  async function renderPage() {
    if (!pdfView) return;
    const token=++renderToken;
    if (pdfRenderTask) {
      try {pdfRenderTask.cancel(); await pdfRenderTask.promise;} catch (_) { /* old preview cancelled */ }
      pdfRenderTask=null;
    }
    try {
      const page = await pdfView.getPage(pageNo);
      if (token!==renderToken) return;
      // Scale independent of device width: users can scroll horizontally when zoomed.
      const baseViewport=page.getViewport({scale: 1});
      const fit=Math.min(1,Math.max(.25,860/baseViewport.width));
      viewport=page.getViewport({scale: scale*fit});
      const dpr=Math.min(window.devicePixelRatio || 1,2);
      canvas.width=Math.round(viewport.width*dpr);
      canvas.height=Math.round(viewport.height*dpr);
      canvas.style.width=`${viewport.width}px`;
      canvas.style.height=`${viewport.height}px`;
      overlay.width=canvas.width;overlay.height=canvas.height;
      overlay.style.width=canvas.style.width;
      overlay.style.height=canvas.style.height;
      canvasFrame.style.width=canvas.style.width;
      canvasFrame.style.height=canvas.style.height;
      const ctx=canvas.getContext('2d',{alpha:false});
      ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
      pdfRenderTask=page.render({canvasContext:ctx, viewport, transform:[dpr,0,0,dpr,0,0]});
      await pdfRenderTask.promise;
      if (token!==renderToken) return;
      drawOverlays();
      refreshButtons();
      status(isEditor ? 'Choose an editing tool, then click or drag on the PDF. Select Save edited PDF when ready.' : 'PDF opened. Use the page controls or Download original PDF.');
    } catch(error) {
      if (error?.name!=='RenderingCancelledException') status(`Could not display PDF page: ${error.message}`,true);
    } finally {pdfRenderTask=null;}
  }
  async function openFile(file) {
    if (!file) return;
    if (typeof pdfjsLib==='undefined' || (isEditor && typeof PDFLib==='undefined')) {
      status('The PDF libraries did not load. Check your internet connection and refresh.',true);
      return;
    }
    if (!/\.pdf$/i.test(file.name) && file.type!=='application/pdf') {
      status('Please choose a PDF document.',true);return;
    }
    busy=true; refreshButtons();
    status('Opening your PDF…');
    hideResult();
    const oldView=pdfView;
    pdfView=null;
    annotations=new Map();pageNo=1;scale=1;drag=null;viewport=null;
    try {
      // Keep independent copies because the PDF.js worker can transfer its source buffer.
      const bytes=new Uint8Array(await file.arrayBuffer());
      const next=await pdfjsLib.getDocument({data: bytes.slice()}).promise;
      if (oldView) await oldView.destroy();
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      originalBytes=bytes;
      fileName=file.name;
      originalUrl=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      origDownload.href=originalUrl;
      origDownload.download=fileName;
      origDownload.hidden=false;
      documentName.textContent=`${file.name} · ${next.numPages} page${next.numPages===1?'':'s'}`;
      pdfView=next;
      workspace.hidden=false;
      busy=false;
      await renderPage();
      refreshButtons();
    } catch(error) {
      busy=false;
      if (oldView) {try{await oldView.destroy();}catch(_){}}
      pdfView=null;
      workspace.hidden=true;
      originalBytes=null;
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      originalUrl=null;
      origDownload.hidden=true;
      status('Could not open this PDF. It may be password-protected, damaged or unsupported.',true);
      refreshButtons();
    }
  }
  function markChange() {
    hideResult();
    drawOverlays();
    refreshButtons();
    status('Edit added. Save the PDF to generate your download.');
  }
  if (isEditor) {
    function setTool(next) {
      tool=next;
      for (const b of editorActions) {
        const selected=b.dataset.toolMode===tool;
        b.setAttribute('aria-pressed',selected?'true':'false');
        b.classList.toggle('selected',selected);
      }
      if (overlay) overlay.style.cursor=tool==='text'?'text':'crosshair';
      byId('tool-tip').textContent={text:'Enter text and click where it should appear. The click point is the text baseline.',pen:'Drag to draw on the PDF.',highlight:'Drag across a region to highlight it.',whiteout:'Drag a white rectangle over content. This only hides content visually and is not secure redaction.'}[tool];
    }
    editorActions.forEach(b=>b.addEventListener('click',()=>setTool(b.dataset.toolMode)));
    setTool('text');
    overlay.addEventListener('pointerdown',e=>{
      if (!pdfView || !viewport || e.button!==0 || busy) return;
      const p=pointFromEvent(e);
      if (tool==='text') {
        const text=(textValue?.value || '').trim();
        if (!text) {status('Enter the text you want to add, then click on the PDF.',true);textValue?.focus();return;}
        stateForPage(pageNo).push({type:'text',point:p,text,color:chosenColor(),size:chosenSize()});
        markChange();return;
      }
      drag=tool==='pen'?{type:'pen',points:[p],color:chosenColor(),width:chosenWidth()}:
        {type:tool,start:p,end:p,color:chosenColor()};
      overlay.setPointerCapture(e.pointerId);
      drawOverlays();
    });
    overlay.addEventListener('pointermove',e=>{
      if (!drag || !viewport || !pdfView) return;
      const p=pointFromEvent(e);
      if (drag.type==='pen') drag.points.push(p); else drag.end=p;
      drawOverlays();
    });
    function finishDrag(e) {
      if (!drag) return;
      if (e && overlay.hasPointerCapture(e.pointerId)) overlay.releasePointerCapture(e.pointerId);
      if (drag.type==='pen') {
        if (drag.points.length<2) drag.points.push({...drag.points[0],x:drag.points[0].x+.5});
      } else {
        const r=rectPoints(drag.start,drag.end);
        if (r.w<2 || r.h<2) {drag=null;drawOverlays();return;}
      }
      stateForPage(pageNo).push(drag);
      drag=null;markChange();
    }
    overlay.addEventListener('pointerup',finishDrag);
    overlay.addEventListener('pointercancel',()=>{drag=null;drawOverlays();});
    undoButton.addEventListener('click',()=>{stateForPage(pageNo).pop();markChange();});
    eraseButton.addEventListener('click',()=>{
      if (!stateForPage(pageNo).length)return;
      if (window.confirm('Remove all edits on this page?')) {annotations.set(pageNo,[]);markChange();}
    });
    exportButton.addEventListener('click', async()=>{
      if (!originalBytes || busy)return;
      if (typeof PDFLib==='undefined') {status('The PDF editing library is unavailable.',true);return;}
      busy=true;refreshButtons();hideResult();status('Saving your PDF locally…');
      try {
        const doc=await PDFLib.PDFDocument.load(originalBytes.slice());
        const font=await doc.embedFont(PDFLib.StandardFonts.Helvetica);
        for (const [number,items] of annotations.entries()) {
          const page=doc.getPage(number-1);
          for (const item of items) {
            if (item.type==='text') {
              try {
                page.drawText(item.text,{x:item.point.x,y:item.point.y,size:item.size,font,color:rgbOf(item.color),lineHeight:item.size*1.2});
              } catch(e) {
                if (/WinAnsi|encode|Encoding/i.test(String(e.message))) throw new Error('Some entered characters cannot be exported with the basic PDF font. Try plain English letters, numbers, and punctuation.');
                throw e;
              }
            } else if (item.type==='pen') {
              const pts=item.points;
              for (let i=1;i<pts.length;i++) page.drawLine({start:pts[i-1],end:pts[i],thickness:item.width,color:rgbOf(item.color),lineCap:PDFLib.LineCapStyle.Round});
            } else if (item.type==='highlight' || item.type==='whiteout') {
              const r=rectPoints(item.start,item.end);
              page.drawRectangle({x:r.x,y:r.y,width:r.w,height:r.h,color:item.type==='highlight'?rgbOf(item.color):PDFLib.rgb(1,1,1),opacity:item.type==='highlight'?.28:1,borderWidth:0});
            }
          }
        }
        const pdfBytes=await doc.save();
        outputUrl=URL.createObjectURL(new Blob([pdfBytes],{type:'application/pdf'}));
        const name=fileName.replace(/\.pdf$/i,'')+'-edited.pdf';
        outputDownload.href=outputUrl;
        outputDownload.download=name;
        outputOpen.href=outputUrl;
        result.hidden=false;
        status('Your edited PDF is ready. Choose Download edited PDF below.');
        outputDownload.focus();
      }catch(e) {status(`Couldn't export your PDF: ${e.message}`,true);} finally {busy=false;refreshButtons();}
    });
  }
  input.addEventListener('change',()=>openFile(input.files?.[0]));
  pagePrev.addEventListener('click',()=>{if (pageNo>1 && !busy){pageNo--;drag=null;renderPage();refreshButtons();}});
  pageNext.addEventListener('click',()=>{if (pdfView && pageNo<pdfView.numPages && !busy){pageNo++;drag=null;renderPage();refreshButtons();}});
  zoomIn.addEventListener('click',()=>{scale=clamp(scale+.2,.55,1.85);renderPage();refreshButtons();});
  zoomOut.addEventListener('click',()=>{scale=clamp(scale-.2,.55,1.85);renderPage();refreshButtons();});
  if (typeof pdfjsLib!=='undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  }
  window.addEventListener('beforeunload',()=>{
    if(originalUrl) URL.revokeObjectURL(originalUrl);
    if(outputUrl) URL.revokeObjectURL(outputUrl);
  });
  refreshButtons();
})();
