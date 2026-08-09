// generate-drg.cjs — Generate CN-DRG groups and ICD-to-DRG mappings
// Run: node generate-drg.cjs

const { writeFileSync } = require('fs');

// ============================================================
// 1. Define MDC structure (Major Diagnostic Categories)
// ============================================================
const MDCS = [
  { code: 'MDC 01', name: '神经系统疾病及功能障碍', letter: 'B' },
  { code: 'MDC 02', name: '眼及附属器官疾病及功能障碍', letter: 'C' },
  { code: 'MDC 03', name: '耳鼻口咽疾病及功能障碍', letter: 'D' },
  { code: 'MDC 04', name: '呼吸系统疾病及功能障碍', letter: 'E' },
  { code: 'MDC 05', name: '循环系统疾病及功能障碍', letter: 'F' },
  { code: 'MDC 06', name: '消化系统疾病及功能障碍', letter: 'G' },
  { code: 'MDC 07', name: '肝胆胰疾病及功能障碍', letter: 'H' },
  { code: 'MDC 08', name: '肌肉骨骼系统及结缔组织疾病及功能障碍', letter: 'I' },
  { code: 'MDC 09', name: '皮肤、皮下组织及乳腺疾病及功能障碍', letter: 'J' },
  { code: 'MDC 10', name: '内分泌、营养、代谢疾病及功能障碍', letter: 'K' },
  { code: 'MDC 11', name: '肾脏及泌尿道疾病及功能障碍', letter: 'L' },
  { code: 'MDC 12', name: '男性生殖系统疾病及功能障碍', letter: 'M' },
  { code: 'MDC 13', name: '女性生殖系统疾病及功能障碍', letter: 'N' },
  { code: 'MDC 14', name: '妊娠、分娩及产褥期', letter: 'O' },
  { code: 'MDC 15', name: '新生儿及围生期疾病', letter: 'P' },
  { code: 'MDC 16', name: '血液、免疫及造血器官疾病', letter: 'Q' },
  { code: 'MDC 17', name: '骨髓增生性疾病及肿瘤', letter: 'R' },
  { code: 'MDC 18', name: '感染及寄生虫病（全身性或不明确部位）', letter: 'S' },
  { code: 'MDC 19', name: '精神疾病及功能障碍', letter: 'T' },
  { code: 'MDC 20', name: '酒精/药物使用及器质性精神障碍', letter: 'U' },
  { code: 'MDC 21', name: '损伤、中毒及药物毒性效应', letter: 'V' },
  { code: 'MDC 22', name: '烧伤', letter: 'W' },
  { code: 'MDC 23', name: '影响健康状态的因素及其他', letter: 'X' },
];

