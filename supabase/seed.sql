-- ICD-10 / DRG Lookup — Seed Data
-- Run this after the migration to populate sample data.

-- ============================================================
-- ICD-10 CM Diagnosis Codes
-- ============================================================

-- Chapter IX: Diseases of the circulatory system (I00-I99)
INSERT INTO icd_codes (code, description, type, chapter_code, chapter_title, block_range, block_title, category_code) VALUES
('I10',   'Essential (primary) hypertension',                           'diagnosis', 'IX',  'Diseases of the circulatory system', 'I10-I15', 'Hypertensive diseases', 'I10'),
('I11.0', 'Hypertensive heart disease with heart failure',              'diagnosis', 'IX',  'Diseases of the circulatory system', 'I10-I15', 'Hypertensive diseases', 'I11'),
('I21.0', 'ST elevation (STEMI) myocardial infarction of anterior wall','diagnosis', 'IX',  'Diseases of the circulatory system', 'I20-I25', 'Ischemic heart diseases', 'I21'),
('I21.1', 'ST elevation (STEMI) myocardial infarction of inferior wall','diagnosis', 'IX',  'Diseases of the circulatory system', 'I20-I25', 'Ischemic heart diseases', 'I21'),
('I25.10','Atherosclerotic heart disease of native coronary artery without angina pectoris', 'diagnosis', 'IX', 'Diseases of the circulatory system', 'I20-I25', 'Ischemic heart diseases', 'I25'),
('I50.9', 'Heart failure, unspecified',                                'diagnosis', 'IX',  'Diseases of the circulatory system', 'I50-I51', 'Other forms of heart disease', 'I50'),
('I50.20','Systolic (congestive) heart failure, unspecified',          'diagnosis', 'IX',  'Diseases of the circulatory system', 'I50-I51', 'Other forms of heart disease', 'I50'),
('I50.30','Diastolic (congestive) heart failure, unspecified',         'diagnosis', 'IX',  'Diseases of the circulatory system', 'I50-I51', 'Other forms of heart disease', 'I50'),
('I48.91','Unspecified atrial fibrillation',                           'diagnosis', 'IX',  'Diseases of the circulatory system', 'I47-I49', 'Other cardiac arrhythmias', 'I48'),
('I63.9', 'Cerebral infarction, unspecified',                          'diagnosis', 'IX',  'Diseases of the circulatory system', 'I60-I69', 'Cerebrovascular diseases', 'I63');

-- Chapter X: Diseases of the respiratory system (J00-J99)
INSERT INTO icd_codes (code, description, type, chapter_code, chapter_title, block_range, block_title, category_code) VALUES
('J15.9', 'Unspecified bacterial pneumonia',                           'diagnosis', 'X',   'Diseases of the respiratory system', 'J09-J18', 'Influenza and pneumonia', 'J15'),
('J18.9', 'Pneumonia, unspecified organism',                           'diagnosis', 'X',   'Diseases of the respiratory system', 'J09-J18', 'Influenza and pneumonia', 'J18'),
('J44.9', 'Chronic obstructive pulmonary disease, unspecified',       'diagnosis', 'X',   'Diseases of the respiratory system', 'J40-J47', 'Chronic lower respiratory diseases', 'J44'),
('J45.90','Unspecified asthma, uncomplicated',                        'diagnosis', 'X',   'Diseases of the respiratory system', 'J40-J47', 'Chronic lower respiratory diseases', 'J45'),
('J96.00','Acute respiratory failure, unspecified whether with hypoxia or hypercapnia', 'diagnosis', 'X', 'Diseases of the respiratory system', 'J96-J99', 'Other diseases of the respiratory system', 'J96');

-- Chapter IV: Endocrine, nutritional and metabolic diseases (E00-E89)
INSERT INTO icd_codes (code, description, type, chapter_code, chapter_title, block_range, block_title, category_code) VALUES
('E11.9', 'Type 2 diabetes mellitus without complications',            'diagnosis', 'IV',  'Endocrine, nutritional and metabolic diseases', 'E08-E13', 'Diabetes mellitus', 'E11'),
('E11.22','Type 2 diabetes mellitus with diabetic chronic kidney disease', 'diagnosis', 'IV', 'Endocrine, nutritional and metabolic diseases', 'E08-E13', 'Diabetes mellitus', 'E11'),
('E87.1', 'Hypo-osmolality and hyponatremia',                          'diagnosis', 'IV',  'Endocrine, nutritional and metabolic diseases', 'E70-E88', 'Metabolic disorders', 'E87');

