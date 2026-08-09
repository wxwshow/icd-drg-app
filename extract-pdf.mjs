// extract-pdf.mjs — Extract text from ICD-10 PDF
import { readFileSync } from 'fs';
import pdf from 'pdf-parse';

const pdfPath = 'D:/ICD-10医保2.0版.pdf';
console.log(`Reading: ${pdfPath}`);

const buffer = readFileSync(pdfPath);
const data = await pdf(buffer);

console.log(`\n=== PDF Info ===`);
console.log(`Pages: ${data.numpages}`);
console.log(`Text length: ${data.text.length} chars`);

// Show first 5000 chars to understand structure
console.log(`\n=== First 5000 chars ===`);
console.log(data.text.substring(0, 5000));
