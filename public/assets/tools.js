(() => {
  const root = document.querySelector('[data-tool]');
  if (!root) return;
  const type = root.dataset.tool;
  const fileInput = document.getElementById('documents');
  const processButton = document.getElementById('process');
  const status = document.getElementById('status');
  const options = document.getElementById('options');
  const toolOptions = {
    'merge-pdf':'<p class="help">Select two or more PDFs. Their pages will appear in the order of the files you select.</p>',
    'split-pdf':'<label for="ranges">Pages to extract</label><input type="text" id="ranges" value="1-2" placeholder="e.g. 1-3,5,8-10"><p class="help">Enter the pages to keep, such as 1-3,5. This creates one new PDF containing those pages.</p>',
    'rotate-pdf':'<label for="rotation">Rotate all pages</label><select id="rotation"><option value="90">90° clockwise</option><option value="180">180°</option><option value="270">270° clockwise</option></select>',
    'images-to-pdf':'<p class="help">Select JPG or PNG images. Each image gets its own A4-sized page, fitting within margins.</p>',
    'watermark-pdf':'<label for="watermark">Watermark text</label><input type="text" id="watermark" maxlength="70" value="DRAFT" placeholder="e.g. CONFIDENTIAL"><p class="help">A lightly coloured diagonal watermark will be added to each page.</p>',
    'remove-pages':'<label for="ranges">Pages to remove</label><input type="text" id="ranges" value="2" placeholder="e.g. 2,5-7"><p class="help">Use page numbers such as 2,5-7. At least one page must remain.</p>'
  };
  options.innerHTML = toolOptions[type] || '';
  const multi = ['merge-pdf','images-to-pdf'].includes(type);
  fileInput.multiple = multi;
  fileInput.accept = type === 'images-to-pdf' ? 'image/jpeg,image/png,.jpg,.jpeg,.png' : 'application/pdf,.pdf';
  function setMessage(message, category='') {
    status.textContent = window.dvT ? window.dvT(message) : message;
    status.className = `status ${category}`;
  }
  function pageSelection(text,total) {
    if (!/^\s*\d+[\d,\s-]*$/.test(text)) throw Error('Enter page numbers like 1-3,5.');
    const selected = new Set();
    for (const group of text.split(',')) {
      const part = group.trim();
      if (!part) throw Error('Page list contains an empty value.');
      const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
      if (!match) throw Error('Invalid page range: ' + part);
      const first = Number(match[1]),last = Number(match[2] || match[1]);
      if (first < 1 || last > total || first > last) throw Error(`Page range ${part} is outside the document (1-${total}).`);
      for (let i=first;i<=last;i++) selected.add(i-1);
    }
    return [...selected].sort((a,b)=>a-b);
  }
  const loadPdf = async (file) => {
    try { return await PDFLib.PDFDocument.load(await file.arrayBuffer()); }
    catch (_) {throw Error(`Could not open ${file.name}. It may be corrupted, encrypted or unsupported.`);}
  };
  // Keep the generated document available until the visitor downloads it.
  // No automatic download, so the visitor explicitly chooses Download or Open.
  let resultUrl = null;
  const resultBox = document.createElement('div');
  resultBox.className = 'file-result';
  resultBox.id = 'file-result';
  resultBox.setAttribute('aria-live', 'polite');
  status.insertAdjacentElement('afterend',resultBox);
  function clearResult() {
    resultBox.classList.remove('ready');
    resultBox.replaceChildren();
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = null;
  }
  const save = async (doc,name) => {
    const bytes = await doc.save();
    clearResult();
    const blob = new Blob([bytes], {type:'application/pdf'});
    resultUrl = URL.createObjectURL(blob);
    const heading = document.createElement('strong');
    heading.textContent = window.dvT?.('Your PDF is ready') || 'Your PDF is ready';
    const download = document.createElement('a');
    download.href = resultUrl;
    download.download = name;
    download.textContent = '↓ '+(window.dvT?.('Download PDF') || 'Download PDF');
    const preview = document.createElement('a');
    preview.href = resultUrl;
    preview.target='_blank';
    preview.rel='noopener noreferrer';
    preview.className='secondary-download';
    preview.textContent=(window.dvT?.('Open edited PDF') || 'Open PDF')+' ↗';
    resultBox.append(heading,download,preview);
    resultBox.classList.add('ready');
    download.focus();
  };
  window.addEventListener('beforeunload',clearResult);
  processButton.addEventListener('click', async () => {
    const files = [...fileInput.files];
    if (!files.length) return setMessage('Choose your file first.','error');
    if (multi && !files.length) return setMessage('Choose files first.','error');
    if (type === 'merge-pdf' && files.length < 2) return setMessage('Choose at least two PDFs.','error');
    if (typeof PDFLib === 'undefined') return setMessage('The PDF processing library did not load. Check your connection and refresh.','error');
    processButton.disabled = true;
    clearResult();
    setMessage('Processing locally in your browser…');
    try {
      if (type === 'merge-pdf') {
        const output = await PDFLib.PDFDocument.create();
        for (const file of files) {
          const input = await loadPdf(file);
          const copied = await output.copyPages(input,input.getPageIndices());
          copied.forEach(page=>output.addPage(page));
        }
        await save(output,'merged-document.pdf');
      } else if (type === 'images-to-pdf') {
        const output = await PDFLib.PDFDocument.create();
        const A4 = [595.28,841.89],m=32;
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const isPng = file.type==='image/png' || /\.png$/i.test(file.name);
          const isJpeg = file.type==='image/jpeg' || /\.jpe?g$/i.test(file.name);
          if (!isPng && !isJpeg) throw Error(`${file.name} is not a supported JPG or PNG.`);
          const img = isPng ? await output.embedPng(bytes) : await output.embedJpg(bytes);
          const s = Math.min((A4[0]-2*m)/img.width,(A4[1]-2*m)/img.height);
          const w=img.width*s,h=img.height*s;
          const page=output.addPage(A4);
          page.drawImage(img,{x:(A4[0]-w)/2,y:(A4[1]-h)/2,width:w,height:h});
        }
        await save(output,'images-converted.pdf');
      } else {
        if (files.length !== 1) throw Error('Please select exactly one PDF.');
        const input = await loadPdf(files[0]);
        const total = input.getPageCount();
        if (type === 'split-pdf' || type === 'remove-pages') {
          const chosen = pageSelection(document.getElementById('ranges').value,total);
          const pages = type === 'split-pdf' ? chosen : input.getPageIndices().filter(i=>!chosen.includes(i));
          if (pages.length === 0) throw Error('At least one page must remain in the output.');
          const output=await PDFLib.PDFDocument.create();
          (await output.copyPages(input,pages)).forEach(p=>output.addPage(p));
          await save(output,type==='split-pdf'?'selected-pages.pdf':'pages-removed.pdf');
        } else if (type === 'rotate-pdf') {
          const amount = Number(document.getElementById('rotation').value);
          for (const page of input.getPages()) {
            const angle=page.getRotation().angle;
            page.setRotation(PDFLib.degrees(((angle+amount)%360+360)%360));
          }
          await save(input,'rotated-document.pdf');
        } else if (type === 'watermark-pdf') {
          const label=document.getElementById('watermark').value.trim();
          if (!label) throw Error('Enter a watermark.');
          if (!/^[\x20-\x7E]+$/.test(label)) throw Error('This starter currently supports basic Latin characters only in watermarks.');
          const font=await input.embedFont(PDFLib.StandardFonts.HelveticaBold);
          for (const page of input.getPages()) {
            const {width,height}=page.getSize();
            const fontSize=Math.min(58,Math.max(14, Math.min(width,height)/Math.max(6,label.length*.65)));
            const tw=font.widthOfTextAtSize(label,fontSize);
            page.drawText(label,{x:(width-tw*.76)/2,y:height/2-40,font,size:fontSize,color:PDFLib.rgb(.16,.34,.63),opacity:.2,rotate:PDFLib.degrees(35)});
          }
          await save(input,'watermarked-document.pdf');
        } else { throw Error('Tool is not configured.'); }
      }
      setMessage('Finished! Select Download PDF below, or Open PDF to preview the result.','good');
    } catch(error) { setMessage(error.message || 'Unable to process this file.','error'); }
    finally {processButton.disabled=false;}
  });
})();