// ICD-10 code range → MDC mapping
const ICD_TO_MDC = [
  { pattern: /^A/, mdc: 'MDC 18', desc: '感染及寄生虫病' },
  { pattern: /^B/, mdc: 'MDC 18', desc: '感染及寄生虫病' },
  { pattern: /^C0[0-9]|^C1[0-4]/, mdc: 'MDC 03', desc: '头颈部肿瘤' },
  { pattern: /^C1[5-9]|^C2[0-9]|^C3[0-9]/, mdc: 'MDC 04', desc: '胸部肿瘤' },
  { pattern: /^C1[5-6]/, mdc: 'MDC 06', desc: '消化道肿瘤' },
  { pattern: /^C2[2-5]/, mdc: 'MDC 07', desc: '肝胆肿瘤' },
  { pattern: /^C/, mdc: 'MDC 17', desc: '肿瘤' },
  { pattern: /^D0[0-9]/, mdc: 'MDC 03', desc: '头颈原位癌' },
  { pattern: /^D[15]/, mdc: 'MDC 17', desc: '血液肿瘤' },
  { pattern: /^D/, mdc: 'MDC 16', desc: '血液及免疫' },
  { pattern: /^E/, mdc: 'MDC 10', desc: '内分泌营养代谢' },
  { pattern: /^F0[0-9]/, mdc: 'MDC 20', desc: '器质性精神障碍' },
  { pattern: /^F/, mdc: 'MDC 19', desc: '精神疾病' },
  { pattern: /^G0[0-9]|^G1[0-9]|^G[2-4]/, mdc: 'MDC 01', desc: '神经系统' },
  { pattern: /^G4[5-7]/, mdc: 'MDC 01', desc: '脑血管病(内科)' },
  { pattern: /^G/, mdc: 'MDC 01', desc: '神经系统' },
  { pattern: /^H0[0-5]/, mdc: 'MDC 02', desc: '眼科' },
  { pattern: /^H6[0-9]|^H[7-9]/, mdc: 'MDC 03', desc: '耳鼻口咽' },
  { pattern: /^H/, mdc: 'MDC 02', desc: '眼科' },
  { pattern: /^I/, mdc: 'MDC 05', desc: '循环系统' },
  { pattern: /^J/, mdc: 'MDC 04', desc: '呼吸系统' },
  { pattern: /^K0[0-6]|^K9/, mdc: 'MDC 06', desc: '消化系统(口腔/食管/胃肠)' },
  { pattern: /^K7[0-9]|^K8/, mdc: 'MDC 07', desc: '肝胆胰' },
  { pattern: /^K/, mdc: 'MDC 06', desc: '消化系统' },
  { pattern: /^L/, mdc: 'MDC 09', desc: '皮肤及乳腺' },
  { pattern: /^M0[0-2]/, mdc: 'MDC 18', desc: '感染性关节病' },
  { pattern: /^M/, mdc: 'MDC 08', desc: '肌肉骨骼' },
  { pattern: /^N0[0-3]|^N0[5-8]|^N1[0-9]/, mdc: 'MDC 11', desc: '肾脏泌尿道' },
  { pattern: /^N4[0-9]/, mdc: 'MDC 12', desc: '男性生殖' },
  { pattern: /^N[6-9]/, mdc: 'MDC 13', desc: '女性生殖' },
  { pattern: /^N/, mdc: 'MDC 11', desc: '肾脏泌尿道' },
  { pattern: /^O/, mdc: 'MDC 14', desc: '妊娠分娩' },
  { pattern: /^P/, mdc: 'MDC 15', desc: '新生儿围生期' },
  { pattern: /^Q/, mdc: 'MDC 23', desc: '先天畸形' },
  { pattern: /^R/, mdc: 'MDC 23', desc: '症状体征' },
  { pattern: /^S|^T0[0-3]/, mdc: 'MDC 21', desc: '损伤中毒' },
  { pattern: /^T2[0-9]|^T3[0-2]/, mdc: 'MDC 22', desc: '烧伤' },
  { pattern: /^T/, mdc: 'MDC 21', desc: '损伤中毒' },
  { pattern: /^Z/, mdc: 'MDC 23', desc: '健康因素' },
];

// ============================================================
// 2. Define DRG groups per MDC
// ============================================================
// Pattern: { code, description, type, weight, gmlos, suffix: [A,B,C] for severity tiers }
// A = with MCC, B = with CC, C = without CC/MCC

