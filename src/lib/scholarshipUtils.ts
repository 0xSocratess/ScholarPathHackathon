import type { Scholarship } from './types';

export type DeadlineStatus = 'open' | 'closing_soon' | 'closed' | 'upcoming' | 'not_confirmed';

function parseDateValue(value: string, endOfDay = false): Date {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    return new Date(
      Number(dateOnly[1]),
      Number(dateOnly[2]) - 1,
      Number(dateOnly[3]),
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 999 : 0,
    );
  }
  return new Date(value);
}

function startOfToday(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function endOfToday(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
}

export function isPubliclyDiscoverable(scholarship: Scholarship, now = new Date()): boolean {
  if (scholarship.status === 'closed') return false;

  if (scholarship.application_deadline && parseDateValue(scholarship.application_deadline, true) >= now) {
    return true;
  }

  const hasVerifiedOpenRound = scholarship.application_deadline === null && scholarship.currently_open_verified;
  const hasVerifiedFutureRound = scholarship.next_round_verified
    && !!scholarship.next_application_open_date
    && !!scholarship.next_application_deadline
    && parseDateValue(scholarship.next_application_open_date) <= now
    && parseDateValue(scholarship.next_application_deadline, true) >= now;

  return hasVerifiedOpenRound || hasVerifiedFutureRound;
}

export function getDeadlineStatus(scholarship: Scholarship, now = new Date()): DeadlineStatus {
  const nextRoundIsKnown = scholarship.next_round_verified
    && !!scholarship.next_application_open_date
    && !!scholarship.next_application_deadline;

  if (!scholarship.application_deadline) {
    if (nextRoundIsKnown && parseDateValue(scholarship.next_application_open_date as string) > now) return 'upcoming';
    if (nextRoundIsKnown && parseDateValue(scholarship.next_application_deadline as string, true) >= now) return 'open';
    return scholarship.currently_open_verified ? 'open' : 'not_confirmed';
  }

  const deadline = parseDateValue(scholarship.application_deadline, true);
  const today = startOfToday(now);
  const diffDays = Math.ceil((deadline.getTime() - endOfToday(now).getTime()) / (1000 * 60 * 60 * 24));

  if (deadline < today) {
    if (nextRoundIsKnown && parseDateValue(scholarship.next_application_deadline as string, true) >= now) {
      return parseDateValue(scholarship.next_application_open_date as string) > now ? 'upcoming' : 'open';
    }
    return 'closed';
  }
  if (diffDays <= 30) return 'closing_soon';

  if (scholarship.application_open_date) {
    const openDate = parseDateValue(scholarship.application_open_date);
    if (now < openDate) return 'upcoming';
  }

  return 'open';
}

export function deadlineStatusLabel(status: DeadlineStatus): string {
  switch (status) {
    case 'open': return 'Open';
    case 'closing_soon': return 'Closing Soon';
    case 'closed': return 'Closed';
    case 'upcoming': return 'Upcoming';
    case 'not_confirmed': return 'Deadline Not Confirmed';
  }
}

export function deadlineStatusColor(status: DeadlineStatus): string {
  switch (status) {
    case 'open': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'closing_soon': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'closed': return 'bg-gray-100 text-gray-500 border-gray-200';
    case 'upcoming': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'not_confirmed': return 'bg-gray-50 text-gray-500 border-gray-200';
  }
}

export function fundingTypeLabel(fundingType: string): string {
  if (fundingType === 'fully_funded') return 'Fully Funded';
  if (fundingType === 'partially_funded') return 'Partially Funded';
  return fundingType;
}

export function fundingTypeColor(fundingType: string): string {
  if (fundingType === 'fully_funded') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (fundingType === 'partially_funded') return 'bg-blue-50 text-blue-700 border-blue-200';
  return 'bg-gray-50 text-gray-700 border-gray-200';
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not available';
  const date = parseDateValue(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatShortDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  const date = parseDateValue(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function daysUntilDeadline(deadline: string | null, now = new Date()): number | null {
  if (!deadline) return null;
  const d = parseDateValue(deadline, true);
  return Math.ceil((d.getTime() - endOfToday(now).getTime()) / (1000 * 60 * 60 * 24));
}

const SEARCH_ALIASES: Record<string, string[]> = {
  philosophy: [
    'philosophy', 'political philosophy', 'political theory', 'ethics',
    'applied ethics', 'moral philosophy', 'philosophy of science',
    'philosophy of mind', 'cognitive science', 'logic', 'epistemology',
    'metaphysics', 'social and political theory', 'history of philosophy',
    'philosophy of religion', 'bioethics',
  ],
  ethics: ['ethics', 'applied ethics', 'moral philosophy', 'bioethics'],
  'philosophy of science': ['philosophy of science', 'logic', 'epistemology'],
  'political philosophy': ['political philosophy', 'political theory', 'social and political theory'],
};

function searchableText(scholarship: Scholarship): string {
  return [
    scholarship.title,
    scholarship.organisation,
    scholarship.university,
    scholarship.country,
    scholarship.description,
    scholarship.funding_coverage,
    scholarship.academic_requirements,
    scholarship.language_requirements,
    scholarship.application_instructions,
    scholarship.funding_type,
    scholarship.programme_type,
    ...scholarship.degree_level,
    ...scholarship.subject_areas,
    ...scholarship.eligible_nationalities,
    ...scholarship.required_documents,
    ...scholarship.keywords,
  ].filter(Boolean).join(' ').toLowerCase();
}

export function searchScholarships(
  scholarships: Scholarship[],
  query: string,
): Scholarship[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return scholarships;

  const terms = SEARCH_ALIASES[normalizedQuery] || [normalizedQuery];
  return scholarships.filter((scholarship) => {
    const searchable = searchableText(scholarship);
    return terms.some((term) => searchable.includes(term));
  });
}

export const COUNTRY_LIST = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Netherlands', 'Sweden', 'Norway', 'Finland', 'Denmark',
  'Switzerland', 'Ireland', 'Japan', 'South Korea', 'China', 'Singapore',
  'New Zealand', 'Multiple Countries', 'Kuwait',
];

export const SUBJECT_AREAS = [
  'Philosophy', 'Psychology', 'Cognitive Science', 'Computer Science',
  'Engineering', 'Medicine and Health', 'Business and Economics',
  'Social Sciences', 'Arts and Humanities', 'Natural Sciences',
  'Education', 'Environmental Studies', 'All fields', 'Economic Sciences',
  'Agricultural Sciences', 'Public Health', 'Law', 'Political Science',
  'Architecture', 'Renewable Energy', 'Biomedical Sciences',
];

export const DEGREE_LEVELS = ["Master's", 'PhD', 'Postdoc'];
export const FUNDING_TYPES = ['fully_funded', 'partially_funded'];

export const APPLICATION_STATUSES = [
  'interested', 'preparing_documents', 'ready_to_apply', 'applied',
  'interview_assessment', 'outcome_received',
];

export function applicationStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    interested: 'Interested', preparing_documents: 'Preparing Documents',
    ready_to_apply: 'Ready to Apply', applied: 'Applied',
    interview_assessment: 'Interview or Assessment', outcome_received: 'Outcome Received',
  };
  return labels[status] || status;
}

export function applicationStatusColor(status: string): string {
  const colors: Record<string, string> = {
    interested: 'bg-blue-50 text-blue-700 border-blue-200',
    preparing_documents: 'bg-amber-50 text-amber-700 border-amber-200',
    ready_to_apply: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    applied: 'bg-violet-50 text-violet-700 border-violet-200',
    interview_assessment: 'bg-orange-50 text-orange-700 border-orange-200',
    outcome_received: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
}
