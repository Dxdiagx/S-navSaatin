-- Migration: 0001_add_ai_fields
-- Adds ai_summary, person_count, requirements, positions columns
-- to job_announcements and appointments tables.
-- Run: psql $DATABASE_URL -f migration/migrations/0001_add_ai_fields.sql

-- job_announcements
ALTER TABLE job_announcements
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS person_count INTEGER,
  ADD COLUMN IF NOT EXISTS requirements TEXT,
  ADD COLUMN IF NOT EXISTS positions TEXT;

-- appointments
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS person_count INTEGER,
  ADD COLUMN IF NOT EXISTS requirements TEXT,
  ADD COLUMN IF NOT EXISTS positions TEXT;
