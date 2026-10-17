export interface Scholarship {
  id: string;
  title: string;
  organisation: string | null;
  university: string | null;
  country: string;
  degree_level: string[];
  subject_areas: string[];
  description: string | null;
  funding_type: string;
  funding_coverage: string | null;
  eligible_nationalities: string[];
  academic_requirements: string | null;
  language_requirements: string | null;
  application_open_date: string | null;
  application_deadline: string | null;
  application_url: string | null;
  currently_open_verified: boolean;
  next_application_open_date: string | null;
  next_application_deadline: string | null;
  next_round_verified: boolean;
  deadline_timezone: string | null;
  official_source_url: string | null;
  required_documents: string[];
  application_instructions: string | null;
  programme_type: string;
  status: string;
  keywords: string[];
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  nationality: string | null;
  country_of_residence: string | null;
  current_education_level: string | null;
  highest_qualification: string | null;
  preferred_degree: string | null;
  preferred_subject: string | null;
  preferred_destinations: string[];
  funding_preference: string | null;
  gpa: string | null;
  graduation_year: number | null;
  english_test_status: string | null;
  research_interests: string | null;
  intended_admission_year: number | null;
  created_at: string;
  updated_at: string;
}

export interface SavedScholarship {
  id: string;
  user_id: string;
  scholarship_id: string;
  application_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  scholarship?: Scholarship;
}

export interface MatchInput {
  nationality: string;
  countryOfResidence: string;
  currentEducationLevel: string;
  highestQualification: string;
  desiredDegree: string;
  preferredSubject: string;
  preferredDestinations: string[];
  fundingPreference: string;
  gpa: string;
  graduationYear: string;
  englishTestStatus: string;
  researchInterests: string;
  intendedAdmissionYear: string;
}

export interface MatchResult {
  scholarship: Scholarship;
  score: number;
  matchLevel: 'appears_to_match' | 'needs_verification' | 'likely_not_eligible';
  reasons: string[];
  concerns: string[];
  nextSteps: string[];
}
