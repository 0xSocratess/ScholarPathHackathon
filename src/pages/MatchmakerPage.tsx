import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle,
  XCircle, Info,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Scholarship, MatchInput, MatchResult } from '@/lib/types';
import { matchScholarships, matchLevelLabel, matchLevelColor } from '@/lib/matchingEngine';
import {
  fundingTypeLabel, fundingTypeColor, getDeadlineStatus,
  deadlineStatusLabel, deadlineStatusColor, formatShortDate,
} from '@/lib/scholarshipUtils';
import { LoadingState, EmptyState } from '@/components/StateDisplay';
import { COUNTRY_LIST } from '@/lib/scholarshipUtils';

const STEPS = [
  { key: 'basics', label: 'About You' },
  { key: 'education', label: 'Education' },
  { key: 'preferences', label: 'Preferences' },
  { key: 'optional', label: 'Additional Info' },
] as const;

const EMPTY_INPUT: MatchInput = {
  nationality: '',
  countryOfResidence: '',
  currentEducationLevel: '',
  highestQualification: '',
  desiredDegree: '',
  preferredSubject: '',
  preferredDestinations: [],
  fundingPreference: '',
  gpa: '',
  graduationYear: '',
  englishTestStatus: '',
  researchInterests: '',
  intendedAdmissionYear: '',
};

