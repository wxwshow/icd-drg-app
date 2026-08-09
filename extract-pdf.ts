// extract-pdf.ts — Extract text from ICD-10 PDF
// Run: npx tsx extract-pdf.ts

import { readFileSync, writeFileSync } from 'fs';
const pdfParse = require('pdf-parse');

async function main() {
  const pdfPath = 'D:/ICD-10医保2.0版.pdf';
  console.log(`Reading: ${pdfPath}`);

  const buffer = readFileSync(pdfPath);
  const data = await pdfParse(buffer);

  console.log(`\n=== PDF Info ===`);
  console.log(`Pages: ${data.numpages}`);
  console.log(`Text length: ${data.text.length} chars`);

  // Save full text to file
  writeFileSync('D:/icd10_full_text.txt', data.text, 'utf-8');
  console.log(`Full text saved to: D:/icd10_full_text.txt`);

  // Show first 3000 chars to understand structure
  console.log(`\n=== First 3000 chars ===`);
  console.log(data.text.substring(0, 3000));
}

main().catch(console.error);
