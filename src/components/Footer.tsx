import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#14243A] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-[#13795B]" />
              <span className="text-lg font-bold text-white">
                Scholar<span className="text-[#13795B]">Path</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover international scholarships and funded postgraduate opportunities that match your ambitions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="hover:text-white transition-colors">Explore Scholarships</Link></li>
              <li><Link to="/matchmaker" className="hover:text-white transition-colors">Find Your Match</Link></li>
              <li><Link to="/guides" className="hover:text-white transition-colors">Scholarship Guides</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About ScholarPath</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Disclaimer</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              ScholarPath provides scholarship information for discovery purposes only. Applicants should always confirm requirements, deadlines, and eligibility on official scholarship and university websites. ScholarPath does not award funding or guarantee admission.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-xs text-gray-400 flex flex-col sm:flex-row justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} ScholarPath. All rights reserved.</p>
          <p>Verify all information on official sources before applying.</p>
        </div>
      </div>
    </footer>
  );
}
