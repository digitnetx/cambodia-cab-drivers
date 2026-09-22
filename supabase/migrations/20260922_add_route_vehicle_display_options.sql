-- Let administrators choose which vehicle prices appear for each route.
-- Existing routes keep showing all three options by default.

ALTER TABLE public.routes
  ADD COLUMN IF NOT EXISTS show_sedan BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_suv BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_van BOOLEAN NOT NULL DEFAULT TRUE;
