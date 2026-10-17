import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Scholarship } from '@/lib/types';
import ScholarshipCard from '@/components/ScholarshipCard';
import { LoadingState, SearchEmptyState, ErrorState } from '@/components/StateDisplay';
import {
  searchScholarships,
  getDeadlineStatus,
  COUNTRY_LIST,
  DEGREE_LEVELS,
  FUNDING_TYPES,
  fundingTypeLabel,
} from '@/lib/scholarshipUtils';

type SortOption = 'relevance' | 'recently_verified' | 'deadline_approaching' | 'newest';

interface Filters {
  query: string;
  degree: string[];
  country: string[];
  funding: string[];
  programme: string;
  deadline: string;
  nationality: string;
  language: string;
}

const EMPTY_FILTERS: Filters = {
  query: '',
  degree: [],
  country: [],
  funding: [],
  programme: '',
  deadline: '',
  nationality: '',
  language: '',
};

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  // Read initial filters from URL params
  useEffect(() => {
    const newFilters: Filters = { ...EMPTY_FILTERS };
    const q = searchParams.get('q');
    if (q) newFilters.query = q;
    const degree = searchParams.get('degree');
    if (degree) newFilters.degree = [degree];
    const country = searchParams.get('country');
    if (country) newFilters.country = [country];
    const funding = searchParams.get('funding');
    if (funding) newFilters.funding = [funding];
    const programme = searchParams.get('programme');
    if (programme) newFilters.programme = programme;
    const deadline = searchParams.get('deadline');
    if (deadline) newFilters.deadline = deadline;
    const nationality = searchParams.get('nationality');
    if (nationality === 'all') newFilters.nationality = 'all';
    setFilters(newFilters);
  }, [searchParams]);

  // Fetch scholarships
  useEffect(() => {
    setLoading(true);
    supabase
      .rpc('get_active_scholarships')
      .then(({ data, error }) => {
        if (error) {
          setError('Failed to load scholarships. Please try again.');
        } else {
          setScholarships(data || []);
        }
        setLoading(false);
      });
  }, []);

  const toggleArrayFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      const newArr = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: newArr };
    });
  };

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSearchParams({});
  }, [setSearchParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.degree.length;
    count += filters.country.length;
    count += filters.funding.length;
    if (filters.programme) count++;
    if (filters.deadline) count++;
    if (filters.nationality) count++;
    if (filters.language) count++;
    return count;
  }, [filters]);

  const filtered = useMemo(() => {
    let results = scholarships;

    // Text search
    if (filters.query) {
      results = searchScholarships(results, filters.query);
    }

    // Degree filter
    if (filters.degree.length > 0) {
      results = results.filter((s) =>
        filters.degree.some((d) => s.degree_level.includes(d))
      );
    }

    // Country filter
    if (filters.country.length > 0) {
      results = results.filter((s) => filters.country.includes(s.country));
    }

    // Funding filter
    if (filters.funding.length > 0) {
      results = results.filter((s) => filters.funding.includes(s.funding_type));
    }

    // Programme type filter
    if (filters.programme) {
      results = results.filter((s) => s.programme_type === filters.programme);
    }

    // Deadline filter
    if (filters.deadline) {
      results = results.filter((s) => {
        const status = getDeadlineStatus(s);
        if (filters.deadline === 'closing_soon') return status === 'closing_soon' || status === 'open';
        if (filters.deadline === 'open') return status === 'open';
        if (filters.deadline === 'closed') return status === 'closed';
        if (filters.deadline === 'upcoming') return status === 'upcoming';
        return true;
      });
    }

    // Nationality filter
    if (filters.nationality === 'all') {
      results = results.filter((s) =>
        s.eligible_nationalities.some((n) => n.toLowerCase().includes('all nationalities'))
      );
    }

    // Language filter
    if (filters.language === 'no_ielts') {
      results = results.filter((s) => {
        const lang = (s.language_requirements || '').toLowerCase();
        return !lang.includes('ielts') && !lang.includes('toefl');
      });
    }

    // Sorting
    if (sort === 'recently_verified') {
      results = [...results].sort((a, b) => {
        const aDate = new Date(a.last_verified_at || 0).getTime();
        const bDate = new Date(b.last_verified_at || 0).getTime();
        return bDate - aDate;
      });
    } else if (sort === 'deadline_approaching') {
      results = [...results].sort((a, b) => {
        if (!a.application_deadline) return 1;
        if (!b.application_deadline) return -1;
        return new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime();
      });
    } else if (sort === 'newest') {
      results = [...results].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return results;
  }, [scholarships, filters, sort]);

  const updateSearchQuery = (value: string) => {
    setFilters((prev) => ({ ...prev, query: value }));
    if (value) {
      searchParams.set('q', value);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingState message="Loading scholarships..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => updateSearchQuery(e.target.value)}
            placeholder="Search by subject, scholarship, university or country..."
            className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent bg-white"
            aria-label="Search scholarships"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter sidebar (desktop) / button (mobile) */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#14243A]">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#13795B] hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Degree Level */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Degree Level</label>
                <div className="space-y-1.5">
                  {DEGREE_LEVELS.map((deg) => (
                    <label key={deg} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.degree.includes(deg)}
                        onChange={() => toggleArrayFilter('degree', deg)}
                        className="w-4 h-4 rounded border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                      />
                      <span className="text-sm text-gray-700">{deg}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Funding Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Funding</label>
                <div className="space-y-1.5">
                  {FUNDING_TYPES.map((fund) => (
                    <label key={fund} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.funding.includes(fund)}
                        onChange={() => toggleArrayFilter('funding', fund)}
                        className="w-4 h-4 rounded border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                      />
                      <span className="text-sm text-gray-700">{fundingTypeLabel(fund)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Destination</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {COUNTRY_LIST.map((country) => (
                    <label key={country} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.country.includes(country)}
                        onChange={() => toggleArrayFilter('country', country)}
                        className="w-4 h-4 rounded border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                      />
                      <span className="text-sm text-gray-700">{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Programme Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Programme Type</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="programme"
                      checked={filters.programme === ''}
                      onChange={() => setFilters((prev) => ({ ...prev, programme: '' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">Any</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="programme"
                      checked={filters.programme === 'taught'}
                      onChange={() => setFilters((prev) => ({ ...prev, programme: 'taught' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">Taught</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="programme"
                      checked={filters.programme === 'research'}
                      onChange={() => setFilters((prev) => ({ ...prev, programme: 'research' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">Research</span>
                  </label>
                </div>
              </div>

              {/* Deadline Status */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Application Status</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deadline"
                      checked={filters.deadline === ''}
                      onChange={() => setFilters((prev) => ({ ...prev, deadline: '' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">Any</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deadline"
                      checked={filters.deadline === 'open'}
                      onChange={() => setFilters((prev) => ({ ...prev, deadline: 'open' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">Open</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deadline"
                      checked={filters.deadline === 'closing_soon'}
                      onChange={() => setFilters((prev) => ({ ...prev, deadline: 'closing_soon' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">Closing Soon</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deadline"
                      checked={filters.deadline === 'closed'}
                      onChange={() => setFilters((prev) => ({ ...prev, deadline: 'closed' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">Closed</span>
                  </label>
                </div>
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Nationality</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="nationality"
                      checked={filters.nationality === ''}
                      onChange={() => setFilters((prev) => ({ ...prev, nationality: '' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">Any</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="nationality"
                      checked={filters.nationality === 'all'}
                      onChange={() => setFilters((prev) => ({ ...prev, nationality: 'all' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">Open to All Nationalities</span>
                  </label>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Language Requirements</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      checked={filters.language === ''}
                      onChange={() => setFilters((prev) => ({ ...prev, language: '' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">Any</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      checked={filters.language === 'no_ielts'}
                      onChange={() => setFilters((prev) => ({ ...prev, language: 'no_ielts' }))}
                      className="w-4 h-4 border-gray-300 text-[#13795B] focus:ring-[#13795B]"
                    />
                    <span className="text-sm text-gray-700">No IELTS/TOEFL mentioned</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-[#14243A]">{filtered.length}</span> {filtered.length === 1 ? 'scholarship' : 'scholarships'} found
            </p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Sort by:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#13795B]"
              >
                <option value="relevance">Relevance</option>
                <option value="recently_verified">Recently Verified</option>
                <option value="deadline_approaching">Deadline Approaching</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.degree.map((d) => (
                <span key={d} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">
                  {d}
                  <button onClick={() => toggleArrayFilter('degree', d)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              {filters.country.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">
                  {c}
                  <button onClick={() => toggleArrayFilter('country', c)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              {filters.funding.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">
                  {fundingTypeLabel(f)}
                  <button onClick={() => toggleArrayFilter('funding', f)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              {filters.programme && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">
                  {filters.programme}
                  <button onClick={() => setFilters((prev) => ({ ...prev, programme: '' }))}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.deadline && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">
                  {filters.deadline.replace('_', ' ')}
                  <button onClick={() => setFilters((prev) => ({ ...prev, deadline: '' }))}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-[#14243A] underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <SearchEmptyState
              query={filters.query}
              onClear={clearFilters}
              onSearch={updateSearchQuery}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((s) => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
          )}

          {filtered.length === 0 && scholarships.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                to="/matchmaker"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#13795B] hover:underline"
              >
                Try the Scholarship Matchmaker instead →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