const DRG_TEMPLATES = [
  // MDC 01: Nervous system (B)
  { mdc: 'MDC 01', code: 'B01', desc: '开颅手术', type: 'surgical', weight: 4.5, gmlos: 15 },
  { mdc: 'MDC 01', code: 'B02', desc: '脊柱手术', type: 'surgical', weight: 3.2, gmlos: 10 },
  { mdc: 'MDC 01', code: 'B03', desc: '脑血管介入手术', type: 'surgical', weight: 3.8, gmlos: 12 },
  { mdc: 'MDC 01', code: 'B04', desc: '脑卒中(内科)', type: 'medical', weight: 1.5, gmlos: 9 },
  { mdc: 'MDC 01', code: 'B05', desc: '癫痫', type: 'medical', weight: 0.8, gmlos: 5 },
  { mdc: 'MDC 01', code: 'B06', desc: '头痛及脑血管病', type: 'medical', weight: 0.7, gmlos: 4 },
  { mdc: 'MDC 01', code: 'B07', desc: '周围神经疾病', type: 'medical', weight: 0.7, gmlos: 5 },

  // MDC 04: Respiratory (E)
  { mdc: 'MDC 04', code: 'E01', desc: '胸部大手术', type: 'surgical', weight: 3.5, gmlos: 12 },
  { mdc: 'MDC 04', code: 'E02', desc: '其他呼吸系统手术', type: 'surgical', weight: 2.0, gmlos: 8 },
  { mdc: 'MDC 04', code: 'E03', desc: '慢性阻塞性肺疾病', type: 'medical', weight: 1.1, gmlos: 6 },
  { mdc: 'MDC 04', code: 'E04', desc: '肺炎及胸膜炎', type: 'medical', weight: 0.8, gmlos: 5 },
  { mdc: 'MDC 04', code: 'E05', desc: '呼吸系统感染/炎症', type: 'medical', weight: 0.6, gmlos: 4 },
  { mdc: 'MDC 04', code: 'E06', desc: '支气管炎及哮喘', type: 'medical', weight: 0.5, gmlos: 3 },
  { mdc: 'MDC 04', code: 'E07', desc: '肺栓塞', type: 'medical', weight: 1.3, gmlos: 7 },

  // MDC 05: Circulatory (F)
  { mdc: 'MDC 05', code: 'F01', desc: '心脏移植/心室辅助', type: 'surgical', weight: 12.0, gmlos: 30 },
  { mdc: 'MDC 05', code: 'F02', desc: '心脏瓣膜手术', type: 'surgical', weight: 5.5, gmlos: 16 },
  { mdc: 'MDC 05', code: 'F03', desc: '冠状动脉搭桥手术', type: 'surgical', weight: 5.0, gmlos: 15 },
  { mdc: 'MDC 05', code: 'F04', desc: '经皮冠脉介入治疗(PCI)', type: 'surgical', weight: 3.5, gmlos: 7 },
  { mdc: 'MDC 05', code: 'F05', desc: '其他心血管手术', type: 'surgical', weight: 2.8, gmlos: 10 },
  { mdc: 'MDC 05', code: 'F06', desc: '心力衰竭和休克', type: 'medical', weight: 1.2, gmlos: 6 },
  { mdc: 'MDC 05', code: 'F07', desc: '高血压', type: 'medical', weight: 0.6, gmlos: 3 },
  { mdc: 'MDC 05', code: 'F08', desc: '冠心病及心绞痛', type: 'medical', weight: 0.7, gmlos: 4 },
  { mdc: 'MDC 05', code: 'F09', desc: '心律失常及传导障碍', type: 'medical', weight: 0.8, gmlos: 4 },
  { mdc: 'MDC 05', code: 'F10', desc: '脑血管疾病(内科)', type: 'medical', weight: 1.2, gmlos: 7 },
  { mdc: 'MDC 05', code: 'F11', desc: '外周血管疾病', type: 'medical', weight: 0.9, gmlos: 5 },

  // MDC 06: Digestive (G)
  { mdc: 'MDC 06', code: 'G01', desc: '消化道大手术', type: 'surgical', weight: 3.8, gmlos: 12 },
  { mdc: 'MDC 06', code: 'G02', desc: '消化道其他手术', type: 'surgical', weight: 1.8, gmlos: 7 },
  { mdc: 'MDC 06', code: 'G03', desc: '消化道溃疡', type: 'medical', weight: 0.7, gmlos: 4 },
  { mdc: 'MDC 06', code: 'G04', desc: '消化道出血', type: 'medical', weight: 0.9, gmlos: 5 },
  { mdc: 'MDC 06', code: 'G05', desc: '阑尾炎及腹股沟疝', type: 'medical', weight: 0.5, gmlos: 3 },
  { mdc: 'MDC 06', code: 'G06', desc: '消化道其他疾病', type: 'medical', weight: 0.6, gmlos: 4 },

  // MDC 07: Hepatobiliary/Pancreas (H)
  { mdc: 'MDC 07', code: 'H01', desc: '肝胆胰大手术', type: 'surgical', weight: 4.2, gmlos: 14 },
  { mdc: 'MDC 07', code: 'H02', desc: '肝胆胰其他手术', type: 'surgical', weight: 2.5, gmlos: 9 },
  { mdc: 'MDC 07', code: 'H03', desc: '肝病(内科)', type: 'medical', weight: 1.0, gmlos: 7 },
  { mdc: 'MDC 07', code: 'H04', desc: '胆道疾病(内科)', type: 'medical', weight: 0.6, gmlos: 4 },
  { mdc: 'MDC 07', code: 'H05', desc: '胰腺疾病(内科)', type: 'medical', weight: 0.9, gmlos: 6 },

  // MDC 08: Musculoskeletal (I)
  { mdc: 'MDC 08', code: 'I01', desc: '关节置换手术', type: 'surgical', weight: 3.0, gmlos: 9 },
  { mdc: 'MDC 08', code: 'I02', desc: '脊柱融合手术', type: 'surgical', weight: 3.5, gmlos: 11 },
  { mdc: 'MDC 08', code: 'I03', desc: '其他骨骼肌肉手术', type: 'surgical', weight: 1.5, gmlos: 6 },
  { mdc: 'MDC 08', code: 'I04', desc: '骨折及关节病(内科)', type: 'medical', weight: 0.7, gmlos: 5 },
  { mdc: 'MDC 08', code: 'I05', desc: '腰背痛及软组织疾病', type: 'medical', weight: 0.5, gmlos: 4 },

  // MDC 10: Endocrine (K)
  { mdc: 'MDC 10', code: 'K01', desc: '内分泌手术', type: 'surgical', weight: 2.0, gmlos: 7 },
  { mdc: 'MDC 10', code: 'K02', desc: '糖尿病', type: 'medical', weight: 0.9, gmlos: 5 },
  { mdc: 'MDC 10', code: 'K03', desc: '其他内分泌/代谢疾病', type: 'medical', weight: 0.7, gmlos: 4 },

  // MDC 11: Kidney/Urinary (L)
  { mdc: 'MDC 11', code: 'L01', desc: '泌尿系统大手术', type: 'surgical', weight: 3.2, gmlos: 11 },
  { mdc: 'MDC 11', code: 'L02', desc: '泌尿系统其他手术', type: 'surgical', weight: 1.5, gmlos: 6 },
  { mdc: 'MDC 11', code: 'L03', desc: '肾衰竭', type: 'medical', weight: 1.4, gmlos: 7 },
  { mdc: 'MDC 11', code: 'L04', desc: '泌尿道感染', type: 'medical', weight: 0.5, gmlos: 3 },
  { mdc: 'MDC 11', code: 'L05', desc: '泌尿系结石', type: 'medical', weight: 0.4, gmlos: 2 },

  // MDC 15: Newborns (P)
  { mdc: 'MDC 15', code: 'P01', desc: '新生儿手术', type: 'surgical', weight: 5.0, gmlos: 15 },
  { mdc: 'MDC 15', code: 'P02', desc: '新生儿疾病(内科)', type: 'medical', weight: 2.0, gmlos: 8 },

  // MDC 16: Blood/Immune (Q)
  { mdc: 'MDC 16', code: 'Q01', desc: '脾切除手术', type: 'surgical', weight: 2.5, gmlos: 9 },
  { mdc: 'MDC 16', code: 'Q02', desc: '血液及免疫疾病', type: 'medical', weight: 0.9, gmlos: 5 },

  // MDC 18: Infectious (S)
  { mdc: 'MDC 18', code: 'S01', desc: '感染/寄生虫手术', type: 'surgical', weight: 3.0, gmlos: 10 },
  { mdc: 'MDC 18', code: 'S02', desc: '败血症', type: 'medical', weight: 1.8, gmlos: 8 },
  { mdc: 'MDC 18', code: 'S03', desc: '感染性疾病(内科)', type: 'medical', weight: 0.8, gmlos: 5 },

  // MDC 19: Mental (T)
  { mdc: 'MDC 19', code: 'T01', desc: '精神分裂症', type: 'medical', weight: 0.9, gmlos: 15 },
  { mdc: 'MDC 19', code: 'T02', desc: '心境障碍', type: 'medical', weight: 0.7, gmlos: 10 },
  { mdc: 'MDC 19', code: 'T03', desc: '焦虑及其他精神障碍', type: 'medical', weight: 0.5, gmlos: 8 },

  // MDC 21: Injury/Toxic (V)
  { mdc: 'MDC 21', code: 'V01', desc: '外伤手术', type: 'surgical', weight: 2.5, gmlos: 8 },
  { mdc: 'MDC 21', code: 'V02', desc: '外伤及中毒(内科)', type: 'medical', weight: 0.6, gmlos: 4 },

  // MDC 22: Burns (W)
  { mdc: 'MDC 22', code: 'W01', desc: '烧伤手术', type: 'surgical', weight: 5.0, gmlos: 15 },
  { mdc: 'MDC 22', code: 'W02', desc: '烧伤(内科)', type: 'medical', weight: 1.5, gmlos: 8 },
];

