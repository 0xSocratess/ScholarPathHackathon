import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Compass, Globe2, GraduationCap, FlaskConical, Plane, Clock, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Scholarship } from '@/lib/types';
import ScholarshipCard from '@/components/ScholarshipCard';
import { LoadingState } from '@/components/StateDisplay';
import { COUNTRY_LIST } from '@/lib/scholarshipUtils';

const QUICK_OPTIONS = [
  { label: 'Fully Funded', icon: GraduationCap, path: '/explore?funding=fully_funded' },
  { label: "Master's Scholarships", icon: BookOpen, path: '/explore?degree=Master%27s' },
  { label: 'PhD Funding', icon: FlaskConical, path: '/explore?degree=PhD' },
  { label: 'Research Opportunities', icon: FlaskConical, path: '/explore?programme=research' },
  { label: 'International Students', icon: Globe2, path: '/explore?nationality=all' },
  { label: 'Closing Soon', icon: Clock, path: '/explore?deadline=closing_soon' },
];

const FIELD_CATEGORIES = [
  'Philosophy', 'Psychology', 'Cognitive Science', 'Computer Science',
  'Engineering', 'Medicine and Health', 'Business and Economics',
  'Social Sciences', 'Arts and Humanities', 'Natural Sciences',
  'Education', 'Environmental Studies',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featured, setFeatured] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .rpc('get_active_scholarships')
      .then(({ data }) => {
        setFeatured((data || []).slice(0, 6) as Scholarship[]);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-[#F8F8F5] border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium mb-6">
            <Compass className="w-3.5 h-3.5" />
            International scholarship discovery
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14243A] leading-tight mb-4 tracking-tight">
            Your next opportunity could change everything.
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Discover international scholarships and funded postgraduate opportunities that match your ambitions, field of study, and future.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by subject, scholarship, university or country..."
                  className="w-full pl-12 pr-4 py-3.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13795B] focus:border-transparent bg-white"
                  aria-label="Search scholarships"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#13795B] text-white font-medium text-sm rounded-lg hover:bg-[#0f6349] transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          <Link
            to="/matchmaker"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#13795B] hover:gap-3 transition-all"
          >
            Find Scholarships That Fit Me
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="mt-6 text-xs text-gray-400">
            Explore opportunities. Understand eligibility. Apply with confidence.
          </p>
        </div>
      </section>

      {/* Quick Discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-semibold text-[#14243A] mb-6">Quick Discovery</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_OPTIONS.map((opt) => (
            <Link
              key={opt.label}
              to={opt.path}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-lg hover:border-[#13795B] hover:shadow-sm transition-all group"
            >
              <opt.icon className="w-6 h-6 text-[#13795B] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-center text-gray-700">{opt.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#14243A]">Featured Opportunities</h2>
            <p className="text-sm text-gray-500 mt-1">Real scholarships from verified official sources.</p>
          </div>
          <Link
            to="/explore"
            className="text-sm font-medium text-[#13795B] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Loading scholarships..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} />
            ))}
          </div>
        )}
      </section>

      {/* Explore by Field */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-semibold text-[#14243A] mb-6">Explore by Field of Study</h2>
          <div className="flex flex-wrap gap-2">
            {FIELD_CATEGORIES.map((field) => (
              <Link
                key={field}
                to={`/explore?q=${encodeURIComponent(field)}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-emerald-50 hover:border-[#13795B] hover:text-[#13795B] transition-all"
              >
                {field}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Destination */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-semibold text-[#14243A] mb-6">Explore by Destination</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {COUNTRY_LIST.map((country) => (
            <Link
              key={country}
              to={`/explore?country=${encodeURIComponent(country)}`}
              className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#13795B] hover:shadow-sm transition-all group"
            >
              <Globe2 className="w-4 h-4 text-gray-400 group-hover:text-[#13795B] transition-colors" />
              <span className="text-sm text-gray-700 group-hover:text-[#14243A]">{country}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Scholarship Guides */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#14243A]">Scholarship Guides</h2>
              <p className="text-sm text-gray-500 mt-1">Practical advice for your scholarship journey.</p>
            </div>
            <Link
              to="/guides"
              className="text-sm font-medium text-[#13795B] hover:underline flex items-center gap-1"
            >
              All guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'How to find fully funded Master\'s scholarships', slug: 'fully-funded-masters-scholarships' },
              { title: 'How to find funded PhD programmes', slug: 'funded-phd-programmes' },
              { title: 'How to apply for international scholarships', slug: 'apply-for-international-scholarships' },
              { title: 'How to prepare a scholarship application', slug: 'prepare-scholarship-application' },
              { title: 'Understanding IELTS and English-language requirements', slug: 'ielts-english-requirements' },
              { title: 'Writing a statement of purpose', slug: 'writing-statement-of-purpose' },
            ].map((guide) => (
              <Link
                key={guide.slug}
                to={`/guides/${guide.slug}`}
                className="block p-5 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#13795B] hover:bg-white hover:shadow-sm transition-all group"
              >
                <BookOpen className="w-5 h-5 text-[#13795B] mb-3" />
                <h3 className="text-sm font-semibold text-[#14243A] group-hover:text-[#13795B] transition-colors leading-snug">
                  {guide.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#14243A] mb-3">Ready to find your match?</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Answer a few questions about your background and preferences, and we'll match you with opportunities that fit.
        </p>
        <Link
          to="/matchmaker"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#13795B] text-white font-medium text-sm rounded-lg hover:bg-[#0f6349] transition-colors"
        >
          <Plane className="w-4 h-4" />
          Find Your Scholarship Match
        </Link>
      </section>
    </div>
  );
}
