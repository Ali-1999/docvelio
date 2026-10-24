/* Docvelio's original English PDF guide content. */
'use strict';
module.exports = [
  {
    "slug": "how-to-edit-pdf-online",
    "title": "How to Edit a PDF Online: Annotations, Text and Safe Workflows",
    "keyword": "edit PDF online",
    "tool": "edit-pdf",
    "related": [
      "word-editor",
      "add-image-to-pdf",
      "sign-pdf"
    ],
    "summary": "Learn what a free online PDF editor can and cannot change, how to annotate a document, and how to preserve the original.",
    "sections": [
      [
        "Choose the right kind of PDF edit",
        "The phrase edit PDF online can mean several different jobs. You may need to comment on a contract, highlight a paragraph, add a label to a diagram, fill a field or rewrite existing text. A viewer that allows annotations handles the first three tasks; rewriting embedded text while preserving font metrics and positioning is a different, more complex operation. Identifying the task before uploading or opening a file saves rework."
      ],
      [
        "Add PDF annotations without changing the source file",
        "In Docvelio, open the PDF editor, select a document from your device and use the available text, drawing and highlighting controls. Add comments beside the affected passage rather than covering the original words. Save a new copy and compare it against the source. If the recipient must see changes in context, annotations are often clearer than pasting edited screenshots into a PDF."
      ],
      [
        "Know when a Word document is better",
        "If you need to rewrite several paragraphs, revise a table or change headings consistently, seek the original DOCX instead of modifying a flattened PDF. A Word editor offers more natural text flow for those tasks. Converting between formats can change line breaks, fonts and page counts, especially with scanned pages or complex layouts, so review the output."
      ],
      [
        "Redaction, signatures and accuracy checks",
        "A black rectangle or white shape placed over confidential words is not secure PDF redaction: underlying text may still be recoverable. Use a dedicated redaction workflow when information must be permanently removed. Similarly, a drawn signature picture is not a certificate-backed digital signature. Before sharing the edited PDF, review every page for misplaced marks, inaccessible text and accidental disclosure."
      ]
    ],
    "steps": [
      "Keep an untouched copy of the PDF and decide which pages need changes.",
      "Open the PDF editor and add labels, freehand marks or highlights without obscuring important content.",
      "Export the result, reopen it and compare page count, legibility and sensitive information with the original."
    ],
    "faq": [
      [
        "Can I change existing PDF words directly?",
        "Docvelio's PDF editor focuses on visible annotations. It does not reliably rewrite embedded PDF text while preserving its original font and layout."
      ],
      [
        "Can I use a shape to remove sensitive text?",
        "No. Visual covering is not secure redaction. Use software specifically designed to permanently remove underlying content."
      ]
    ]
  },
  {
    "slug": "how-to-merge-pdf-files",
    "title": "How to Merge PDF Files Online Without Losing Page Order",
    "keyword": "merge PDF files",
    "tool": "merge-pdf",
    "related": [
      "organize-pdf",
      "split-pdf",
      "remove-pages"
    ],
    "summary": "A practical way to combine multiple PDF documents, confirm page order and create one shareable file.",
    "sections": [
      [
        "Prepare documents before combining them",
        "Merging several PDFs is useful when you must send an application with attachments, combine a report with appendices or create one print-ready handout. Give each input a clear filename such as 01-cover, 02-report and 03-appendix. Check orientation, duplicates and page size first. Merge tools join existing pages; they usually cannot repair poor scans or mismatched formatting."
      ],
      [
        "Merge files in a deliberate reading sequence",
        "Open Docvelio's Merge PDF tool and select the documents in the order the reader should see them. Review the selected list before processing. A cover letter normally comes before supporting evidence; a table of contents should reflect the final page sequence. When an individual source PDF has its own page numbering, that numbering may not match its position in the merged file."
      ],
      [
        "Check the resulting PDF rather than assuming success",
        "Download the combined document and browse the beginning, a middle section and the final page. Make sure nothing was clipped, rotated or omitted. If the files use bookmarks, internal links or digital signatures, verify those features separately. Combining pages can invalidate existing digital signatures and may not preserve every interactive document feature."
      ],
      [
        "Organize or extract pages after merging",
        "Use Organize PDF to change the page sequence or duplicate a page, and Split PDF or Remove Pages to isolate or delete selected pages. Keep the individual source files until you have confirmed the final document is complete. A well-structured PDF is easier to search, review and archive."
      ]
    ],
    "steps": [
      "Name and inspect each source file; identify the correct order.",
      "Select the PDFs in Merge PDF and process them into one file.",
      "Open the result, verify the first and last pages and check any references to page numbers."
    ],
    "faq": [
      [
        "Does merging reduce PDF quality?",
        "The goal is to combine existing pages rather than recompress photographs, but you should always inspect the exported file."
      ],
      [
        "Can I reorder pages after merging?",
        "Yes. The separate Organize PDF tool can reorder pages by entering the desired page-number sequence."
      ]
    ]
  },
  {
    "slug": "split-pdf-extract-pages",
    "title": "Split PDF Pages Online: Extract, Remove and Share Only What You Need",
    "keyword": "split PDF online",
    "tool": "split-pdf",
    "related": [
      "remove-pages",
      "organize-pdf",
      "merge-pdf"
    ],
    "summary": "How to extract specific PDF pages, preserve the original and avoid disclosing unrelated pages.",
    "sections": [
      [
        "Decide what the recipient actually needs",
        "A long PDF may contain multiple chapters, financial pages, appendices or supporting records. Sending the entire file often creates unnecessary reading and privacy risk. Splitting a PDF allows you to provide only the relevant pages. Before extraction, check whether the document uses printed page labels that differ from the PDF viewer's page numbers."
      ],
      [
        "Select precise page ranges",
        "In Docvelio, use the Split PDF tool to specify the desired pages or ranges. A selection like 1-3,5 generally means the first three pages and page five, not the numbers printed on the paper itself. Preview the original so you can confirm the range. Do not rely on page labels in a table of contents if a cover sheet shifts the numbering."
      ],
      [
        "Choose between extracting and deleting",
        "Extract Pages creates a smaller copy containing the selected pages. Remove Pages does the opposite: it creates a copy without the pages you specify. Both can be useful, but the privacy outcome differs. If you only need one form page for a recipient, extraction is usually simpler and easier to verify than deleting every unrelated page."
      ],
      [
        "Review sensitive content and cross-references",
        "After downloading, check the first and last extracted pages for missing notes, incomplete tables or references to an absent appendix. Removing pages does not automatically remove sensitive text on pages you retain. If the task involves redaction, use dedicated secure redaction tools rather than covering visible text with a shape."
      ]
    ],
    "steps": [
      "Open the original PDF and note viewer page numbers.",
      "Select the exact page numbers or ranges in Split PDF.",
      "Download the new PDF and inspect each retained page before sending."
    ],
    "faq": [
      [
        "Can I split a PDF without altering the original?",
        "Yes. The result is a new document; retain the original file so you can restore any omitted sections."
      ],
      [
        "Does deleting a page erase secret text elsewhere?",
        "No. Only the specified pages are removed. Text on remaining pages requires separate review."
      ]
    ]
  },
  {
    "slug": "compress-pdf-file-size",
    "title": "How to Compress a PDF: File Size, Image Quality and Searchable Text",
    "keyword": "compress PDF online",
    "tool": "compress-pdf",
    "related": [
      "compress-image",
      "pdf-to-jpg",
      "view-pdf"
    ],
    "summary": "Understand PDF file compression, quality trade-offs and why rasterizing pages can remove searchable text.",
    "sections": [
      [
        "First identify what makes the PDF large",
        "An image-heavy PDF scanned at high resolution has different compression opportunities from a text-based PDF with embedded fonts. Before processing, check file size, number of pages and whether words can be selected. If the document consists mostly of crisp vector text, a raster-based method can make the file larger rather than smaller."
      ],
      [
        "Understand raster-based PDF compression",
        "Docvelio's browser PDF compressor renders pages as images and stores JPEG representations in a new PDF. This may help large scans, but it changes how the document behaves. Searchable/selectable text, form fields, hyperlinks, bookmarks and some accessibility structure can be lost. It is not the same as optimizing the existing PDF objects while preserving everything."
      ],
      [
        "Choose the right quality for the actual use",
        "For a document read mainly on screen, moderate image quality may be sufficient. For diagrams, small type or documents that will be printed, higher quality is safer. Test one representative page and zoom in to see whether punctuation and fine lines remain legible. The smallest file is not necessarily the best file."
      ],
      [
        "Alternatives that preserve more information",
        "If the problem is just a few oversized photographs, reduce their size before combining them into a PDF. If you need searchable text or filled forms, use a specialist PDF optimizer that retains those objects rather than rasterizing. Always keep a copy of the source and compare file size, legibility and interactivity after compression."
      ]
    ],
    "steps": [
      "Check whether the original PDF is scanned or contains selectable text.",
      "Set a quality level and run the compression only if losing selectable text and form interactivity is acceptable.",
      "Compare output size, zoomed text, links and page count with the original before replacing a file."
    ],
    "faq": [
      [
        "Will compression always make my PDF smaller?",
        "No. Rasterizing small or text-heavy PDFs can increase their size."
      ],
      [
        "Will my PDF stay searchable?",
        "Not with this specific raster-based process. It can turn text into page images."
      ]
    ]
  },
  {
    "slug": "convert-pdf-to-jpg-png",
    "title": "Convert PDF to JPG or PNG: Which Image Format Should You Choose?",
    "keyword": "PDF to JPG PNG",
    "tool": "pdf-to-jpg",
    "related": [
      "pdf-to-png",
      "compress-image",
      "images-to-pdf"
    ],
    "summary": "Compare PDF-to-JPG and PDF-to-PNG conversion for documents, diagrams and presentation graphics.",
    "sections": [
      [
        "When a page image is the right output",
        "Converting a PDF page to an image is helpful for a presentation, a thumbnail or a visual excerpt that must appear in a system with no PDF preview. Exported pictures look like the page, but they do not carry selectable document text, form fields or interactive links. If someone needs to quote paragraphs, share the original PDF instead."
      ],
      [
        "Choose JPG for photographs and smaller visual files",
        "JPEG is a lossy format often suitable for full-colour photography, flyers and illustrated pages. Its quality setting trades visual detail for file size. Repeatedly saving JPEG images can introduce artefacts around thin letters or sharp lines, so inspect labels and captions at the expected display size."
      ],
      [
        "Choose PNG for fine lines and interface screenshots",
        "PNG uses lossless image encoding and can preserve hard edges in diagrams, tables and screenshots more accurately. It may be larger than JPG, particularly for photographic pages. Neither format magically increases resolution: a blurry scan remains blurry when exported as PNG."
      ],
      [
        "Handle multi-page PDFs thoughtfully",
        "Docvelio converts pages individually; when you export a multi-page PDF, the images can be packaged into a ZIP. Use sequential filenames to preserve order. If you later need a single PDF again, the Images to PDF tool can assemble pictures into pages, but the result may differ from the original in page dimensions and text behaviour."
      ]
    ],
    "steps": [
      "Open the PDF to JPG or PDF to PNG tool and select your source PDF.",
      "Choose JPG for photographic material or PNG for diagrams and crisp graphical edges.",
      "Download the image or ZIP and check resolution and page order."
    ],
    "faq": [
      [
        "Is PNG always clearer than JPG?",
        "PNG avoids JPEG compression artefacts but cannot restore detail missing from the source PDF."
      ],
      [
        "Can I turn the exported images back into a PDF?",
        "Yes, use Images to PDF; note that pictures do not restore original selectable text."
      ]
    ]
  },
  {
    "slug": "convert-images-to-pdf",
    "title": "Convert JPG and PNG Images to PDF: Photos, Scans and Receipts",
    "keyword": "JPG to PDF PNG to PDF",
    "tool": "images-to-pdf",
    "related": [
      "compress-image",
      "merge-pdf",
      "pdf-to-png"
    ],
    "summary": "Combine photographs, scans and screenshots into one PDF while choosing sensible page order and image quality.",
    "sections": [
      [
        "Why combine images into a PDF?",
        "A PDF provides one document for a set of photos, scanned receipts or image-only forms. Rather than sending twenty separate files, you can share a single multi-page attachment with predictable reading order. This is especially useful for expense records, class handouts and visual evidence, though OCR is still needed if text must become searchable."
      ],
      [
        "Start with legible, well-oriented images",
        "Rotate any upside-down photographs before assembling. Crop excessive desk or background space, but avoid trimming handwritten notes or receipt totals. Name or arrange images in the desired page order. If you include screenshots, check that every label remains readable at normal PDF zoom."
      ],
      [
        "Understand how image fitting works",
        "Docvelio's Images to PDF workflow places images on standard pages, preserving their proportions rather than stretching them to fill every edge. Wide or narrow images may have white margins. Photos with very high pixel dimensions can create large files, especially when you include many pages."
      ],
      [
        "Reduce size without hiding important details",
        "Compress images before creating the PDF when the source photos are much larger than necessary. Always review small type and signatures after reduction. If you later need to join your image PDF to an existing report, use Merge PDF, and check the final order and orientation."
      ]
    ],
    "steps": [
      "Sort and orient JPG or PNG files into the intended reading sequence.",
      "Add the images to the Images to PDF tool and generate the document.",
      "Download the PDF, inspect the margins and check legibility on every page."
    ],
    "faq": [
      [
        "Will the resulting PDF contain searchable text?",
        "Not automatically. A photograph of text remains an image until processed by OCR."
      ],
      [
        "Can I add the resulting document to another PDF?",
        "Yes. Use the Merge PDF tool to combine the image-based PDF with existing PDF documents."
      ]
    ]
  },
  {
    "slug": "how-to-sign-pdf-online",
    "title": "How to Sign a PDF Online: Drawn Signatures Versus Digital Signatures",
    "keyword": "sign PDF online",
    "tool": "sign-pdf",
    "related": [
      "fill-pdf",
      "edit-pdf",
      "view-pdf"
    ],
    "summary": "Add a visible handwritten signature to a PDF and understand how that differs from certificate-backed digital signing.",
    "sections": [
      [
        "What online PDF signing can mean",
        "People use the phrase sign PDF online for several different actions: placing a picture of a signature, typing a name, approving through an e-signature service or applying a cryptographic digital signature. These approaches provide different evidence and security. Always follow the recipient's requirements, especially for regulated, financial or government documents."
      ],
      [
        "Draw and place a visible signature image",
        "Docvelio provides a signature drawing area. Use a mouse, touch screen or stylus to create a signature image and place it on a copy of the first or last PDF page. Check the placement; the recipient should not need to guess which box was signed. Retain the original document and review the exported copy."
      ],
      [
        "Understand the limits of a signature image",
        "A handwritten signature picture does not independently establish identity, signing time or document integrity. It is not the same as a digital signature backed by certificates and verification. If a recipient requires audit trails, identity checks or certificate validation, use a dedicated electronic-signature platform that supports those requirements."
      ],
      [
        "Complete the document before you sign",
        "Fill permitted form fields first, confirm names and dates, and ensure pages are in the right order. After signing, open the PDF again and check that nothing overlays essential text. Avoid sending confidential forms to a recipient without confirming their secure delivery process."
      ]
    ],
    "steps": [
      "Confirm whether the recipient accepts an image-based signature.",
      "Open Sign PDF, draw your signature and choose the page.",
      "Download and inspect the signed copy, then send it by the recipient's approved method."
    ],
    "faq": [
      [
        "Is this the same as a cryptographic digital signature?",
        "No. Docvelio's tool places an image of your signature and does not certify identity or document integrity."
      ],
      [
        "Will the tool verify the signer's identity?",
        "No. Identity verification and audit-trail services require a dedicated signing provider."
      ]
    ]
  },
  {
    "slug": "fill-pdf-forms-online",
    "title": "Fill PDF Forms Online: Interactive Fields, Checkboxes and Scanned Forms",
    "keyword": "fill PDF form online",
    "tool": "fill-pdf",
    "related": [
      "sign-pdf",
      "edit-pdf",
      "pdf-to-text"
    ],
    "summary": "Find out why some PDF forms are fillable and others are flat scans, plus a practical workflow for saving completed forms.",
    "sections": [
      [
        "Recognise an interactive PDF form",
        "A true fillable PDF contains form fields such as text boxes and checkboxes. You can click or tab between them in a compatible viewer. A scanned sheet may look identical, but it contains only pixels, with no interactive controls. Recognising this distinction helps explain why some forms open with editable fields and others do not."
      ],
      [
        "Fill existing PDF fields in your browser",
        "Choose the Fill PDF Forms tool and select the document. If supported interactive fields exist, they appear for editing; complete text fields and tick the relevant checkboxes. Review each answer against the source question. Avoid forcing long answers into very short fields, because display and printing can vary by viewer."
      ],
      [
        "Handle scanned forms differently",
        "When a form is an image-only scan, the tool cannot automatically detect editable AcroForm fields. You might annotate the page with text using a PDF editor, or obtain an original fillable version from the issuing organisation. OCR can extract printed text, but OCR alone does not create legally valid, correctly positioned form controls."
      ],
      [
        "Save, verify and sign when appropriate",
        "Export a completed copy and reopen it in a separate PDF viewer. Check that every response remains visible, that checkbox states are retained, and that no pages were lost. If a signature is required, verify whether a visual signature image is acceptable or whether the organisation requires a certified digital signature."
      ]
    ],
    "steps": [
      "Open the PDF and check whether its fields are truly interactive.",
      "Use Fill PDF Forms to enter answers and tick checkboxes, if supported.",
      "Save a new copy and review fields and any required signatures before submitting."
    ],
    "faq": [
      [
        "Why are no fields detected in my PDF?",
        "The document may be a scanned or flattened form without interactive AcroForm fields."
      ],
      [
        "Can the tool create new form fields?",
        "No. It fills existing supported fields; it is not a PDF form designer."
      ]
    ]
  },
  {
    "slug": "extract-text-scanned-pdf-ocr",
    "title": "Extract Text From a PDF: Selectable Text, Scanned Pages and OCR",
    "keyword": "extract text from PDF",
    "tool": "pdf-to-text",
    "related": [
      "view-pdf",
      "pdf-to-png",
      "word-editor"
    ],
    "summary": "Understand when PDF-to-text extraction works, when OCR is necessary and how to check formatting accuracy.",
    "sections": [
      [
        "Check whether the PDF contains real text",
        "Try selecting a short sentence in a PDF viewer. If you can highlight individual words and copy them, the file likely includes selectable text. If selecting only draws a rectangle around a photograph of a page, the document is probably image-based. That difference determines whether direct PDF-to-text extraction can work."
      ],
      [
        "Extract selectable text to a TXT file",
        "Docvelio's PDF to Text tool reads text already embedded in the PDF and exports it as plain text. This is useful when you need to search, quote or draft a summary from an accessible digital document. Plain text usually loses the visual placement of columns, headings, tables and diagrams, so inspect the result rather than assuming original reading order."
      ],
      [
        "What OCR can and cannot do",
        "Optical character recognition examines an image and predicts the letters it contains. It is needed for scanned pages and photographed documents. OCR accuracy depends on resolution, language, skew, handwriting and background contrast. Docvelio's current direct text extractor does not include OCR, so it will not transcribe a scanned page by itself."
      ],
      [
        "Review accuracy before reuse",
        "Check names, account references, numerals and punctuation against the PDF before using extracted text in a form or publication. Do not assume a text extraction output is proof that every part of a document was captured. If you need editable layout instead of plain text, work from the original Word source or a specialist document-conversion workflow."
      ]
    ],
    "steps": [
      "Open the PDF in a viewer and test whether you can select text.",
      "Use PDF to Text when the text is embedded; use a separate OCR service for image-only scans.",
      "Review the TXT output against the source, especially columns, tables and numbers."
    ],
    "faq": [
      [
        "Does this tool run OCR on scans?",
        "No. It extracts text already embedded in the PDF; image-only pages need a separate OCR engine."
      ],
      [
        "Will the extracted TXT preserve tables?",
        "Not reliably. Plain-text output typically needs manual editing to reconstruct table layout."
      ]
    ]
  },
  {
    "slug": "organize-rotate-delete-pdf-pages",
    "title": "Organize PDF Pages: Reorder, Rotate, Delete and Duplicate",
    "keyword": "organize PDF pages",
    "tool": "organize-pdf",
    "related": [
      "rotate-pdf",
      "remove-pages",
      "merge-pdf"
    ],
    "summary": "A clear workflow for reordering pages, fixing sideways scans, deleting duplicates and checking the final document.",
    "sections": [
      [
        "Map the correct page sequence",
        "PDF page order matters in applications, print packs and reports. A misplaced appendix can make a document look incomplete even when every page is present. Preview the pages and write down the sequence you need. Remember that the physical PDF page index may be different from a page number printed on the document."
      ],
      [
        "Reorder or duplicate pages",
        "Docvelio's Organize PDF tool accepts a page-number sequence such as 3,1,2. Enter a number again if a page should appear twice. This is a straightforward method for small documents, but it is not a drag-and-drop thumbnail arranger. Check the total number of pages and review the new first and last pages after export."
      ],
      [
        "Rotate sideways pages and remove duplicates",
        "Rotate PDF changes the display orientation of pages that arrived sideways or upside down. It cannot deskew a scan or fix blurry photography. Use Remove Pages to drop blank or duplicated sheets, or Split PDF to extract only the chapter you need. Prefer reversible workflows: store the original and work on a copy."
      ],
      [
        "Avoid broken references and accessibility surprises",
        "After changing page order, check tables of contents, internal links and page references. A PDF may include bookmarks or annotations that point to old page positions. Rotate and delete operations also should not be mistaken for content redaction. Before sharing, read the new document from beginning to end once to confirm everything is present."
      ]
    ],
    "steps": [
      "Preview the PDF and note the intended order and page orientation.",
      "Reorder, rotate or remove the appropriate pages using the relevant tools.",
      "Download a new file and check numbering, reading order and page count."
    ],
    "faq": [
      [
        "Can I reorder pages by dragging thumbnails?",
        "This Docvelio tool uses explicit page-number sequences rather than drag-and-drop thumbnails."
      ],
      [
        "Can rotating a PDF straighten a skewed scan?",
        "No. Rotation changes orientation; deskewing a scanned image requires a separate image-correction process."
      ]
    ]
  }
];
