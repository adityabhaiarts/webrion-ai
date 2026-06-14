/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import { AuthProvider, useAuth } from "./lib/auth";

import DashboardGenerator from "./pages/dashboard/Generator";
import DashboardPricing from "./pages/dashboard/Pricing";
import DashboardTemplates from "./pages/dashboard/Templates";
import DashboardChats from "./pages/dashboard/Chats";
import DashboardWebsites from "./pages/dashboard/Websites";
import DashboardSettings from "./pages/dashboard/Settings";

// Public route that redirects to dashboard if logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard/generator" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Top Layer */}
          <Route element={<Layout />}>
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          </Route>
          
          {/* Dashboard Layer */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/generator" replace />} />
            <Route path="generator" element={<DashboardGenerator />} />
            <Route path="chats" element={<DashboardChats />} />
            <Route path="websites" element={<DashboardWebsites />} />
            <Route path="templates" element={<DashboardTemplates />} />
            <Route path="pricing" element={<DashboardPricing />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>

          {/* Legacy redirects */}
          <Route path="/app" element={<Navigate to="/dashboard/generator" replace />} />
          <Route path="/app/:path" element={<Navigate to="/dashboard/generator" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

