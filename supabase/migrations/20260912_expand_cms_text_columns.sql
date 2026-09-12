-- CMS content must not be limited to 255 characters. This keeps existing data,
-- constraints, indexes, and RLS policies while converting only varchar columns
-- in the three long-form content tables to PostgreSQL TEXT.
DO $$
DECLARE
  column_record record;
BEGIN
  FOR column_record IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN ('tours', 'destinations', 'services')
      AND data_type = 'character varying'
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN %I TYPE text',
      column_record.table_name,
      column_record.column_name
    );
  END LOOP;
END $$;
