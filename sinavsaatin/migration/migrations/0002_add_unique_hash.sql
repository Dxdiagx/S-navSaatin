-- Migration: 0002_add_unique_hash
  -- Adds unique_hash column to sinav_takvimi for duplicate exam detection.
  -- Run: psql $DATABASE_URL -f migration/migrations/0002_add_unique_hash.sql

  ALTER TABLE sinav_takvimi
    ADD COLUMN IF NOT EXISTS unique_hash VARCHAR(64);

  -- Unique index (partial — allows NULLs for existing rows)
  CREATE UNIQUE INDEX IF NOT EXISTS uk_sinav_unique_hash
    ON sinav_takvimi(unique_hash)
    WHERE unique_hash IS NOT NULL;
  