-- Chapter XIV: Diseases of the genitourinary system (N00-N99)
INSERT INTO icd_codes (code, description, type, chapter_code, chapter_title, block_range, block_title, category_code) VALUES
('N17.9', 'Acute kidney failure, unspecified',                         'diagnosis', 'XIV', 'Diseases of the genitourinary system', 'N17-N19', 'Renal failure', 'N17'),
('N18.3', 'Chronic kidney disease, stage 3 (moderate)',                'diagnosis', 'XIV', 'Diseases of the genitourinary system', 'N17-N19', 'Renal failure', 'N18'),
('N18.4', 'Chronic kidney disease, stage 4 (severe)',                  'diagnosis', 'XIV', 'Diseases of the genitourinary system', 'N17-N19', 'Renal failure', 'N18'),
('N18.6', 'End stage renal disease',                                   'diagnosis', 'XIV', 'Diseases of the genitourinary system', 'N17-N19', 'Renal failure', 'N18'),
('N39.0', 'Urinary tract infection, site not specified',               'diagnosis', 'XIV', 'Diseases of the genitourinary system', 'N30-N39', 'Other diseases of the urinary system', 'N39');

-- Chapter XIII: Diseases of the musculoskeletal system (M00-M99)
INSERT INTO icd_codes (code, description, type, chapter_code, chapter_title, block_range, block_title, category_code) VALUES
('M17.11','Unilateral primary osteoarthritis, right knee',             'diagnosis', 'XIII','Diseases of the musculoskeletal system and connective tissue', 'M15-M19', 'Osteoarthritis', 'M17'),
('M48.06','Spinal stenosis, lumbar region',                            'diagnosis', 'XIII','Diseases of the musculoskeletal system and connective tissue', 'M45-M49', 'Spondylopathies', 'M48');

-- Chapter I: Certain infectious and parasitic diseases (A00-B99)
INSERT INTO icd_codes (code, description, type, chapter_code, chapter_title, block_range, block_title, category_code) VALUES
('A41.9', 'Sepsis, unspecified organism',                              'diagnosis', 'I',   'Certain infectious and parasitic diseases', 'A30-A49', 'Other bacterial diseases', 'A41');

-- ============================================================
-- ICD-10 PCS Procedure Codes
-- ============================================================
INSERT INTO icd_codes (code, description, type, chapter_code, chapter_title, category_code) VALUES
('027034Z','Dilation of coronary artery, one artery with drug-eluting intraluminal device, percutaneous approach', 'procedure', NULL, NULL, '027'),
('0SG00ZZ','Fusion of lumbar vertebral joint, open approach',          'procedure', NULL, NULL, '0SG'),
('02RF38Z','Replacement of aortic valve with zooplastic tissue, percutaneous approach', 'procedure', NULL, NULL, '02R'),
('0SRC0J9','Replacement of right knee joint with synthetic substitute, cemented, open approach', 'procedure', NULL, NULL, '0SR'),
('0SRD0J9','Replacement of left knee joint with synthetic substitute, cemented, open approach', 'procedure', NULL, NULL, '0SR');

-- ============================================================
-- DRG Groups (CN-DRG style, representative sample)
-- ============================================================

