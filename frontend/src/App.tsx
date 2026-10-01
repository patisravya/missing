import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewSearchPage } from './pages/NewSearchPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';

import { api } from './services/api';
import type { CaseItem, DashboardStats, User } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('landing');
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [demoMode, setDemoMode] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [stats, setStats] = useState<DashboardStats>({
    total_searches: 42,
    videos_processed: 126,
    people_detected: 8421,
    potential_matches: 37,
    awaiting_review: 14,
  });

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser(user);
    loadData();
  }, []);

  const loadData = async () => {
    const fetchedCases = await api.getCases();
    setCases(fetchedCases);
    const fetchedStats = await api.getDashboardStats();
    setStats(fetchedStats);
    if (fetchedCases.length > 0) {
      setSelectedCase(fetchedCases[0]);
    }
  };

  const handleRunDemo = async () => {
    setActiveTab('dashboard');
    const demoCase = await api.startSearch(1);
    setSelectedCase(demoCase);
    setActiveTab('results');
  };

  const handleSelectCase = (c: CaseItem) => {
    setSelectedCase(c);
    setActiveTab('results');
  };

  const handleSearchComplete = (newCase: CaseItem) => {
    setCases((prev) => [newCase, ...prev]);
    setSelectedCase(newCase);
    setActiveTab('results');
  };

  const handleReviewCandidate = async (candidateId: number, decision: 'kept' | 'rejected' | 'pending', notes: string) => {
    await api.reviewCandidate(candidateId, decision, notes);
    loadData();
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setAuthInitialMode('signin');
    setActiveTab('login');
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthInitialMode(mode);
    setActiveTab('login');
  };

  if (activeTab === 'landing') {
    return (
      <LandingPage
        onStartSearch={() => setActiveTab('new-search')}
        onRunDemo={handleRunDemo}
        onSignInClick={() => handleOpenAuth('signin')}
        onSignUpClick={() => handleOpenAuth('signup')}
      />
    );
  }

  if (activeTab === 'login') {
    return (
      <LoginPage
        initialMode={authInitialMode}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab('dashboard');
        }}
        onBackToLanding={() => setActiveTab('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-mono selection:bg-blue-600 selection:text-white">
      <DisclaimerBanner />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar
            demoMode={demoMode}
            setDemoMode={(val) => {
              setDemoMode(val);
              api.setDemoMode(val);
            }}
            onRunDemo={handleRunDemo}
            onNewSearchClick={() => setActiveTab('new-search')}
            currentUser={currentUser}
            onLogout={handleLogout}
            onSwitchUser={() => handleOpenAuth('signin')}
          />

          <main className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardPage
                stats={stats}
                cases={cases}
                onSelectCase={handleSelectCase}
                onNewSearch={() => setActiveTab('new-search')}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'new-search' && (
              <NewSearchPage onSearchComplete={handleSearchComplete} />
            )}

            {activeTab === 'results' && (
              <ResultsPage
                caseData={selectedCase || cases[0]}
                onReviewCandidate={handleReviewCandidate}
                onNewSearch={() => setActiveTab('new-search')}
              />
            )}

            {activeTab === 'history' && (
              <HistoryPage cases={cases} onSelectCase={handleSelectCase} />
            )}

            {activeTab === 'reports' && <ReportsPage cases={cases} />}

            {activeTab === 'settings' && <SettingsPage />}

            {activeTab === 'help' && <HelpPage />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
