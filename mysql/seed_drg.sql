-- CN-DRG Groups and ICD-to-DRG Mappings — MySQL Version
-- 转换为 MySQL：ON CONFLICT → INSERT IGNORE, UPDATE FROM → UPDATE JOIN

DELETE FROM icd_drg_mappings;
DELETE FROM drg_groups;

INSERT INTO drg_groups (drg_code, description, mdc_code, mdc_description, relative_weight, gmlos, drg_type) VALUES
('DRG F04B', '经皮冠脉介入治疗(PCI)', 'MDC 05', '循环系统疾病及功能障碍', 2.975, 7.0, 'surgical'),
('DRG I01B', '关节置换手术', 'MDC 08', '肌肉骨骼系统及结缔组织疾病', 2.55, 9.0, 'surgical'),
('DRG B04A', '脑卒中(内科)伴严重合并症', 'MDC 01', '神经系统疾病及功能障碍', 2.025, 11.5, 'medical'),
('DRG B04B', '脑卒中(内科)伴合并症', 'MDC 01', '神经系统疾病及功能障碍', 1.5, 9.0, 'medical'),
('DRG B04C', '脑卒中(内科)不伴合并症', 'MDC 01', '神经系统疾病及功能障碍', 1.08, 8.0, 'medical'),
('DRG B05C', '癫痫(内科)', 'MDC 01', '神经系统疾病及功能障碍', 0.576, 4.0, 'medical'),
('DRG B06C', '头痛及脑血管病(内科)', 'MDC 01', '神经系统疾病及功能障碍', 0.504, 3.0, 'medical'),
('DRG E03A', '慢性阻塞性肺疾病伴严重合并症', 'MDC 04', '呼吸系统疾病及功能障碍', 1.485, 8.5, 'medical'),
('DRG E03B', '慢性阻塞性肺疾病伴合并症', 'MDC 04', '呼吸系统疾病及功能障碍', 1.1, 6.0, 'medical'),
('DRG E03C', '慢性阻塞性肺疾病不伴合并症', 'MDC 04', '呼吸系统疾病及功能障碍', 0.792, 5.0, 'medical'),
('DRG E04A', '肺炎及胸膜炎伴严重合并症', 'MDC 04', '呼吸系统疾病及功能障碍', 1.08, 7.5, 'medical'),
('DRG E04B', '肺炎及胸膜炎伴合并症', 'MDC 04', '呼吸系统疾病及功能障碍', 0.8, 5.0, 'medical'),
('DRG E04C', '肺炎及胸膜炎不伴合并症', 'MDC 04', '呼吸系统疾病及功能障碍', 0.576, 4.0, 'medical'),
('DRG E06C', '支气管炎及哮喘(内科)', 'MDC 04', '呼吸系统疾病及功能障碍', 0.36, 2.0, 'medical'),
('DRG E07C', '肺栓塞(内科)', 'MDC 04', '呼吸系统疾病及功能障碍', 0.936, 6.0, 'medical'),
('DRG F06A', '心力衰竭和休克伴严重合并症', 'MDC 05', '循环系统疾病及功能障碍', 1.62, 8.5, 'medical'),
('DRG F06B', '心力衰竭和休克伴合并症', 'MDC 05', '循环系统疾病及功能障碍', 1.2, 6.0, 'medical'),
('DRG F06C', '心力衰竭和休克不伴合并症', 'MDC 05', '循环系统疾病及功能障碍', 0.864, 5.0, 'medical'),
('DRG F07B', '高血压伴合并症', 'MDC 05', '循环系统疾病及功能障碍', 0.6, 3.0, 'medical'),
('DRG F07C', '高血压不伴合并症', 'MDC 05', '循环系统疾病及功能障碍', 0.432, 2.0, 'medical'),
('DRG F08B', '冠心病及心绞痛伴合并症', 'MDC 05', '循环系统疾病及功能障碍', 0.7, 4.0, 'medical'),
('DRG F08C', '冠心病及心绞痛不伴合并症', 'MDC 05', '循环系统疾病及功能障碍', 0.504, 3.0, 'medical'),
('DRG F09C', '心律失常及传导障碍', 'MDC 05', '循环系统疾病及功能障碍', 0.576, 3.0, 'medical'),
('DRG F10A', '脑血管疾病(内科)伴严重合并症', 'MDC 05', '循环系统疾病及功能障碍', 1.62, 9.5, 'medical'),
('DRG F10B', '脑血管疾病(内科)伴合并症', 'MDC 05', '循环系统疾病及功能障碍', 1.2, 7.0, 'medical'),
('DRG F10C', '脑血管疾病(内科)不伴合并症', 'MDC 05', '循环系统疾病及功能障碍', 0.864, 6.0, 'medical'),
('DRG F11C', '外周血管疾病(内科)', 'MDC 05', '循环系统疾病及功能障碍', 0.648, 4.0, 'medical'),
('DRG G03C', '消化道溃疡(内科)', 'MDC 06', '消化系统疾病及功能障碍', 0.504, 3.0, 'medical'),
('DRG G04C', '消化道出血(内科)', 'MDC 06', '消化系统疾病及功能障碍', 0.648, 4.0, 'medical'),
('DRG H03C', '肝病(内科)', 'MDC 07', '肝胆胰疾病及功能障碍', 0.72, 6.0, 'medical'),
('DRG H04C', '胆道疾病(内科)', 'MDC 07', '肝胆胰疾病及功能障碍', 0.432, 3.0, 'medical'),
('DRG H05C', '胰腺疾病(内科)', 'MDC 07', '肝胆胰疾病及功能障碍', 0.648, 5.0, 'medical'),
('DRG I04C', '骨折及关节病(内科)', 'MDC 08', '肌肉骨骼系统疾病', 0.504, 4.0, 'medical'),
('DRG I05C', '腰背痛及软组织疾病', 'MDC 08', '肌肉骨骼系统疾病', 0.36, 3.0, 'medical'),
('DRG K02A', '糖尿病伴严重合并症', 'MDC 10', '内分泌营养代谢疾病', 1.215, 7.5, 'medical'),
('DRG K02B', '糖尿病伴合并症', 'MDC 10', '内分泌营养代谢疾病', 0.9, 5.0, 'medical'),
('DRG K02C', '糖尿病不伴合并症', 'MDC 10', '内分泌营养代谢疾病', 0.648, 4.0, 'medical'),
('DRG K03C', '其他内分泌代谢疾病', 'MDC 10', '内分泌营养代谢疾病', 0.504, 3.0, 'medical'),
('DRG L03A', '肾衰竭伴严重合并症', 'MDC 11', '肾脏及泌尿道疾病', 1.89, 9.5, 'medical'),
('DRG L03B', '肾衰竭伴合并症', 'MDC 11', '肾脏及泌尿道疾病', 1.4, 7.0, 'medical'),
('DRG L03C', '肾衰竭不伴合并症', 'MDC 11', '肾脏及泌尿道疾病', 1.008, 6.0, 'medical'),
('DRG L04C', '泌尿道感染(内科)', 'MDC 11', '肾脏及泌尿道疾病', 0.36, 2.0, 'medical'),
('DRG L05C', '泌尿系结石(内科)', 'MDC 11', '肾脏及泌尿道疾病', 0.288, 1.0, 'medical'),
('DRG S02A', '败血症伴严重合并症', 'MDC 18', '感染及寄生虫病', 2.43, 10.5, 'medical'),
('DRG S02B', '败血症伴合并症', 'MDC 18', '感染及寄生虫病', 1.8, 8.0, 'medical'),
('DRG S02C', '败血症不伴合并症', 'MDC 18', '感染及寄生虫病', 1.296, 7.0, 'medical'),
('DRG S03C', '感染性疾病(内科)', 'MDC 18', '感染及寄生虫病', 0.576, 4.0, 'medical'),
('DRG T01C', '精神分裂症', 'MDC 19', '精神疾病及功能障碍', 0.648, 14.0, 'medical'),
('DRG T02C', '心境障碍', 'MDC 19', '精神疾病及功能障碍', 0.504, 9.0, 'medical'),
('DRG T03C', '焦虑及其他精神障碍', 'MDC 19', '精神疾病及功能障碍', 0.36, 7.0, 'medical'),
('DRG V02C', '外伤及中毒(内科)', 'MDC 21', '损伤中毒及药物毒性效应', 0.432, 3.0, 'medical'),
('DRG P02C', '新生儿疾病(内科)', 'MDC 15', '新生儿及围生期疾病', 1.44, 7.0, 'medical'),
('DRG Q02C', '血液及免疫疾病(内科)', 'MDC 16', '血液免疫及造血器官疾病', 0.648, 4.0, 'medical');

