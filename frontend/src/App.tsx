import { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PaperList from './components/PaperList';
import PaperDetail from './components/PaperDetail';
import UserDashboard from './components/UserDashboard';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export type View = 'home' | 'paper-detail' | 'dashboard';

function App() {
  const { isAuthenticated } = useInternetIdentity();

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleViewPaper = (paperId: string) => {
    setSelectedPaperId(paperId);
    setCurrentView('paper-detail');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPaperId(null);
  };

  const handleNavigateToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleNavigateToHome = () => {
    setCurrentView('home');
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <Header
          currentView={currentView}
          onNavigateHome={handleNavigateToHome}
          onNavigateDashboard={handleNavigateToDashboard}
        />

        <main className="flex-1">
          {currentView === 'home' && (
            <>
              <Hero />
              <PaperList onViewPaper={handleViewPaper} />
            </>
          )}

          {currentView === 'paper-detail' && selectedPaperId && (
            <PaperDetail
              paperId={selectedPaperId}
              onBack={handleBackToHome}
              onNavigateToPaper={handleViewPaper}
            />
          )}

          {currentView === 'dashboard' && (
            <UserDashboard onViewPaper={handleViewPaper} />
          )}
        </main>

        <Footer />

        {showProfileSetup && <ProfileSetupModal />}

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