// Severity suffix tiers for medical DRGs
const MEDICAL_TIERS = [
  { suffix: 'A', label: '伴严重合并症/并发症', weightMul: 1.35, gmlosAdd: 2.5 },
  { suffix: 'B', label: '伴合并症/并发症', weightMul: 1.0, gmlosAdd: 1.0 },
  { suffix: 'C', label: '不伴合并症/并发症', weightMul: 0.72, gmlosAdd: -1.0 },
];

const SURGICAL_TIERS = [
  { suffix: 'A', label: '伴严重合并症/并发症', weightMul: 1.3, gmlosAdd: 3.0 },
  { suffix: 'B', label: '不伴严重合并症/并发症', weightMul: 0.85, gmlosAdd: 0 },
];

// ============================================================
// 3. Generate all DRG groups
// ============================================================
const drgGroups = [];
const drgMap = new Map(); // drg_code → { mdc, desc, type, weight, gmlos }

// Expanded DRG templates into specific codes with severity tiers
for (const tpl of DRG_TEMPLATES) {
  const tiers = tpl.type === 'medical' ? MEDICAL_TIERS : SURGICAL_TIERS;
  for (const tier of tiers) {
    const drgCode = `DRG ${tpl.code}${tier.suffix}`;
    const mdcObj = MDCS.find(m => m.code === tpl.mdc);
    const weight = Math.round(tpl.weight * tier.weightMul * 10000) / 10000;
    const gmlos = Math.round((tpl.gmlos + tier.gmlosAdd) * 100) / 100;

    drgGroups.push({
      drg_code: drgCode,
      description: `${tpl.desc}，${tier.label}`,
      mdc_code: tpl.mdc,
      mdc_description: mdcObj?.name ?? '',
      drg_type: tpl.type,
      relative_weight: weight,
      gmlos: gmlos,
    });

    drgMap.set(drgCode, {
      drg_code: drgCode,
      description: `${tpl.desc}，${tier.label}`,
      mdc_code: tpl.mdc,
      mdc_description: mdcObj?.name ?? '',
      drg_type: tpl.type,
      relative_weight: weight,
    });
  }
}