-- ============================================================
-- Default mappings: INSERT IGNORE（跳过重复，替代 PG 的 ON CONFLICT DO NOTHING）
-- ============================================================

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'I%' AND dg.drg_code = 'DRG F11C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'J%' AND dg.drg_code = 'DRG E04C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE (ic.code LIKE 'A%' OR ic.code LIKE 'B%') AND dg.drg_code = 'DRG S03C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'E%' AND dg.drg_code = 'DRG K03C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'F%' AND dg.drg_code = 'DRG T03C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'G%' AND dg.drg_code = 'DRG B05C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'K%' AND dg.drg_code = 'DRG G03C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'M%' AND dg.drg_code = 'DRG I04C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'N%' AND dg.drg_code = 'DRG L04C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'D%' AND dg.drg_code = 'DRG Q02C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE (ic.code LIKE 'S%' OR ic.code LIKE 'T%' OR ic.code LIKE 'V%' OR ic.code LIKE 'W%' OR ic.code LIKE 'X%' OR ic.code LIKE 'Y%') AND dg.drg_code = 'DRG V02C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'Z%' AND dg.drg_code = 'DRG V02C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'P%' AND dg.drg_code = 'DRG P02C';

INSERT IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
SELECT ic.id, dg.id, 'principal_diagnosis'
FROM icd_codes ic CROSS JOIN drg_groups dg
WHERE ic.code LIKE 'C%' AND dg.drg_code = 'DRG Q02C';

