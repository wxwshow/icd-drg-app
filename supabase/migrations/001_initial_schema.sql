-- ICD-10 / DRG Lookup — Initial Schema
-- Run this in Supabase SQL Editor to set up the database.

-- Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

------------------------------------------------------------
-- ICD-10 Codes (diagnosis + procedure)
------------------------------------------------------------
CREATE TABLE icd_codes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(10)  NOT NULL UNIQUE,
    description     TEXT         NOT NULL,
    type            VARCHAR(20)  NOT NULL CHECK (type IN ('diagnosis', 'procedure')),
    chapter_code    VARCHAR(5),
    chapter_title   TEXT,
    block_range     VARCHAR(20),
    block_title     TEXT,
    category_code   VARCHAR(3)   NOT NULL,
    parent_code     VARCHAR(10),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- B-tree index on code for exact lookups (varchar_pattern_ops enables LIKE prefix)
CREATE INDEX idx_icd_codes_code_pattern
    ON icd_codes (code varchar_pattern_ops);

-- Trigram GIN index on description for fast ILIKE '%word%'
CREATE INDEX idx_icd_codes_description_trgm
    ON icd_codes USING gin (description gin_trgm_ops);

-- Partial index for type filtering
CREATE INDEX idx_icd_codes_type
    ON icd_codes (type);

CREATE INDEX idx_icd_codes_category
    ON icd_codes (category_code);

------------------------------------------------------------
-- DRG Groups
------------------------------------------------------------
CREATE TABLE drg_groups (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drg_code        VARCHAR(10)  NOT NULL UNIQUE,
    description     TEXT         NOT NULL,
    mdc_code        VARCHAR(10),
    mdc_description TEXT,
    relative_weight NUMERIC(8,4),
    gmlos           NUMERIC(6,2),
    drg_type        VARCHAR(20)  NOT NULL CHECK (drg_type IN ('medical', 'surgical', 'pre')),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_drg_groups_code_trgm
    ON drg_groups USING gin (drg_code gin_trgm_ops);

CREATE INDEX idx_drg_groups_description_trgm
    ON drg_groups USING gin (description gin_trgm_ops);

------------------------------------------------------------
-- ICD-to-DRG Mapping (junction table)
------------------------------------------------------------
CREATE TABLE icd_drg_mappings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icd_code_id     UUID NOT NULL REFERENCES icd_codes(id) ON DELETE CASCADE,
    drg_group_id    UUID NOT NULL REFERENCES drg_groups(id) ON DELETE CASCADE,
    role            VARCHAR(30) NOT NULL CHECK (
        role IN ('principal_diagnosis', 'secondary_diagnosis',
                 'procedure', 'cc', 'mcc')
    ),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Prevent duplicate mappings for same code+DRG+role
    UNIQUE (icd_code_id, drg_group_id, role)
);

CREATE INDEX idx_mappings_icd ON icd_drg_mappings (icd_code_id);
CREATE INDEX idx_mappings_drg ON icd_drg_mappings (drg_group_id);
CREATE INDEX idx_mappings_role ON icd_drg_mappings (role);