-- MDC 05: Diseases and disorders of the circulatory system
INSERT INTO drg_groups (drg_code, description, mdc_code, mdc_description, relative_weight, gmlos, drg_type) VALUES
('F60A', 'Heart failure and shock with MCC',                       'MDC 05', 'Diseases and disorders of the circulatory system', 1.2350, 6.8, 'medical'),
('F60B', 'Heart failure and shock with CC',                        'MDC 05', 'Diseases and disorders of the circulatory system', 0.9840, 5.2, 'medical'),
('F60C', 'Heart failure and shock without CC/MCC',                 'MDC 05', 'Diseases and disorders of the circulatory system', 0.7120, 4.1, 'medical'),
('F15A', 'Percutaneous cardiovascular procedures with drug-eluting stent with MCC', 'MDC 05', 'Diseases and disorders of the circulatory system', 3.8210, 8.5, 'surgical'),
('F15B', 'Percutaneous cardiovascular procedures with drug-eluting stent without MCC', 'MDC 05', 'Diseases and disorders of the circulatory system', 2.5640, 5.3, 'surgical'),
('F67A', 'Hypertension with MCC',                                  'MDC 05', 'Diseases and disorders of the circulatory system', 0.8910, 4.5, 'medical'),
('F67B', 'Hypertension without MCC',                               'MDC 05', 'Diseases and disorders of the circulatory system', 0.6230, 3.2, 'medical');

-- MDC 04: Diseases and disorders of the respiratory system
INSERT INTO drg_groups (drg_code, description, mdc_code, mdc_description, relative_weight, gmlos, drg_type) VALUES
('E71A', 'Chronic obstructive pulmonary disease with MCC',          'MDC 04', 'Diseases and disorders of the respiratory system', 1.1890, 6.2, 'medical'),
('E71B', 'Chronic obstructive pulmonary disease with CC',           'MDC 04', 'Diseases and disorders of the respiratory system', 0.9210, 4.8, 'medical'),
('E71C', 'Chronic obstructive pulmonary disease without CC/MCC',    'MDC 04', 'Diseases and disorders of the respiratory system', 0.6840, 3.9, 'medical'),
('E68B', 'Simple pneumonia and pleurisy with CC',                   'MDC 04', 'Diseases and disorders of the respiratory system', 0.8230, 4.5, 'medical'),
('E68C', 'Simple pneumonia and pleurisy without CC/MCC',            'MDC 04', 'Diseases and disorders of the respiratory system', 0.6120, 3.4, 'medical');

-- MDC 10: Endocrine, nutritional and metabolic diseases
INSERT INTO drg_groups (drg_code, description, mdc_code, mdc_description, relative_weight, gmlos, drg_type) VALUES
('K60A', 'Diabetes with MCC',                                       'MDC 10', 'Endocrine, nutritional and metabolic diseases and disorders', 1.3560, 6.8, 'medical'),
('K60B', 'Diabetes with CC',                                        'MDC 10', 'Endocrine, nutritional and metabolic diseases and disorders', 0.9870, 4.9, 'medical'),
('K60C', 'Diabetes without CC/MCC',                                 'MDC 10', 'Endocrine, nutritional and metabolic diseases and disorders', 0.6540, 3.5, 'medical');

-- MDC 11: Diseases and disorders of the kidney and urinary tract
INSERT INTO drg_groups (drg_code, description, mdc_code, mdc_description, relative_weight, gmlos, drg_type) VALUES
('L02A', 'Kidney and urinary tract procedures with MCC',             'MDC 11', 'Diseases and disorders of the kidney and urinary tract', 2.8450, 7.2, 'surgical'),
('L60A', 'Renal failure with MCC',                                  'MDC 11', 'Diseases and disorders of the kidney and urinary tract', 1.4890, 7.1, 'medical'),
('L60B', 'Renal failure with CC',                                   'MDC 11', 'Diseases and disorders of the kidney and urinary tract', 1.1200, 5.4, 'medical'),
('L60C', 'Renal failure without CC/MCC',                            'MDC 11', 'Diseases and disorders of the kidney and urinary tract', 0.8120, 4.0, 'medical');

-- MDC 08: Diseases and disorders of the musculoskeletal system
INSERT INTO drg_groups (drg_code, description, mdc_code, mdc_description, relative_weight, gmlos, drg_type) VALUES
('I02A', 'Major joint replacement or reattachment of lower extremity with MCC', 'MDC 08', 'Diseases and disorders of the musculoskeletal system and connective tissue', 2.9870, 8.5, 'surgical'),
('I02B', 'Major joint replacement or reattachment of lower extremity without MCC', 'MDC 08', 'Diseases and disorders of the musculoskeletal system and connective tissue', 2.1560, 5.8, 'surgical');

