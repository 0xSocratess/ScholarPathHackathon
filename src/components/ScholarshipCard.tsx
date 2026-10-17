import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';
import type { Scholarship } from '@/lib/types';
import {
  getDeadlineStatus,
  deadlineStatusLabel,
  deadlineStatusColor,
  fundingTypeLabel,
  fundingTypeColor,
  formatShortDate,
} from '@/lib/scholarshipUtils';

interface Props {
  scholarship: Scholarship;
}

export default function ScholarshipCard({ scholarship }: Props) {
  const dlStatus = getDeadlineStatus(scholarship);

  return (
    <Link
      to={`/scholarship/${scholarship.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-5 hover:border-[#13795B] hover:shadow-md transition-all duration-200 group"
    >
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${fundingTypeColor(scholarship.funding_type)}`}>
          {fundingTypeLabel(scholarship.funding_type)}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${deadlineStatusColor(dlStatus)}`}>
          {deadlineStatusLabel(dlStatus)}
        </span>
        {scholarship.programme_type === 'research' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
            Research
          </span>
        )}
      </div>
    </div>

    <h3 className="text-base font-semibold text-[#14243A] leading-snug mb-1 group-hover:text-[#13795B] transition-colors line-clamp-2">
      {scholarship.title}
    </h3>

    <p className="text-sm text-gray-500 mb-3">
      {scholarship.organisation || scholarship.university || 'Funding organisation not confirmed'}
    </p>

    <div className="space-y-1.5 text-xs text-gray-600 mb-4">
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span>{scholarship.country}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span>Deadline: {scholarship.application_deadline ? formatShortDate(scholarship.application_deadline) : 'Not confirmed'}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span>Verified: {formatShortDate(scholarship.last_verified_at)}</span>
      </div>
    </div>

    {scholarship.subject_areas.length > 0 && scholarship.subject_areas[0] !== 'All fields' && (
      <div className="flex flex-wrap gap-1 mb-3">
        {scholarship.subject_areas.slice(0, 3).map((subj) => (
          <span key={subj} className="px-2 py-0.5 text-xs bg-gray-50 text-gray-600 rounded border border-gray-100">
            {subj}
          </span>
        ))}
        {scholarship.subject_areas.length > 3 && (
          <span className="px-2 py-0.5 text-xs text-gray-400">+{scholarship.subject_areas.length - 3} more</span>
        )}
      </div>
    )}

    <div className="flex items-center text-xs font-medium text-[#13795B] group-hover:gap-2 transition-all">
      View Details
      <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </Link>
  );
}
