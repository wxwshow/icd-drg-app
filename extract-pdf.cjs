// extract-pdf.cjs — Extract text from ICD-10 PDF
const { readFileSync, writeFileSync } = require('fs');
const { PDFParse } = require('pdf-parse');

async function main() {
  const pdfPath = 'D:/ICD-10医保2.0版.pdf';
  console.log(`Reading: ${pdfPath}`);

  const buffer = readFileSync(pdfPath);
  const parser = new PDFParse({ data: buffer });

  const result = await parser.getText();
  await parser.destroy();

  console.log(`\n=== PDF Info ===`);
  console.log(`Pages: ${result.pages?.length || 'N/A'}`);
  console.log(`Text length: ${result.text.length} chars`);

  // Save full text
  writeFileSync('D:/icd10_full_text.txt', result.text, 'utf-8');
  console.log(`Full text saved to: D:/icd10_full_text.txt`);

  // Show first 5000 chars
  console.log(`\n=== First 5000 chars ===`);
  console.log(result.text.substring(0, 5000));
}

main().catch(console.error);