console.log(`Generated ${drgGroups.length} DRG groups`);

// ============================================================
// 4. Generate ICD→DRG mappings
// ============================================================

// CHAPTER → MDC → DRG mapping (simplified for medical DRGs)
// For surgical DRGs, we'd need procedure codes, so we only map to medical DRGs by default

// Map ICD code letter ranges to their primary MDC medical DRGs
const LETTER_TO_MDC_DRGS = {
  'A': { mdc: 'MDC 18', drgs: ['DRG S02', 'DRG S03'] },  // Infectious: sepsis or general
  'B': { mdc: 'MDC 18', drgs: ['DRG S02', 'DRG S03'] },
  'C': { mdc: 'MDC 17', drgs: [] },  // Neoplasms - need specific handling
  'D': { mdc: 'MDC 16', drgs: ['DRG Q02'] },
  'E': { mdc: 'MDC 10', drgs: ['DRG K02', 'DRG K03'] },
  'F': { mdc: 'MDC 19', drgs: ['DRG T01', 'DRG T02', 'DRG T03'] },
  'G': { mdc: 'MDC 01', drgs: ['DRG B04', 'DRG B05', 'DRG B06', 'DRG B07'] },
  'H': { mdc: 'MDC 02', drgs: [] },
  'I': { mdc: 'MDC 05', drgs: ['DRG F06', 'DRG F07', 'DRG F08', 'DRG F09', 'DRG F11'] },
  'J': { mdc: 'MDC 04', drgs: ['DRG E03', 'DRG E04', 'DRG E05', 'DRG E06', 'DRG E07'] },
  'K': { mdc: 'MDC 06', drgs: ['DRG G03', 'DRG G04', 'DRG G05', 'DRG G06'] },
  'L': { mdc: 'MDC 09', drgs: [] },
  'M': { mdc: 'MDC 08', drgs: ['DRG I04', 'DRG I05'] },
  'N': { mdc: 'MDC 11', drgs: ['DRG L03', 'DRG L04', 'DRG L05'] },
  'O': { mdc: 'MDC 14', drgs: [] },
  'P': { mdc: 'MDC 15', drgs: ['DRG P02'] },
  'Q': { mdc: 'MDC 23', drgs: [] },
  'R': { mdc: 'MDC 23', drgs: [] },
  'S': { mdc: 'MDC 21', drgs: ['DRG V02'] },
  'T': { mdc: 'MDC 21', drgs: ['DRG V02'] },
  'V': { mdc: 'MDC 21', drgs: ['DRG V02'] },
  'W': { mdc: 'MDC 21', drgs: ['DRG V02'] },
  'X': { mdc: 'MDC 21', drgs: ['DRG V02'] },
  'Y': { mdc: 'MDC 21', drgs: ['DRG V02'] },
  'Z': { mdc: 'MDC 23', drgs: [] },
};

