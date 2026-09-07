-- Migration: 0003_add_unique_hash_all_modules
  -- Adds unique_hash column to job_announcements, appointments, ai_news
  -- for duplicate prevention across all AI scraper modules.
  -- Run: psql $DATABASE_URL -f migration/migrations/0003_add_unique_hash_all_modules.sql

  -- job_announcements
  ALTER TABLE job_announcements
    ADD COLUMN IF NOT EXISTS unique_hash VARCHAR(64);

  CREATE UNIQUE INDEX IF NOT EXISTS uk_job_unique_hash
    ON job_announcements(unique_hash)
    WHERE unique_hash IS NOT NULL;

  -- appointments
  ALTER TABLE appointments
    ADD COLUMN IF NOT EXISTS unique_hash VARCHAR(64);

  CREATE UNIQUE INDEX IF NOT EXISTS uk_appointment_unique_hash
    ON appointments(unique_hash)
    WHERE unique_hash IS NOT NULL;

  -- ai_news
  ALTER TABLE ai_news
    ADD COLUMN IF NOT EXISTS unique_hash VARCHAR(64);

  CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_news_unique_hash
    ON ai_news(unique_hash)
    WHERE unique_hash IS NOT NULL;
  