/* Original Docvelio image-task editorial briefs and limitations. */
module.exports=[
  {
    "slug": "resize-image",
    "title": "Resize Image Online – Change Photo Width and Height",
    "description": "Resize JPG, PNG and WebP pictures by pixel dimensions online. Preserve aspect ratio, adjust width or height, and download a new image privately in your browser.",
    "primary": "Resize an image by pixels",
    "lead": "Change an image's pixel width and height for a website, a presentation or a document without installing editing software.",
    "details": [
      "Image dimensions and file size are not the same thing. A 1200 × 800 pixel photo has a different display size from a 600 × 400 pixel copy, even if the two files happen to occupy similar amounts of storage.",
      "To preserve the shape of a picture, keep the aspect-ratio checkbox enabled. Enter a new width and the height updates proportionally, or enter a height to calculate a matching width. You can turn that option off when you deliberately need independent dimensions.",
      "Reducing dimensions discards pixels. Enlarging an image creates pixels by interpolation; it cannot recreate details missing from the original. Check text labels, faces and sharp edges after resizing."
    ],
    "steps": [
      "Select a JPG, PNG, WebP or other supported browser image.",
      "Set the desired pixel width or height and keep aspect ratio enabled unless distortion is intended.",
      "Apply Resize, preview the result, choose JPG, PNG or WebP, and download a separate copy."
    ],
    "faq": [
      [
        "Can I resize without stretching the photo?",
        "Yes. Leave Maintain aspect ratio selected so width and height change together."
      ],
      [
        "Does changing pixel size always reduce the file size?",
        "No. Storage size also depends on format, image complexity and export quality."
      ]
    ],
    "active": "resize"
  },
  {
    "slug": "crop-image",
    "title": "Crop Image Online – Trim Photos to an Exact Area",
    "description": "Crop photos online by dragging over the preview or entering X, Y, width and height. Keep only the needed pixels and export JPG, PNG or WebP with Docvelio.",
    "primary": "Crop a photo to a selected region",
    "lead": "Remove unwanted edges, focus on your subject or prepare a rectangular excerpt from a larger picture.",
    "details": [
      "Cropping removes pixels outside the selected area. Unlike resizing, it changes what is included in the frame instead of simply changing how many pixels represent the whole scene.",
      "Drag a rectangle over the preview or enter numerical coordinates and dimensions when you need a precise crop. The preview uses actual pixel positions from the opened image. Large images may be scaled for display, but the selection is applied to the original canvas coordinates.",
      "Cropping can make a picture more useful, but it cannot restore detail after the retained area is enlarged. Save a copy before experimenting, especially with scans, document photographs or irreplaceable originals."
    ],
    "steps": [
      "Open the image and drag across the canvas to select an area, or enter crop coordinates.",
      "Choose Crop to keep the selected rectangle; use Undo if the framing is wrong.",
      "Review the output dimensions and download a copy in your preferred image format."
    ],
    "faq": [
      [
        "Can I crop to exact pixel dimensions?",
        "Yes. Enter the crop X and Y positions together with its width and height."
      ],
      [
        "Is cropping the same as image resizing?",
        "No. Cropping removes outer areas; resizing changes the pixel dimensions of the image."
      ]
    ],
    "active": "crop"
  },
  {
    "slug": "rotate-image",
    "title": "Rotate Image Online – Turn Photos Left or Right",
    "description": "Rotate an image online in 90-degree steps to fix sideways photos or scans. Preview, undo and export JPG, PNG or WebP directly in your browser.",
    "primary": "Rotate sideways photos and scans",
    "lead": "Correct the orientation of a photograph or scanned page with a quarter turn to the left or right.",
    "details": [
      "An image can appear sideways when camera orientation information is not interpreted as expected, or when a scanned document is saved in landscape orientation.",
      "Docvelio's Rotate controls turn the displayed pixels 90 degrees left or right. Two quarter turns create a 180-degree rotation. The canvas dimensions switch when needed so the full image remains visible.",
      "Rotation is not perspective correction or automatic deskewing. If lines in a photographed page are slanted within the picture, a 90-degree turn will not straighten them. Check the exported copy before using it in an application."
    ],
    "steps": [
      "Choose the image with the incorrect orientation.",
      "Use Left 90° or Right 90° until the content is upright.",
      "Preview the full picture, select an export format and download the rotated version."
    ],
    "faq": [
      [
        "Can I rotate an image 180 degrees?",
        "Yes. Apply the left or right 90-degree rotation twice."
      ],
      [
        "Will Rotate Image straighten a crooked document scan?",
        "Not automatically. It fixes the orientation by 90-degree increments, not skewed lines within a page."
      ]
    ],
    "active": "rotate"
  },
  {
    "slug": "flip-image",
    "title": "Flip or Mirror Image Online – Horizontal and Vertical",
    "description": "Mirror an image horizontally or flip it vertically online. Compare the result in the preview, undo changes and download JPG, PNG or WebP.",
    "primary": "Mirror or flip your image",
    "lead": "Reverse a photo from left to right or top to bottom without changing its pixel dimensions.",
    "details": [
      "Horizontal flipping creates a mirror image: objects that were on the left appear on the right. It can help with composition, symmetrical design studies or correcting a reversed camera image.",
      "Vertical flipping turns the pixel order from top to bottom. This is different from rotating a picture 180 degrees, which changes both horizontal and vertical positions.",
      "Mirroring is usually unsuitable for images containing legible writing, dates, road signs or logos because it reverses the text. Inspect the preview before downloading and use Undo to compare variations."
    ],
    "steps": [
      "Open the picture and choose Flip horizontal for a mirror effect or Flip vertical for an upside-down reflection.",
      "Review lettering, logos and faces in the preview, and undo if necessary.",
      "Download the mirrored image as a fresh JPG, PNG or WebP file."
    ],
    "faq": [
      [
        "Does mirroring reduce image resolution?",
        "The pixel dimensions stay the same; saving as JPEG or WebP can still introduce encoding changes."
      ],
      [
        "Why does the text appear reversed?",
        "A horizontal mirror reverses all pixels, including letters and symbols."
      ]
    ],
    "active": "flip"
  },
  {
    "slug": "convert-image",
    "title": "Image Converter Online – JPG, PNG and WebP",
    "description": "Convert supported images to JPG, PNG or WebP with a browser-based image converter. Choose format and quality, preview your picture and save a new file.",
    "primary": "Convert JPG, PNG and WebP images",
    "lead": "Choose a picture format suited to photographs, sharp graphics, transparency or smaller web downloads.",
    "details": [
      "JPEG is widely compatible and well suited to photographs, but it does not support transparency. When converting a transparent image to JPG, this tool places it on a white background.",
      "PNG preserves transparent areas and avoids JPEG-style lossy encoding, making it useful for graphics, screenshots and sharp edges. WebP is supported in modern browsers and may produce smaller photographic files at an appropriate quality level.",
      "Converting formats does not improve blurry or low-resolution input. Browser support determines which files can be opened; animated GIF input is treated as a still frame here. Docvelio does not offer TIFF or animated GIF export."
    ],
    "steps": [
      "Choose a supported image from your device.",
      "Select JPG, PNG or WebP in the Export format menu; use the quality setting for JPG or WebP.",
      "Preview and download the converted image. Check transparency and appearance if you changed formats."
    ],
    "faq": [
      [
        "Can I convert transparent PNG to JPEG?",
        "Yes, but JPEG has no alpha channel, so transparent areas are filled white."
      ],
      [
        "Can I export TIFF or animated GIF?",
        "No. Current output formats are JPG, PNG and WebP, and animations are not preserved."
      ]
    ],
    "active": "convert"
  },
  {
    "slug": "reduce-image-size-kb",
    "title": "Reduce Image Size in KB Online – Target File Size",
    "description": "Reduce a JPG or WebP towards a target KB size in Docvelio. Set a file-size goal, adjust image quality and download your result using local browser processing.",
    "primary": "Reduce an image towards a KB target",
    "lead": "Prepare an attachment for a form or upload limit by setting a target size in kilobytes.",
    "details": [
      "An application might require a photograph below 100 KB or 200 KB. The number of pixels and the number of bytes are different, so simply setting a width does not guarantee that an image will meet the upload limit.",
      "Choose JPG or WebP, enable Aim for target file size and enter the desired number of kilobytes. Docvelio tries different compression quality settings and may reduce image dimensions when the first result is still too large.",
      "The result is best-effort, not an exact guaranteed KB value. The required file size may be impossible while preserving acceptable quality. PNG output does not support this target-size mode in the current editor. Review faces, text and fine details before using the file."
    ],
    "steps": [
      "Open the photo and select JPG or WebP as the export format.",
      "Turn on Aim for target file size, enter a target such as 100 or 200 KB, and download.",
      "Inspect the actual saved size and visible quality before uploading it to another service."
    ],
    "faq": [
      [
        "Can I reduce a photo to exactly 100 KB?",
        "The tool attempts to reach or fall below your target, but exact byte size and success are not guaranteed."
      ],
      [
        "Does PNG support target-KB compression here?",
        "No. Choose JPG or WebP for the target-size option."
      ]
    ],
    "active": "target"
  },
  {
    "slug": "pixelate-image",
    "title": "Pixelate Image Online – Apply a Blocky Pixel Effect",
    "description": "Pixelate a whole image or a selected area using adjustable block size. Preview pixelated effects and download JPG, PNG or WebP in your browser.",
    "primary": "Create a pixelated photo effect",
    "lead": "Turn part of an image or the whole picture into large blocks of colour.",
    "details": [
      "Pixelation groups neighbouring pixels into larger blocks. It is often used as a design effect, to simplify complex images or to draw visual attention to particular regions.",
      "Upload an image, optionally drag to select a rectangular area, choose Block size and click Apply pixelation. A larger block size creates a more abstract appearance; smaller blocks preserve more of the original details.",
      "Pixelation is not secure redaction. Faces, names or confidential text might remain identifiable or recoverable from patterns, context, other copies or metadata. Use purpose-built redaction or masking workflows when sensitive information must be permanently removed."
    ],
    "steps": [
      "Open the picture and, if desired, drag over a section to select it.",
      "Choose a block size and apply Pixelate to the selection or whole image.",
      "Inspect the visible effect and export a new file. Do not treat this as secure privacy protection."
    ],
    "faq": [
      [
        "Can I pixelate only one area?",
        "Yes. Drag over the area first; the effect is applied to that selection."
      ],
      [
        "Is pixelation sufficient to anonymise a document?",
        "No. It is an appearance effect, not a reliable way to eliminate sensitive information."
      ]
    ],
    "active": "pixelate"
  },
  {
    "slug": "black-and-white-image",
    "title": "Black and White Image Converter – Grayscale or Two Tones",
    "description": "Convert an image to grayscale or pure black and white online. Choose the effect, preview the result and download JPG, PNG or WebP with Docvelio.",
    "primary": "Convert photos to grayscale or pure black and white",
    "lead": "Create monochrome versions of photographs, diagrams or graphic designs with two distinct effects.",
    "details": [
      "Grayscale conversion keeps many shades between black and white. This is useful for subtle portraits, preparing a design proof or checking colour-independent contrast.",
      "Pure black-and-white conversion reduces each pixel to black or white using a fixed brightness threshold. It can emphasise shapes, but may remove fine texture, mid-tones and delicate detail.",
      "Both effects are permanent in the exported copy, so keep your original colour image. Black-and-white processing does not perform document OCR, background removal or automatic scan enhancement."
    ],
    "steps": [
      "Choose a photo and open the Black and white controls.",
      "Select Grayscale for shades of grey, or Black and white for a high-contrast two-tone look.",
      "Review the preview and download the new image, keeping the original intact."
    ],
    "faq": [
      [
        "What is the difference between grayscale and black and white?",
        "Grayscale preserves intermediate shades; the two-tone option uses only black or white pixels."
      ],
      [
        "Can I recover the original colours after exporting?",
        "Not from the black-and-white output alone. Keep the original image or use Undo before leaving the editor."
      ]
    ],
    "active": "mono"
  }
];
