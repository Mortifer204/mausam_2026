import React, { useState } from 'react';
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
import { Loader2 } from 'lucide-react';

function AuthenticatedApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const { hasCompletedOnboarding } = usePersonalization();
  const { weatherData } = useWeather();

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'saved':
        return <SavedLocationsScreen onSelectLocation={() => setCurrentTab('home')} />;
      case 'alerts':
        return <AlertsScreen />;
      case 'profile':
        return <ProfileScreen onOpenOnboarding={() => setIsOnboardingOpen(true)} />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B111E] text-slate-100 flex flex-col antialiased selection:bg-[#00E5FF] selection:text-black font-sans">
      {/* 1. Official App Header */}
      <Header 
        onOpenPersonaModal={() => setCurrentTab('profile')} 
        onOpenLocationModal={() => setCurrentTab('saved')} 
      />

      {/* 2. Dynamic Screen View */}
      <main className="flex-1 w-full flex flex-col justify-start">
        {!weatherData ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
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
        isOpen={isOnboardingOpen || !hasCompletedOnboarding}
        onClose={() => setIsOnboardingOpen(false)}
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