// CC/MCC indicator lists (severe conditions that bump DRG to A/B tier)
const MCC_PATTERNS = [
  /^A4[01]/, /^B2[0-4]/, /^C/, /^J96/, /^N18\.[56]/, /^N18\.6/,
  /^R57/, /^I50/, /^K72/, /^J80/, /^J81/, /^N17/,
];
const CC_PATTERNS = [
  /^E11/, /^I10/, /^I48/, /^N18\.[34]/, /^J44/, /^E87/,
  /^F0[0-9]/, /^F1[0-9]/, /^G4[0-9]/,
];

function getDRGForLetter(letter) {
  return LETTER_TO_MDC_DRGS[letter] || { mdc: 'MDC 23', drgs: [] };
}

function isMCC(code) {
  return MCC_PATTERNS.some(p => p.test(code));
}

function isCC(code) {
  return CC_PATTERNS.some(p => p.test(code));
}

// ============================================================
// 5. Complex code → DRG mapping logic
// ============================================================

// More specific mapping for common categories
function getSpecificDRG(code, desc) {
  const fullDesc = desc || '';
  const code3 = code.substring(0, 3);

  // Very specific DRG assignments based on code category
  const specificMap = {
    // Circulatory MDC 05
    'I21': { drg: 'DRG F08', role: 'principal_diagnosis' },  // STEMI → CHD/Angina
    'I22': { drg: 'DRG F08', role: 'principal_diagnosis' },
    'I25': { drg: 'DRG F08', role: 'principal_diagnosis' },  // Ischemic HD
    'I50': { drg: 'DRG F06', role: 'principal_diagnosis' },  // Heart failure
    'I11': { drg: 'DRG F07', role: 'principal_diagnosis' },  // Hypertensive HD
    'I12': { drg: 'DRG F07', role: 'principal_diagnosis' },  // Hypertensive renal
    'I48': { drg: 'DRG F09', role: 'principal_diagnosis' },  // Atrial fib
    'I49': { drg: 'DRG F09', role: 'principal_diagnosis' },
    'I47': { drg: 'DRG F09', role: 'principal_diagnosis' },
    'I63': { drg: 'DRG F10', role: 'principal_diagnosis' },  // Cerebral infarct
    'I64': { drg: 'DRG F10', role: 'principal_diagnosis' },
    'I70': { drg: 'DRG F11', role: 'principal_diagnosis' },  // Atherosclerosis
    'I71': { drg: 'DRG F11', role: 'principal_diagnosis' },  // Aortic aneurysm

    // Respiratory MDC 04
    'J44': { drg: 'DRG E03', role: 'principal_diagnosis' },  // COPD
    'J15': { drg: 'DRG E04', role: 'principal_diagnosis' },  // Bacterial pneumonia
    'J18': { drg: 'DRG E04', role: 'principal_diagnosis' },
    'J96': { drg: 'DRG E07', role: 'principal_diagnosis' },  // Respiratory failure
    'J20': { drg: 'DRG E06', role: 'principal_diagnosis' },  // Bronchitis
    'J45': { drg: 'DRG E06', role: 'principal_diagnosis' },  // Asthma

    // Digestive MDC 06
    'K25': { drg: 'DRG G03', role: 'principal_diagnosis' },  // Gastric ulcer
    'K26': { drg: 'DRG G03', role: 'principal_diagnosis' },
    'K29': { drg: 'DRG G03', role: 'principal_diagnosis' },
    'K92': { drg: 'DRG G04', role: 'principal_diagnosis' },  // GI bleeding
    'K35': { drg: 'DRG G05', role: 'principal_diagnosis' },
    'K40': { drg: 'DRG G05', role: 'principal_diagnosis' },

    // Hepatobiliary MDC 07
    'K70': { drg: 'DRG H03', role: 'principal_diagnosis' },
    'K72': { drg: 'DRG H03', role: 'principal_diagnosis' },
    'K74': { drg: 'DRG H03', role: 'principal_diagnosis' },
    'K80': { drg: 'DRG H04', role: 'principal_diagnosis' },
    'K85': { drg: 'DRG H05', role: 'principal_diagnosis' },

    // Endocrine MDC 10
    'E10': { drg: 'DRG K02', role: 'principal_diagnosis' },  // T1DM
    'E11': { drg: 'DRG K02', role: 'principal_diagnosis' },  // T2DM
    'E14': { drg: 'DRG K02', role: 'principal_diagnosis' },

    // Renal MDC 11
    'N17': { drg: 'DRG L03', role: 'principal_diagnosis' },  // ARF
    'N18': { drg: 'DRG L03', role: 'principal_diagnosis' },  // CKD
    'N19': { drg: 'DRG L03', role: 'principal_diagnosis' },
    'N20': { drg: 'DRG L05', role: 'principal_diagnosis' },
    'N39': { drg: 'DRG L04', role: 'principal_diagnosis' },

    // Infectious MDC 18
    'A41': { drg: 'DRG S02', role: 'principal_diagnosis' },  // Sepsis
    'A40': { drg: 'DRG S02', role: 'principal_diagnosis' },

    // Musculoskeletal MDC 08
    'M17': { drg: 'DRG I04', role: 'principal_diagnosis' },
    'M48': { drg: 'DRG I05', role: 'principal_diagnosis' },
    'S72': { drg: 'DRG I04', role: 'principal_diagnosis' },

    // Nervous MDC 01
    'G40': { drg: 'DRG B05', role: 'principal_diagnosis' },  // Epilepsy
    'G41': { drg: 'DRG B05', role: 'principal_diagnosis' },
    'G43': { drg: 'DRG B06', role: 'principal_diagnosis' },  // Migraine
    'G44': { drg: 'DRG B06', role: 'principal_diagnosis' },

    // Mental MDC 19
    'F20': { drg: 'DRG T01', role: 'principal_diagnosis' },
    'F32': { drg: 'DRG T02', role: 'principal_diagnosis' },
    'F33': { drg: 'DRG T02', role: 'principal_diagnosis' },
    'F41': { drg: 'DRG T03', role: 'principal_diagnosis' },
  };

  if (specificMap[code3]) return specificMap[code3];

  // By letter
  const letterInfo = getDRGForLetter(code.charAt(0));
  if (letterInfo.drgs.length > 0) {
    const drg = letterInfo.drgs[0]; // Use first (lowest severity) DRG as default
    return { drg, role: 'principal_diagnosis' };
  }

  return null;
}

