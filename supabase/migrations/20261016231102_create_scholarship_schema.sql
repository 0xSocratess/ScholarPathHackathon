/*
# ScholarPath Core Schema

1. New Tables
- `scholarships` — the main scholarship catalogue with all fields for discovery, filtering, and detail pages.
- `profiles` — user profile data (nationality, education level, preferences) linked to auth.users.
- `saved_scholarships` — a user's saved/bookmarked scholarships with application status tracking.
2. Security
- `scholarships` is publicly readable (anon + authenticated) since scholarship listings are public content.
- `profiles` is owner-scoped: each authenticated user can only read/update their own profile.
- `saved_scholarships` is owner-scoped: each authenticated user can only CRUD their own saved scholarships.
3. Indexes
- Indexes on scholarships for country, degree_level, funding_type, status, and application_deadline for fast filtering.
- Index on saved_scholarships for user_id + scholarship_id uniqueness.
*/

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organisation text,
  university text,
  country text NOT NULL,
  degree_level text[] DEFAULT '{}',
  subject_areas text[] DEFAULT '{}',
  description text,
  funding_type text DEFAULT 'partial',
  funding_coverage text,
  eligible_nationalities text[] DEFAULT '{}',
  academic_requirements text,
  language_requirements text,
  application_open_date date,
  application_deadline date,
  application_url text,
  official_source_url text,
  required_documents text[] DEFAULT '{}',
  application_instructions text,
  programme_type text DEFAULT 'taught',
  status text DEFAULT 'open',
  keywords text[] DEFAULT '{}',
  last_verified_at date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_scholarships" ON scholarships;
CREATE POLICY "public_read_scholarships"
ON scholarships FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert_scholarships" ON scholarships;
CREATE POLICY "authenticated_insert_scholarships"
ON scholarships FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_scholarships" ON scholarships;
CREATE POLICY "authenticated_update_scholarships"
ON scholarships FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_scholarships" ON scholarships;
CREATE POLICY "authenticated_delete_scholarships"
ON scholarships FOR DELETE
TO authenticated USING (true);

-- Indexes for scholarships
CREATE INDEX IF NOT EXISTS idx_scholarships_country ON scholarships (country);
CREATE INDEX IF NOT EXISTS idx_scholarships_degree_level ON scholarships USING GIN (degree_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_funding_type ON scholarships (funding_type);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships (status);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships (application_deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_subject_areas ON scholarships USING GIN (subject_areas);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  nationality text,
  country_of_residence text,
  current_education_level text,
  highest_qualification text,
  preferred_degree text,
  preferred_subject text,
  preferred_destinations text[] DEFAULT '{}',
  funding_preference text,
  gpa text,
  graduation_year int,
  english_test_status text,
  research_interests text,
  intended_admission_year int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Saved scholarships table
CREATE TABLE IF NOT EXISTS saved_scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id uuid NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  application_status text DEFAULT 'interested',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, scholarship_id)
);

ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_saved" ON saved_scholarships;
CREATE POLICY "select_own_saved"
ON saved_scholarships FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved" ON saved_scholarships;
CREATE POLICY "insert_own_saved"
ON saved_scholarships FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_saved" ON saved_scholarships;
CREATE POLICY "update_own_saved"
ON saved_scholarships FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved" ON saved_scholarships;
CREATE POLICY "delete_own_saved"
ON saved_scholarships FOR DELETE
TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_scholarships_user ON saved_scholarships (user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS scholarships_updated_at ON scholarships;
CREATE TRIGGER scholarships_updated_at BEFORE UPDATE ON scholarships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS saved_scholarships_updated_at ON saved_scholarships;
CREATE TRIGGER saved_scholarships_updated_at BEFORE UPDATE ON saved_scholarships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