export default function MatchmakerPage() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<MatchInput>(EMPTY_INPUT);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    supabase
      .rpc('get_active_scholarships')
      .then(({ data }) => {
        setScholarships(data || []);
        setLoading(false);
      });
  }, []);

  const update = (key: keyof MatchInput, value: string | string[]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDestination = (country: string) => {
    setInput((prev) => ({
      ...prev,
      preferredDestinations: prev.preferredDestinations.includes(country)
        ? prev.preferredDestinations.filter((c) => c !== country)
        : [...prev.preferredDestinations, country],
    }));
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const matches = matchScholarships(input, scholarships);
      setResults(matches);
      setAnalyzing(false);
    }, 800);
  };

  const canProceed = () => {
    if (step === 0) return input.nationality && input.countryOfResidence;
    if (step === 1) return input.currentEducationLevel && input.highestQualification && input.desiredDegree;
    if (step === 2) return input.preferredSubject && input.fundingPreference;
    return true;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingState />
      </div>
    );
  }

  // Results view
  if (results) {
    const matching = results.filter((r) => r.matchLevel === 'appears_to_match');
    const needsVerification = results.filter((r) => r.matchLevel === 'needs_verification');
    const notEligible = results.filter((r) => r.matchLevel === 'likely_not_eligible');

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#14243A] mb-2">Your Scholarship Matches</h1>
          <p className="text-sm text-gray-600">
            Based on your profile, here are the opportunities ranked by compatibility. This is a rules-based matching engine, not AI-powered analysis. Scores reflect how well known criteria align — not your probability of winning.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{matching.length}</p>
            <p className="text-xs text-gray-500 mt-1">Appears to Match</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{needsVerification.length}</p>
            <p className="text-xs text-gray-500 mt-1">Needs Verification</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{notEligible.length}</p>
            <p className="text-xs text-gray-500 mt-1">Likely Not Eligible</p>
          </div>
        </div>

        {results.length === 0 ? (
          <EmptyState
            title="No scholarships to analyze"
            message="There are currently no scholarships in the database. Please check back later."
          />
        ) : (
          <div className="space-y-4">
            {results.slice(0, 15).map((result) => (
              <MatchResultCard key={result.scholarship.id} result={result} />
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => { setResults(null); setStep(0); setInput(EMPTY_INPUT); }}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Start Over
          </button>
          <Link
            to="/explore"
            className="px-4 py-2 text-sm font-medium text-[#13795B] border border-[#13795B] rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Browse All Scholarships
          </Link>
        </div>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <Sparkles className="w-10 h-10 text-[#13795B] animate-pulse mb-4" />
          <h3 className="text-lg font-semibold text-[#14243A] mb-2">Analyzing your profile...</h3>
          <p className="text-sm text-gray-500">Matching against {scholarships.length} scholarships in our database.</p>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Scholarship Matchmaker
        </div>
        <h1 className="text-2xl font-bold text-[#14243A] mb-2">Find Your Scholarship Match</h1>
        <p className="text-sm text-gray-600">
          Answer a few questions and we'll match you with opportunities that fit your profile and ambitions.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              i <= step ? 'bg-[#13795B] text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 transition-colors ${i < step ? 'bg-[#13795B]' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Step 0: Basics */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#14243A] mb-4">Tell us about yourself</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationality <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={input.nationality}
                onChange={(e) => update('nationality', e.target.value)}
                placeholder="e.g. Nigerian, Indian, Brazilian..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country of Residence <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={input.countryOfResidence}
                onChange={(e) => update('countryOfResidence', e.target.value)}
                placeholder="e.g. Nigeria, India, Brazil..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Step 1: Education */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#14243A] mb-4">Your education background</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Education Level <span className="text-red-500">*</span></label>
              <select
                value={input.currentEducationLevel}
                onChange={(e) => update('currentEducationLevel', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent bg-white"
              >
                <option value="">Select...</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate Student</option>
                <option value="Bachelor's Degree">Bachelor's Degree Holder</option>
                <option value="Master's Degree">Master's Degree Holder</option>
                <option value="PhD">PhD Holder</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Highest Qualification <span className="text-red-500">*</span></label>
              <select
                value={input.highestQualification}
                onChange={(e) => update('highestQualification', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent bg-white"
              >
                <option value="">Select...</option>
                <option value="High School Diploma">High School Diploma</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Degree You Want to Pursue <span className="text-red-500">*</span></label>
              <select
                value={input.desiredDegree}
                onChange={(e) => update('desiredDegree', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent bg-white"
              >
                <option value="">Select...</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
                <option value="Postdoc">Postdoc</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#14243A] mb-4">Your preferences</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Subject or Research Area <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={input.preferredSubject}
                onChange={(e) => update('preferredSubject', e.target.value)}
                placeholder="e.g. Computer Science, Public Health, Philosophy..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Destination Countries</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {COUNTRY_LIST.map((country) => (
                  <label key={country} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={input.preferredDestinations.includes(country)}
                      onChange={() => toggleDestination(country)}
                      className="w-4 h-4 rounded border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-gray-700 truncate">{country}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Funding Preference <span className="text-red-500">*</span></label>
              <select
                value={input.fundingPreference}
                onChange={(e) => update('fundingPreference', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent bg-white"
              >
                <option value="">Select...</option>
                <option value="fully_funded">Fully Funded Only</option>
                <option value="any">Any Funding (Full or Partial)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Intended Admission Year</label>
              <select
                value={input.intendedAdmissionYear}
                onChange={(e) => update('intendedAdmissionYear', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent bg-white"
              >
                <option value="">Select...</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Optional */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#14243A] mb-1">Additional Information</h2>
            <p className="text-sm text-gray-500 mb-4">All fields in this step are optional. You can skip any you don't want to share.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Approximate GPA / Grade</label>
                <input
                  type="text"
                  value={input.gpa}
                  onChange={(e) => update('gpa', e.target.value)}
                  placeholder="e.g. 3.8/4.0, First Class..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Graduation Year</label>
                <input
                  type="text"
                  value={input.graduationYear}
                  onChange={(e) => update('graduationYear', e.target.value)}
                  placeholder="e.g. 2024"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">English Language Test Status</label>
              <select
                value={input.englishTestStatus}
                onChange={(e) => update('englishTestStatus', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent bg-white"
              >
                <option value="">Select...</option>
                <option value="none">Not taken yet</option>
                <option value="ielts_taken">IELTS taken</option>
                <option value="toefl_taken">TOEFL taken</option>
                <option value="other">Other English test</option>
                <option value="english_instruction">Previous degree in English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Research Interests</label>
              <textarea
                value={input.researchInterests}
                onChange={(e) => update('researchInterests', e.target.value)}
                placeholder="Describe your research interests or specific topics you'd like to study..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-30 hover:text-[#14243A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-1 px-5 py-2 text-sm font-medium text-white bg-[#13795B] rounded-lg hover:bg-[#0f6349] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleAnalyze}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#13795B] rounded-lg hover:bg-[#0f6349] transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Find My Matches
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4 max-w-md mx-auto">
        This matching tool uses a rules-based engine that compares your answers against scholarship data in our database. It is not AI-powered and does not guarantee eligibility or admission.
      </p>
    </div>
  );
}

function MatchResultCard({ result }: { result: MatchResult }) {
  const { scholarship, score, matchLevel, reasons, concerns, nextSteps } = result;
  const dlStatus = getDeadlineStatus(scholarship);

  const Icon = matchLevel === 'appears_to_match' ? CheckCircle2
    : matchLevel === 'needs_verification' ? AlertCircle
    : XCircle;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <Link to={`/scholarship/${scholarship.id}`} className="text-base font-semibold text-[#14243A] hover:text-[#13795B] transition-colors">
            {scholarship.title}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">{scholarship.organisation || scholarship.university} — {scholarship.country}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${matchLevelColor(matchLevel)}`}>
            <Icon className="w-3.5 h-3.5" />
            {score}%
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${matchLevelColor(matchLevel)}`}>
          {matchLevelLabel(matchLevel)}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${fundingTypeColor(scholarship.funding_type)}`}>
          {fundingTypeLabel(scholarship.funding_type)}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${deadlineStatusColor(dlStatus)}`}>
          {deadlineStatusLabel(dlStatus)}
        </span>
        {scholarship.application_deadline && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
            Deadline: {formatShortDate(scholarship.application_deadline)}
          </span>
        )}
      </div>

      {reasons.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-emerald-700 mb-1">Why it may suit you:</p>
          <ul className="space-y-1">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {concerns.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-amber-700 mb-1">What to check:</p>
          <ul className="space-y-1">
            {concerns.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {nextSteps.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-[#13795B] mb-1">Next steps:</p>
          <ul className="space-y-1">
            {nextSteps.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <Info className="w-3.5 h-3.5 text-[#13795B] flex-shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
        <Link
          to={`/scholarship/${scholarship.id}`}
          className="text-sm font-medium text-[#13795B] hover:underline"
        >
          View Details →
        </Link>
        {scholarship.application_url && (
          <a
            href={scholarship.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-[#14243A]"
          >
            Official Website ↗
          </a>
        )}
      </div>
    </div>
  );
}