// ============================================================
// 6. Write SQL output
// ============================================================
const sql = [];

sql.push('-- Generated CN-DRG data');
sql.push('DELETE FROM icd_drg_mappings;');
sql.push('DELETE FROM drg_groups;');
sql.push('');

// DRG Groups INSERT
sql.push('INSERT INTO drg_groups (drg_code, description, mdc_code, mdc_description, relative_weight, gmlos, drg_type) VALUES');
const vals = [];
for (const g of drgGroups) {
  vals.push(`('${g.drg_code}', '${g.description.replace(/'/g, "''")}', '${g.mdc_code}', '${g.mdc_description.replace(/'/g, "''")}', ${g.relative_weight}, ${g.gmlos}, '${g.drg_type}')`);
}
sql.push('  ' + vals.join(',\n  ') + ';');
sql.push('');

// DO block for mappings
sql.push('DO $$');
sql.push('DECLARE rec RECORD; v_drg_id UUID;');
sql.push('BEGIN');

// Letter-based default mappings
const processed = new Set();
for (const [letter, info] of Object.entries(LETTER_TO_MDC_DRGS)) {
  if (info.drgs.length === 0) continue;
  const drg = info.drgs[0];
  const key = `${letter}_${drg}`;
  if (processed.has(key)) continue;
  processed.add(key);

  sql.push(`  FOR rec IN SELECT id, code FROM icd_codes WHERE code LIKE '${letter}%' LOOP`);
  sql.push(`    SELECT id INTO v_drg_id FROM drg_groups WHERE drg_code = '${drg}' LIMIT 1;`);
  sql.push(`    IF v_drg_id IS NOT NULL THEN`);
  sql.push(`      INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role) VALUES (rec.id, v_drg_id, 'principal_diagnosis') ON CONFLICT DO NOTHING;`);
  sql.push(`    END IF;`);
  sql.push(`  END LOOP;`);
}

