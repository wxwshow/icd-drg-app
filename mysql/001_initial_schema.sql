-- ICD-10 / DRG Lookup — MySQL 5.x/8.x 通用版
-- 导入顺序：先跑这个建表，再灌入 seed 数据

DROP TABLE IF EXISTS icd_drg_mappings;
DROP TABLE IF EXISTS drg_groups;
DROP TABLE IF EXISTS icd_codes;

-- ============================================================
-- ICD-10 Codes（诊断 + 手术操作）
-- ============================================================
CREATE TABLE icd_codes (
    id              CHAR(36) PRIMARY KEY,
    code            VARCHAR(20)  NOT NULL UNIQUE,
    description     TEXT         NOT NULL,
    type            VARCHAR(20)  NOT NULL,
    chapter_code    VARCHAR(5),
    chapter_title   TEXT,
    block_range     VARCHAR(20),
    block_title     TEXT,
    category_code   VARCHAR(3)   NOT NULL,
    parent_code     VARCHAR(10),
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 自动生成 UUID
DELIMITER //
CREATE TRIGGER trg_icd_codes_uuid BEFORE INSERT ON icd_codes
FOR EACH ROW BEGIN
  IF NEW.id IS NULL THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;

CREATE INDEX idx_icd_codes_code ON icd_codes (code);
CREATE INDEX idx_icd_codes_type ON icd_codes (type);
CREATE INDEX idx_icd_codes_category ON icd_codes (category_code);

-- ============================================================
-- DRG 分组
-- ============================================================
CREATE TABLE drg_groups (
    id              CHAR(36) PRIMARY KEY,
    drg_code        VARCHAR(10)  NOT NULL UNIQUE,
    description     TEXT         NOT NULL,
    mdc_code        VARCHAR(10),
    mdc_description TEXT,
    relative_weight DECIMAL(8,4),
    gmlos           DECIMAL(6,2),
    drg_type        VARCHAR(20)  NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER //
CREATE TRIGGER trg_drg_groups_uuid BEFORE INSERT ON drg_groups
FOR EACH ROW BEGIN
  IF NEW.id IS NULL THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;

CREATE INDEX idx_drg_groups_code ON drg_groups (drg_code);

-- ============================================================
-- ICD ↔ DRG 映射表
-- ============================================================
CREATE TABLE icd_drg_mappings (
    id              CHAR(36) PRIMARY KEY,
    icd_code_id     CHAR(36) NOT NULL,
    drg_group_id    CHAR(36) NOT NULL,
    role            VARCHAR(30) NOT NULL,
    created_at      TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mapping_icd FOREIGN KEY (icd_code_id)
        REFERENCES icd_codes(id) ON DELETE CASCADE,
    CONSTRAINT fk_mapping_drg FOREIGN KEY (drg_group_id)
        REFERENCES drg_groups(id) ON DELETE CASCADE,
    CONSTRAINT uk_mapping UNIQUE (icd_code_id, drg_group_id, role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER //
CREATE TRIGGER trg_mappings_uuid BEFORE INSERT ON icd_drg_mappings
FOR EACH ROW BEGIN
  IF NEW.id IS NULL THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;

CREATE INDEX idx_mappings_icd ON icd_drg_mappings (icd_code_id);
CREATE INDEX idx_mappings_drg ON icd_drg_mappings (drg_group_id);
CREATE INDEX idx_mappings_role ON icd_drg_mappings (role);