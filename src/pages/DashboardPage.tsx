import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Bookmark, Clock, FileText, CheckCircle2, Trash2, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import type { SavedScholarship } from '@/lib/types';
import {
  getDeadlineStatus, deadlineStatusLabel, deadlineStatusColor,
  fundingTypeLabel, fundingTypeColor, formatShortDate, daysUntilDeadline,
  APPLICATION_STATUSES, applicationStatusLabel, applicationStatusColor,
} from '@/lib/scholarshipUtils';
import { LoadingState, EmptyState } from '@/components/StateDisplay';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [saved, setSaved] = useState<SavedScholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('saved_scholarships')
      .select('*, scholarship:scholarships(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSaved(data || []);
        setLoading(false);
      });
  }, [user]);

  const handleUpdateStatus = async (id: string, status: string) => {
    await supabase
      .from('saved_scholarships')
      .update({ application_status: status })
      .eq('id', id);
    setSaved((prev) =>
      prev.map((s) => (s.id === id ? { ...s, application_status: status } : s))
    );
  };

  const handleRemove = async (id: string) => {
    await supabase
      .from('saved_scholarships')
      .delete()
      .eq('id', id);
    setSaved((prev) => prev.filter((s) => s.id !== id));
  };

  if (authLoading) return <LoadingState />;
  if (!user) return <Navigate to="/signin" replace />;

  const stats = {
    interested: saved.filter((s) => s.application_status === 'interested').length,
    preparing: saved.filter((s) => s.application_status === 'preparing_documents').length,
    applied: saved.filter((s) => s.application_status === 'applied' || s.application_status === 'ready_to_apply').length,
    closingSoon: saved.filter((s) => {
      if (!s.scholarship) return false;
      const dl = getDeadlineStatus(s.scholarship);
      return dl === 'closing_soon';
    }).length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#14243A] mb-2">Your Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">Track your saved scholarships and application progress.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-500">Interested</span>
          </div>
          <p className="text-2xl font-bold text-[#14243A]">{stats.interested}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-500">Preparing</span>
          </div>
          <p className="text-2xl font-bold text-[#14243A]">{stats.preparing}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-500">Applied</span>
          </div>
          <p className="text-2xl font-bold text-[#14243A]">{stats.applied}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500">Closing Soon</span>
          </div>
          <p className="text-2xl font-bold text-[#14243A]">{stats.closingSoon}</p>
        </div>
      </div>

      {/* Saved scholarships */}
      <h2 className="text-lg font-semibold text-[#14243A] mb-4">Saved Scholarships</h2>

      {loading ? (
        <LoadingState />
      ) : saved.length === 0 ? (
        <EmptyState
          title="No saved scholarships yet"
          message="Browse scholarships and save the ones you're interested in to track them here."
          action={
            <Link to="/explore" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#13795B] rounded-lg hover:bg-[#0f6349] transition-colors">
              Explore Scholarships <ChevronRight className="w-4 h-4" />
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {saved.map((item) => {
            if (!item.scholarship) return null;
            const s = item.scholarship;
            const dlStatus = getDeadlineStatus(s);
            const daysLeft = daysUntilDeadline(s.application_deadline);

            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <Link to={`/scholarship/${s.id}`} className="text-base font-semibold text-[#14243A] hover:text-[#13795B] transition-colors">
                      {s.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {s.organisation || s.university} — {s.country}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${fundingTypeColor(s.funding_type)}`}>
                    {fundingTypeLabel(s.funding_type)}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${deadlineStatusColor(dlStatus)}`}>
                    {deadlineStatusLabel(dlStatus)}
                  </span>
                  {s.application_deadline && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
                      Deadline: {formatShortDate(s.application_deadline)}
                      {daysLeft !== null && daysLeft >= 0 && ` (${daysLeft}d left)`}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${applicationStatusColor(item.application_status)}`}>
                    {applicationStatusLabel(item.application_status)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-500">Update status:</label>
                  <select
                    value={item.application_status}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#13795B]"
                  >
                    {APPLICATION_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {applicationStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
