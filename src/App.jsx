import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { AppShell } from './components/common/AppShell';
import { AuthPage } from './pages/auth/AuthPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { PropertiesPage } from './pages/properties/PropertiesPage';
import { PropertyFormPage } from './pages/properties/PropertyFormPage';
import { PropertyDetailsPage } from './pages/properties/PropertyDetailsPage';
import { LeadsPage } from './pages/leads/LeadsPage';
import { LeadFormPage } from './pages/leads/LeadFormPage';
import { LeadDetailsPage } from './pages/leads/LeadDetailsPage';
import { SocietiesPage } from './pages/societies/SocietiesPage';
import { SocietyFormPage } from './pages/societies/SocietyFormPage';
import { SocietyDetailsPage } from './pages/societies/SocietyDetailsPage';
import { MicroMarketsPage } from './pages/microMarkets/MicroMarketsPage';
import { MicroMarketFormPage } from './pages/microMarkets/MicroMarketFormPage';
import { MicroMarketDetailsPage } from './pages/microMarkets/MicroMarketDetailsPage';
import { ProfilePage } from './pages/profile/ProfilePage';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth Route (Single-User Login) */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<Navigate to="/login" replace />} />

              {/* Protected Application Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Properties */}
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/new" element={<PropertyFormPage />} />
                <Route path="/properties/:id" element={<PropertyDetailsPage />} />
                <Route path="/properties/:id/edit" element={<PropertyFormPage />} />

                {/* Leads */}
                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/leads/new" element={<LeadFormPage />} />
                <Route path="/leads/:id" element={<LeadDetailsPage />} />
                <Route path="/leads/:id/edit" element={<LeadFormPage />} />

                {/* Societies */}
                <Route path="/societies" element={<SocietiesPage />} />
                <Route path="/societies/new" element={<SocietyFormPage />} />
                <Route path="/societies/:id" element={<SocietyDetailsPage />} />
                <Route path="/societies/:id/edit" element={<SocietyFormPage />} />

                {/* Micro Markets */}
                <Route path="/micro-markets" element={<MicroMarketsPage />} />
                <Route path="/micro-markets/new" element={<MicroMarketFormPage />} />
                <Route path="/micro-markets/:id" element={<MicroMarketDetailsPage />} />
                <Route path="/micro-markets/:id/edit" element={<MicroMarketFormPage />} />

                {/* Profile & Settings */}
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;