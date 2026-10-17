import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import ScholarshipDetailPage from '@/pages/ScholarshipDetailPage';
import MatchmakerPage from '@/pages/MatchmakerPage';
import DashboardPage from '@/pages/DashboardPage';
import { SignInPage, SignUpPage, ResetPasswordPage } from '@/pages/AuthPages';
import GuidesPage, { GuideDetailPage } from '@/pages/GuidesPage';
import StaticPage from '@/pages/StaticPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/scholarship/:id" element={<ScholarshipDetailPage />} />
          <Route path="/matchmaker" element={<MatchmakerPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:slug" element={<GuideDetailPage />} />
          <Route path="/about" element={<StaticPage page="about" />} />
          <Route path="/contact" element={<StaticPage page="contact" />} />
          <Route path="/privacy" element={<StaticPage page="privacy" />} />
          <Route path="/terms" element={<StaticPage page="terms" />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
