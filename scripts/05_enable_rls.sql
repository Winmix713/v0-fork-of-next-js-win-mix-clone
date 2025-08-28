-- Enable RLS and define basic policies for the matches table in Supabase
-- WARNING: Review before applying in production. Adjust policies to your needs.

-- Ensure the table exists
DO $$ BEGIN
  PERFORM 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'matches';
  IF NOT FOUND THEN
    RAISE NOTICE 'Table public.matches not found. Skipping RLS setup.';
    RETURN;
  END IF;
END $$;

-- Enable row level security
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid duplicates (idempotent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'matches' AND policyname = 'Allow read access to anon') THEN
    EXECUTE 'DROP POLICY "Allow read access to anon" ON public.matches';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'matches' AND policyname = 'Allow read access to authenticated') THEN
    EXECUTE 'DROP POLICY "Allow read access to authenticated" ON public.matches';
  END IF;
END $$;

-- Policy: Allow SELECT for anon role (public read-only app)
CREATE POLICY "Allow read access to anon"
  ON public.matches
  FOR SELECT
  TO anon
  USING (true);

-- Optionally, allow authenticated users to read as well
CREATE POLICY "Allow read access to authenticated"
  ON public.matches
  FOR SELECT
  TO authenticated
  USING (true);

-- You may want to restrict INSERT/UPDATE/DELETE to service role only (handled outside RLS)
-- In Supabase, operations using the service role bypass RLS.