-- ============================================================
-- Specific overrides: UPDATE ... JOIN（替代 PG 的 UPDATE ... FROM）
-- ============================================================

-- Heart failure I50 → F06C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG F06C')
WHERE ic.code LIKE 'I50%';

-- Hypertension I10-I12 → F07B
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG F07B')
WHERE ic.code LIKE 'I10%' OR ic.code LIKE 'I11%' OR ic.code LIKE 'I12%';

-- CHD/Angina I21,I22,I25 → F08B
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG F08B')
WHERE ic.code LIKE 'I21%' OR ic.code LIKE 'I22%' OR ic.code LIKE 'I25%';

-- Arrhythmia I47-I49 → F09C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG F09C')
WHERE ic.code LIKE 'I47%' OR ic.code LIKE 'I48%' OR ic.code LIKE 'I49%';

-- Stroke I63,I64 → F10B
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG F10B')
WHERE ic.code LIKE 'I63%' OR ic.code LIKE 'I64%';

-- COPD J44 → E03B
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG E03B')
WHERE ic.code LIKE 'J44%';

-- Pneumonia J15,J18 → E04B
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG E04B')
WHERE ic.code LIKE 'J15%' OR ic.code LIKE 'J18%';

-- Asthma J45 → E06C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG E06C')
WHERE ic.code LIKE 'J45%';

-- Resp failure J96 → E07C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG E07C')
WHERE ic.code LIKE 'J96%';

-- Diabetes E10,E11,E14 → K02B
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG K02B')
WHERE ic.code LIKE 'E10%' OR ic.code LIKE 'E11%' OR ic.code LIKE 'E14%';

-- Renal failure N17,N18,N19 → L03B
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG L03B')
WHERE ic.code LIKE 'N17%' OR ic.code LIKE 'N18%' OR ic.code LIKE 'N19%';

-- UTI N39 → L04C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG L04C')
WHERE ic.code LIKE 'N39%';

-- Kidney stones N20 → L05C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG L05C')
WHERE ic.code LIKE 'N20%';

-- Sepsis A40,A41 → S02B
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG S02B')
WHERE ic.code LIKE 'A40%' OR ic.code LIKE 'A41%';

-- OA M17, Fracture S72 → I04C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG I04C')
WHERE ic.code LIKE 'M17%' OR ic.code LIKE 'S72%';

-- Spinal M48 → I05C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG I05C')
WHERE ic.code LIKE 'M48%';

-- Epilepsy G40 → B05C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG B05C')
WHERE ic.code LIKE 'G40%';

-- Migraine G43 → B06C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG B06C')
WHERE ic.code LIKE 'G43%';

-- Mental: F20→T01C, F32/F33→T02C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG T01C')
WHERE ic.code LIKE 'F20%';

UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG T02C')
WHERE ic.code LIKE 'F32%' OR ic.code LIKE 'F33%';

-- Liver K70,K72,K74 → H03C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG H03C')
WHERE ic.code LIKE 'K70%' OR ic.code LIKE 'K72%' OR ic.code LIKE 'K74%';

-- Biliary K80 → H04C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG H04C')
WHERE ic.code LIKE 'K80%';

-- Pancreatitis K85 → H05C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG H05C')
WHERE ic.code LIKE 'K85%';

-- GI ulcer/bleed K25,K26,K29→G03C, K92→G04C
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG G03C')
WHERE ic.code LIKE 'K25%' OR ic.code LIKE 'K26%' OR ic.code LIKE 'K29%';

UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.drg_group_id = (SELECT id FROM drg_groups WHERE drg_code = 'DRG G04C')
WHERE ic.code LIKE 'K92%';

-- ============================================================
-- CC/MCC Role assignments
-- ============================================================
UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.role = 'mcc'
WHERE ic.code LIKE 'A40%' OR ic.code LIKE 'A41%' OR ic.code LIKE 'J96%'
   OR ic.code LIKE 'J80%' OR ic.code LIKE 'J81%' OR ic.code LIKE 'N18.6%'
   OR ic.code LIKE 'N17%' OR ic.code LIKE 'I50%' OR ic.code LIKE 'K72%' OR ic.code LIKE 'R57%';

UPDATE icd_drg_mappings im
JOIN icd_codes ic ON im.icd_code_id = ic.id
SET im.role = 'cc'
WHERE im.role = 'principal_diagnosis'
  AND (ic.code LIKE 'E11%' OR ic.code LIKE 'I10%' OR ic.code LIKE 'I48%'
    OR ic.code LIKE 'N18.3%' OR ic.code LIKE 'N18.4%' OR ic.code LIKE 'J44%'
    OR ic.code LIKE 'E87%');

-- Verfiy
SELECT 'DRG Groups' AS type, count(*) AS cnt FROM drg_groups
UNION ALL
SELECT 'Mappings', count(*) FROM icd_drg_mappings;