import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { guides } from '@/lib/guides';

export default function GuidesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mb-8">
        <p className="text-sm font-semibold text-[#13795B] mb-2">Scholarship Guides</p>
        <h1 className="text-3xl font-bold text-[#14243A] mb-3">Make the application process clearer.</h1>
        <p className="text-gray-600 leading-relaxed">Practical, honest guidance for finding funding, preparing your documents, and applying with confidence.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((guide) => (
          <Link key={guide.slug} to={`/guides/${guide.slug}`} className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-[#13795B] hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <BookOpen className="w-6 h-6 text-[#13795B] flex-shrink-0" />
              <span className="text-xs text-gray-400">{guide.readTime}</span>
            </div>
            <h2 className="text-lg font-semibold text-[#14243A] mt-5 mb-2 group-hover:text-[#13795B]">{guide.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{guide.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-[#13795B]">Read guide <ArrowRight className="w-4 h-4" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold text-[#14243A] mb-3">Guide not found</h1><Link to="/guides" className="text-[#13795B]">Back to guides</Link></div>;
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/guides" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#13795B] mb-8"><ArrowLeft className="w-4 h-4" /> All guides</Link>
      <p className="text-sm font-semibold text-[#13795B] mb-3">{guide.readTime}</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-[#14243A] leading-tight mb-4">{guide.title}</h1>
      <p className="text-lg text-gray-600 leading-relaxed mb-10">{guide.excerpt}</p>
      <div className="space-y-9">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold text-[#14243A] mb-3">{section.heading}</h2>
            <p className="text-gray-700 leading-7">{section.body}</p>
            {section.checklist && <ul className="mt-4 space-y-2">{section.checklist.map((item) => <li key={item} className="flex gap-2 text-sm text-gray-700"><span className="text-[#13795B]">✓</span>{item}</li>)}</ul>}
          </section>
        ))}
      </div>
      {guide.resources.length > 0 && <div className="mt-10 bg-white border border-gray-200 rounded-xl p-6"><h2 className="text-lg font-semibold text-[#14243A] mb-3">Authoritative resources</h2><div className="space-y-2">{guide.resources.map((resource) => <a key={resource.url} href={resource.url} target={resource.url.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="flex items-center justify-between text-sm text-[#13795B] hover:underline"><span>{resource.label}</span><ExternalLink className="w-4 h-4" /></a>)}</div></div>}
    </article>
  );
}
