import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PersonalizationProvider, usePersonalization } from './context/PersonalizationContext';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { SavedLocationsScreen } from './screens/SavedLocationsScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LifestyleInterestsModal } from './components/common/LifestyleInterestsModal';
import { getThemeForCondition } from './utils/weatherThemes';
import { Loader2 } from 'lucide-react';

function AuthenticatedApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLifestyleModalOpen, setIsLifestyleModalOpen] = useState(false);
  const { hasCompletedOnboarding, isOnboardingModalOpen, setIsOnboardingModalOpen } = usePersonalization();
  const { shouldOpenOnboarding, setShouldOpenOnboarding } = useAuth();
  const { weatherData } = useWeather();

  const currentConditionCode = weatherData?.current?.conditionCode || 'pleasant';
  const weatherTheme = getThemeForCondition(currentConditionCode);

  useEffect(() => {
    if (weatherTheme?.bgGradient) {
      document.body.style.background = weatherTheme.bgGradient;
      document.body.style.backgroundAttachment = 'fixed';
    }
  }, [weatherTheme]);

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen onOpenOnboarding={() => setIsOnboardingOpen(true)} />;
      case 'explore':
        return <ExploreScreen />;
      case 'saved':
        return <SavedLocationsScreen onSelectLocation={() => setCurrentTab('home')} />;
      case 'alerts':
        return <AlertsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onOpenOnboarding={() => setIsOnboardingOpen(true)} />;
    }
  };

  return (
    <div 
      className="min-h-screen text-[#F1F5F9] flex flex-col antialiased selection:bg-cyan-500/30 selection:text-white font-sans transition-all duration-700"
      style={{
        background: weatherTheme.bgGradient,
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      {/* 1. Official App Header */}
      <Header 
        onOpenPersonaModal={() => setIsLifestyleModalOpen(true)} 
        onOpenLocationModal={() => setCurrentTab('saved')} 
      />

      {/* 2. Dynamic Screen View */}
      <main className="flex-1 w-full flex flex-col justify-start">
        {!weatherData ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <div className="text-sm font-bold text-white">Fetching Live Meteorological Feeds...</div>
            <p className="text-xs text-slate-400 max-w-xs">
              Detecting real-time temperature, satellite observations, and local air quality...
            </p>
          </div>
        ) : (
          renderActiveScreen()
        )}
      </main>

      {/* 3. Floating Glassmorphism Bottom Navigation */}
      <BottomNav currentTab={currentTab} setTab={setCurrentTab} />

      {/* 4. Progressive Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen || shouldOpenOnboarding || !hasCompletedOnboarding || isOnboardingModalOpen}
        onClose={() => {
          setIsOnboardingOpen(false);
          setShouldOpenOnboarding(false);
          setIsOnboardingModalOpen?.(false);
        }}
      />

      {/* 5. Lifestyle Interests Modal on top of Home Screen */}
      <LifestyleInterestsModal
        isOpen={isLifestyleModalOpen}
        onClose={() => setIsLifestyleModalOpen(false)}
      />
    </div>
  );
}

function RootApp() {
  const { isAuthenticated, authView } = useAuth();

  // If citizen is not logged in or in guest mode, show the Welcome / Landing / Auth experience
  if (!isAuthenticated) {
    if (authView === 'login') {
      return <AuthScreen initialMode="login" />;
    }
    if (authView === 'signup') {
      return <AuthScreen initialMode="signup" />;
    }
    return <WelcomeScreen />;
  }

  // Once authenticated (or guest trial chosen), show the full personalized application
  return (
    <PersonalizationProvider>
      <WeatherProvider>
        <AuthenticatedApp />
      </WeatherProvider>
    </PersonalizationProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  );
}
