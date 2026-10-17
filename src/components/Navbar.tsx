import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Compass } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navLinks = [
    { label: 'Explore Scholarships', path: '/explore' },
    { label: 'Find Your Match', path: '/matchmaker' },
    { label: 'Scholarship Guides', path: '/guides' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <Compass className="w-6 h-6 text-[#13795B]" strokeWidth={2} />
            <span className="text-lg font-bold text-[#14243A] tracking-tight">
              Scholar<span className="text-[#13795B]">Path</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-[#13795B] bg-emerald-50'
                    : 'text-gray-600 hover:text-[#14243A] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/dashboard')
                      ? 'text-[#13795B] bg-emerald-50'
                      : 'text-gray-600 hover:text-[#14243A] hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="ml-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#14243A] rounded-md hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="ml-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#14243A] rounded-md hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="ml-1 px-4 py-2 text-sm font-medium text-white bg-[#13795B] rounded-md hover:bg-[#0f6349] transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(link.path)
                    ? 'text-[#13795B] bg-emerald-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-sm font-medium text-white bg-[#13795B] rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
