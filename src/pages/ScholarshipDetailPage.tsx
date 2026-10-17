import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, MapPin, Calendar, Building2, GraduationCap,
  Globe2, FileText, CheckCircle2, AlertCircle, Clock, BookOpen,
  BookmarkPlus, Bookmark, ChevronRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Scholarship } from '@/lib/types';
import {
  getDeadlineStatus, deadlineStatusLabel, deadlineStatusColor,
  fundingTypeLabel, fundingTypeColor, formatDate, daysUntilDeadline,
} from '@/lib/scholarshipUtils';
import { useAuth } from '@/lib/authContext';
import ScholarshipCard from '@/components/ScholarshipCard';
import { LoadingState, ErrorState } from '@/components/StateDisplay';

export default function ScholarshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [related, setRelated] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedLoading, setSavedLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setError('Scholarship not found.');
        } else {
          setScholarship(data);
          // Fetch related scholarships (same country or same degree level)
          supabase
            .rpc('get_active_scholarships')
            .then(({ data: relData }) => {
              const related = (relData || [])
                .filter((item) => item.id !== id && item.country === data.country)
                .slice(0, 3);
              setRelated(related);
            });
        }
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from('saved_scholarships')
      .select('id')
      .eq('user_id', user.id)
      .eq('scholarship_id', id)
      .maybeSingle()
      .then(({ data }) => setIsSaved(!!data));
  }, [user, id]);

  const handleToggleSave = async () => {
    if (!user || !scholarship) return;
    setSavedLoading(true);
    if (isSaved) {
      await supabase
        .from('saved_scholarships')
        .delete()
        .eq('user_id', user.id)
        .eq('scholarship_id', scholarship.id);
      setIsSaved(false);
    } else {
      await supabase
        .from('saved_scholarships')
        .insert({ user_id: user.id, scholarship_id: scholarship.id, application_status: 'interested' });
      setIsSaved(true);
    }
    setSavedLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingState />
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error || 'Scholarship not found.'} />
        <div className="text-center mt-4">
          <Link to="/explore" className="text-sm text-[#13795B] hover:underline">
            ← Back to all scholarships
          </Link>
        </div>
      </div>
    );
  }

  const dlStatus = getDeadlineStatus(scholarship);
  const daysLeft = daysUntilDeadline(scholarship.application_deadline);

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <div className="text-sm text-[#14243A]">{value || <span className="text-gray-400 italic">Not available</span>}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#13795B]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/explore" className="hover:text-[#13795B]">Explore</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#14243A] truncate">{scholarship.title}</span>
      </nav>

      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#13795B] mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to scholarships
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${fundingTypeColor(scholarship.funding_type)}`}>
            {fundingTypeLabel(scholarship.funding_type)}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${deadlineStatusColor(dlStatus)}`}>
            {deadlineStatusLabel(dlStatus)}
          </span>
          {scholarship.programme_type === 'research' && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
              Research Programme
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-[#14243A] leading-tight mb-3">{scholarship.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          {scholarship.organisation && (
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-gray-400" /> {scholarship.organisation}
            </span>
          )}
          {scholarship.university && (
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-gray-400" /> {scholarship.university}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" /> {scholarship.country}
          </span>
        </div>

        {scholarship.description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{scholarship.description}</p>
        )}

        {user && (
          <button
            onClick={handleToggleSave}
            disabled={savedLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              isSaved
                ? 'text-[#13795B] border-[#13795B] bg-emerald-50 hover:bg-emerald-100'
                : 'text-gray-600 border-gray-200 hover:border-[#13795B] hover:text-[#13795B]'
            }`}
          >
            {isSaved ? <Bookmark className="w-4 h-4 fill-current" /> : <BookmarkPlus className="w-4 h-4" />}
            {isSaved ? 'Saved' : 'Save Scholarship'}
          </button>
        )}

        {!user && (
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-[#13795B] hover:text-[#13795B] transition-colors"
          >
            <BookmarkPlus className="w-4 h-4" /> Sign in to save
          </Link>
        )}
      </div>

      {/* Key Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#14243A] mb-4">Key Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <InfoRow icon={GraduationCap} label="Degree Level" value={scholarship.degree_level.join(', ')} />
          <InfoRow icon={MapPin} label="Destination Country" value={scholarship.country} />
          <InfoRow icon={BookOpen} label="Eligible Subjects" value={scholarship.subject_areas.join(', ')} />
          <InfoRow icon={FileText} label="Programme Type" value={scholarship.programme_type === 'research' ? 'Research' : 'Taught'} />
          <InfoRow icon={Calendar} label="Application Opens" value={formatDate(scholarship.application_open_date)} />
          <InfoRow icon={Calendar} label="Application Deadline" value={
            scholarship.application_deadline ? (
              <span>
                {formatDate(scholarship.application_deadline)}
                {daysLeft !== null && daysLeft >= 0 && (
                  <span className="text-xs text-gray-500 ml-2">({daysLeft} days remaining)</span>
                )}
              </span>
            ) : 'Not confirmed'
          } />
          <InfoRow icon={Clock} label="Last Verified" value={formatDate(scholarship.last_verified_at)} />
          <InfoRow icon={Globe2} label="Funding Type" value={fundingTypeLabel(scholarship.funding_type)} />
        </div>
      </div>

      {/* Funding Coverage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#14243A] mb-3">Funding Coverage</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {scholarship.funding_coverage || 'Funding coverage details are not available. Please check the official source for more information.'}
        </p>
        {scholarship.funding_type === 'fully_funded' && (
          <div className="mt-3 flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>This opportunity is labelled "Fully Funded" based on information from its official source. Verify the exact coverage on the official website.</span>
          </div>
        )}
      </div>

      {/* Eligibility */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#14243A] mb-4">Eligibility Requirements</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Citizenship Requirements</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {scholarship.eligible_nationalities.length > 0
                ? scholarship.eligible_nationalities.join(', ')
                : 'Not confirmed — check the official source.'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Academic Requirements</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {scholarship.academic_requirements || 'Not available — check the official source.'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Language Requirements</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {scholarship.language_requirements || 'Not available — check the official source.'}
            </p>
          </div>
        </div>
      </div>

      {/* Application */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#14243A] mb-4">Application Information</h2>
        <div className="space-y-4">
          {scholarship.application_instructions && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Application Process</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{scholarship.application_instructions}</p>
            </div>
          )}
          {scholarship.required_documents.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Required Documents</h3>
              <ul className="space-y-1.5">
                {scholarship.required_documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#13795B] flex-shrink-0 mt-0.5" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Official Links */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#14243A] mb-4">Official Sources</h2>
        <div className="space-y-3">
          {scholarship.application_url && (
            <a
              href={scholarship.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 px-4 py-3 bg-[#13795B] text-white rounded-lg hover:bg-[#0f6349] transition-colors group"
            >
              <span className="text-sm font-medium">Apply on Official Website</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
          {scholarship.official_source_url && (
            <a
              href={scholarship.official_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:border-[#13795B] hover:text-[#13795B] transition-colors group"
            >
              <span className="text-sm font-medium">Official Information Source</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>
        <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Always confirm requirements, deadlines, and eligibility on the official website before applying. ScholarPath does not award funding or guarantee admission.</span>
        </div>
      </div>

      {/* Related Opportunities */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#14243A] mb-4">Related Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