// Specific overrides
const overrides = {
  'I21':'DRG F08','I22':'DRG F08','I25':'DRG F08',
  'I50':'DRG F06','I11':'DRG F07','I12':'DRG F07',
  'I48':'DRG F09','I49':'DRG F09','I47':'DRG F09',
  'I63':'DRG F10','I64':'DRG F10',
  'I70':'DRG F11','I71':'DRG F11',
  'J44':'DRG E03','J15':'DRG E04','J18':'DRG E04',
  'J96':'DRG E07','J45':'DRG E06',
  'K25':'DRG G03','K26':'DRG G03','K29':'DRG G03',
  'K92':'DRG G04','K35':'DRG G05','K40':'DRG G05',
  'K70':'DRG H03','K72':'DRG H03','K74':'DRG H03',
  'K80':'DRG H04','K85':'DRG H05',
  'E10':'DRG K02','E11':'DRG K02','E14':'DRG K02',
  'N17':'DRG L03','N18':'DRG L03','N19':'DRG L03',
  'N20':'DRG L05','N39':'DRG L04',
  'A41':'DRG S02','A40':'DRG S02',
  'M17':'DRG I04','M48':'DRG I05','S72':'DRG I04',
  'G40':'DRG B05','G43':'DRG B06',
  'F20':'DRG T01','F32':'DRG T02',
};
for (const [code3, drg] of Object.entries(overrides)) {
  sql.push(`  UPDATE icd_drg_mappings im SET drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = '${drg}' LIMIT 1) FROM icd_codes ic WHERE im.icd_code_id = ic.id AND ic.code LIKE '${code3}%';`);
}

// CC/MCC role assignments
sql.push(`  FOR rec IN SELECT ic.id, im.id AS mid FROM icd_codes ic JOIN icd_drg_mappings im ON im.icd_code_id = ic.id WHERE ic.code ~ '^(A4[01]|B2[0-4]|J96|N18\\\\.6|R57|J80|J81|N17|K72|I50)' AND im.role = 'principal_diagnosis' LOOP`);
sql.push("    UPDATE icd_drg_mappings SET role = 'mcc' WHERE id = rec.mid;");
sql.push(`  END LOOP;`);

sql.push(`  FOR rec IN SELECT ic.id, im.id AS mid FROM icd_codes ic JOIN icd_drg_mappings im ON im.icd_code_id = ic.id WHERE ic.code ~ '^(E11|I10|I48|N18\\\\.3|N18\\\\.4|J44|E87)' AND im.role = 'principal_diagnosis' LOOP`);
sql.push("    UPDATE icd_drg_mappings SET role = 'cc' WHERE id = rec.mid;");
sql.push(`  END LOOP;`);

sql.push('END $$;');
sql.push('');
sql.push(`-- ${drgGroups.length} DRG groups with ICD→DRG mapping rules`);

writeFileSync('D:/1cursor/icd-drg-app/supabase/seed_drg.sql', sql.join('\n'), 'utf-8');
console.log(`Written seed_drg.sql (${(sql.join('\n').length / 1024).toFixed(1)} KB)`);