-- ============================================================
-- ICD-to-DRG Mappings
-- ============================================================
-- Uses a DO block to resolve UUIDs from codes for cleaner inserts.

DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Helper: get icd_code id
    -- We insert each mapping by looking up UUIDs dynamically.

    -- ========================================
    -- Heart Failure DRG mappings (F60A/B/C)
    -- ========================================

    -- I50.9 → F60A (principal_diagnosis)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I50.9' AND dg.drg_code = 'F60A';

    -- I50.20 → F60A (principal_diagnosis)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I50.20' AND dg.drg_code = 'F60A';

    -- I50.30 → F60A (principal_diagnosis)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I50.30' AND dg.drg_code = 'F60A';

    -- I50.9 → F60B (principal_diagnosis — lower severity)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I50.9' AND dg.drg_code = 'F60B';

    -- I50.9 → F60C (principal_diagnosis — lowest severity)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I50.9' AND dg.drg_code = 'F60C';

    -- N18.6 (ESRD) → F60A (MCC — bumps HF to highest tier)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N18.6' AND dg.drg_code = 'F60A';

    -- J96.00 (Acute respiratory failure) → F60A (MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'J96.00' AND dg.drg_code = 'F60A';

    -- A41.9 (Sepsis) → F60A (MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'A41.9' AND dg.drg_code = 'F60A';

    -- N18.4 (CKD stage 4) → F60B (CC — bumps HF to middle tier)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'cc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N18.4' AND dg.drg_code = 'F60B';

    -- E11.9 (T2DM) → F60B (CC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'cc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'E11.9' AND dg.drg_code = 'F60B';

    -- I48.91 (Atrial fib) → F60B (CC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'cc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I48.91' AND dg.drg_code = 'F60B';

    -- ========================================
    -- PCI / Stent DRG mappings (F15A/B)
    -- ========================================

    -- 027034Z (PCI with DES) → F15B (procedure)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'procedure'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = '027034Z' AND dg.drg_code = 'F15B';

    -- 027034Z (PCI with DES) → F15A (procedure — with MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'procedure'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = '027034Z' AND dg.drg_code = 'F15A';

    -- I21.0 (Anterior STEMI) → F15B (principal_diagnosis)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I21.0' AND dg.drg_code = 'F15B';

    -- I21.0 → F15A (principal_diagnosis with MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I21.0' AND dg.drg_code = 'F15A';

    -- I21.1 (Inferior STEMI) → F15B
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I21.1' AND dg.drg_code = 'F15B';

    -- I25.10 (ASHD) → F15B (principal_diagnosis)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I25.10' AND dg.drg_code = 'F15B';

    -- N18.6 (ESRD) → F15A (MCC for PCI)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N18.6' AND dg.drg_code = 'F15A';

    -- J96.00 → F15A (MCC for PCI)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'J96.00' AND dg.drg_code = 'F15A';

    -- A41.9 (Sepsis) → F15A (MCC for PCI)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'A41.9' AND dg.drg_code = 'F15A';

    -- ========================================
    -- COPD DRG mappings (E71A/B/C)
    -- ========================================

    -- J44.9 (COPD) → E71B (principal_diagnosis)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'J44.9' AND dg.drg_code = 'E71B';

    -- J44.9 → E71C (without CC/MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'J44.9' AND dg.drg_code = 'E71C';

    -- J44.9 → E71A (with MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'J44.9' AND dg.drg_code = 'E71A';

    -- N18.6 → E71A (MCC for COPD)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N18.6' AND dg.drg_code = 'E71A';

    -- J96.00 → E71A (MCC for COPD)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'J96.00' AND dg.drg_code = 'E71A';

    -- A41.9 → E71A (MCC for COPD)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'A41.9' AND dg.drg_code = 'E71A';

    -- E11.9 → E71B (CC for COPD)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'cc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'E11.9' AND dg.drg_code = 'E71B';

    -- I48.91 → E71B (CC for COPD)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'cc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I48.91' AND dg.drg_code = 'E71B';

    -- ========================================
    -- Pneumonia DRG mappings (E68B/C)
    -- ========================================

    -- J15.9 → E68B (principal_diagnosis with CC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'J15.9' AND dg.drg_code = 'E68B';

    -- J18.9 → E68C (principal_diagnosis without CC/MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'J18.9' AND dg.drg_code = 'E68C';

    -- E11.9 → E68B (CC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'cc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'E11.9' AND dg.drg_code = 'E68B';

    -- ========================================
    -- Diabetes DRG mappings (K60A/B/C)
    -- ========================================

    -- E11.9 (T2DM) → K60C (principal_diagnosis, no CC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'E11.9' AND dg.drg_code = 'K60C';

    -- E11.22 (T2DM with CKD) → K60B (principal_diagnosis with CC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'E11.22' AND dg.drg_code = 'K60B';

    -- E11.22 → K60A (principal_diagnosis with MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'E11.22' AND dg.drg_code = 'K60A';

    -- N18.6 → K60A (MCC for diabetes)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N18.6' AND dg.drg_code = 'K60A';

    -- ========================================
    -- Renal failure DRG mappings (L60A/B/C)
    -- ========================================

    -- N18.6 (ESRD) → L60A (principal_diagnosis with MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N18.6' AND dg.drg_code = 'L60A';

    -- N18.4 (CKD stage 4) → L60B (principal_diagnosis with CC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N18.4' AND dg.drg_code = 'L60B';

    -- N18.3 (CKD stage 3) → L60C (principal_diagnosis, no CC/MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N18.3' AND dg.drg_code = 'L60C';

    -- N17.9 (ARF) → L60B (principal_diagnosis with CC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N17.9' AND dg.drg_code = 'L60B';

    -- A41.9 (Sepsis) → L60A (MCC for renal failure)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'A41.9' AND dg.drg_code = 'L60A';

    -- J96.00 → L60A (MCC for renal failure)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'J96.00' AND dg.drg_code = 'L60A';

    -- E11.9 → L60B (CC for renal failure)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'cc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'E11.9' AND dg.drg_code = 'L60B';

    -- ========================================
    -- Hypertension DRG mappings (F67A/B)
    -- ========================================

    -- I10 → F67B (principal_diagnosis, no CC/MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I10' AND dg.drg_code = 'F67B';

    -- I11.0 → F67A (principal_diagnosis with MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'I11.0' AND dg.drg_code = 'F67A';

    -- N18.6 → F67A (MCC for hypertension)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N18.6' AND dg.drg_code = 'F67A';

    -- ========================================
    -- Joint replacement DRG mappings (I02A/B)
    -- ========================================

    -- 0SRC0J9 (Right knee replacement) → I02B (procedure)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'procedure'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = '0SRC0J9' AND dg.drg_code = 'I02B';

    -- 0SRD0J9 (Left knee replacement) → I02B (procedure)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'procedure'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = '0SRD0J9' AND dg.drg_code = 'I02B';

    -- M17.11 (OA right knee) → I02B (principal_diagnosis)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'M17.11' AND dg.drg_code = 'I02B';

    -- M17.11 → I02A (principal_diagnosis with MCC)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'M17.11' AND dg.drg_code = 'I02A';

    -- A41.9 (Sepsis) → I02A (MCC for joint replacement)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'A41.9' AND dg.drg_code = 'I02A';

    -- N18.6 → I02A (MCC for joint replacement)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'mcc'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'N18.6' AND dg.drg_code = 'I02A';

    -- ========================================
    -- Other procedure mappings
    -- ========================================

    -- 02RF38Z (TAVR) → F15B (procedure — similar CV group)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'procedure'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = '02RF38Z' AND dg.drg_code = 'F15B';

    -- 0SG00ZZ (Spinal fusion) → I02B (procedure — musculoskeletal group)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'procedure'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = '0SG00ZZ' AND dg.drg_code = 'I02B';

    -- M48.06 (Spinal stenosis) → I02B (principal_diagnosis)
    INSERT INTO icd_drg_mappings (icd_code_id, drg_group_id, role)
    SELECT ic.id, dg.id, 'principal_diagnosis'
    FROM icd_codes ic, drg_groups dg
    WHERE ic.code = 'M48.06' AND dg.drg_code = 'I02B';

END $$;
