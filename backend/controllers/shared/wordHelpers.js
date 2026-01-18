import fs from "fs";
import path from "path";
import pdf from "pdf-poppler";
import sharp from "sharp";
import { Paragraph, ImageRun, TextRun, AlignmentType } from "docx";

/* ================= PDF → IMAGE ================= */
export const convertPDFToImages = async (pdfPath) => {
  try {
    const outputDir = path.join(path.dirname(pdfPath), "temp_images");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const prefix = path.basename(pdfPath, ".pdf");

    const opts = {
      format: "jpeg",
      out_dir: outputDir,
      out_prefix: prefix,
      page: null,
      scale: 1024
    };

    await pdf.convert(pdfPath, opts);

    const files = fs.readdirSync(outputDir)
      .filter(f => f.startsWith(prefix))
      .sort()
      .map(f => path.join(outputDir, f));

    const finalImages = [];

    for (const imgPath of files) {
      try {
        const buffer = await sharp(imgPath).rotate().trim({ threshold: 10 }).toBuffer();
        await sharp(buffer).toFile(imgPath);
      } catch {}
      finalImages.push(imgPath);
    }

    return finalImages;
  } catch (err) {
    console.error("PDF convert error:", err.message);
    return [];
  }
};

/* ================= IMAGE CHECK ================= */
export const isImageFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext);
};

/* ================= FILE SECTION (WORD) ================= */
export const createWordFileSection = async (category, files) => {
  const sections = [];

  sections.push(new Paragraph({
    children: [new TextRun({ text: `${category}:`, bold: true, size: 20 })],
    spacing: { after: 100 }
  }));

  if (!files || files.length === 0) {
    sections.push(new Paragraph({ text: "N/A" }));
    return sections;
  }

  for (const file of files) {
    let images = [];

    if (isImageFile(file.path)) {
      images = [file.path];
    } else if (path.extname(file.path).toLowerCase() === ".pdf") {
      images = await convertPDFToImages(file.path);
    }

    if (images.length === 0) {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: `📄 ${file.caption || "Document"} (stored as PDF)`, italics: true })
        ]
      }));
      continue;
    }

    for (const imgPath of images) {
      if (!fs.existsSync(imgPath)) continue;

      const buffer = fs.readFileSync(imgPath);

      sections.push(new Paragraph({
        children: [
          new ImageRun({
            data: buffer,
            transformation: { width: 500, height: 350 }
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }));

      if (file.caption) {
        sections.push(new Paragraph({
          children: [new TextRun({ text: file.caption, italics: true, size: 18 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }));
      }
    }

    // cleanup temp images
    if (path.extname(file.path).toLowerCase() === ".pdf") {
      images.forEach(img => fs.existsSync(img) && fs.unlinkSync(img));
    }
  }

  return sections;
};
