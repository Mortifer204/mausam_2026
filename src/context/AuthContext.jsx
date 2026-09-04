import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_AUTH_KEY = 'mausam_auth_user_v2';

// Strict Gmail validation regex
export function isValidGmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const gmailRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@gmail\.com$/;
  return gmailRegex.test(trimmed);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authView, setAuthView] = useState('welcome'); // 'welcome' | 'login' | 'signup'
  const [authLoading, setAuthLoading] = useState(false);
  const [lastUserPreferences, setLastUserPreferences] = useState(null);
  const [shouldOpenOnboarding, setShouldOpenOnboarding] = useState(false);

  // Persist session to localStorage for active tab
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_AUTH_KEY);
      }
    } catch (e) {
      console.warn('Could not persist auth state:', e);
    }
  }, [user]);

  /**
   * Log In against backend API
   */
  const login = async (email, password) => {
    if (!isValidGmail(email)) {
      throw new Error('Please enter a valid Gmail address ending with @gmail.com (e.g., yourname@gmail.com).');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to log in.');
      }

      setUser(data.user);
      setShouldOpenOnboarding(true);
      if (data.preferences) {
        if (data.user?.email) {
          try {
            localStorage.setItem(`mausam_user_pref_${data.user.email}`, JSON.stringify(data.preferences));
          } catch (e) {}
        }
        setLastUserPreferences(data.preferences);
      }
      setAuthLoading(false);
      return data;
    } catch (err) {
      setAuthLoading(false);
      throw err;
    }
  };

  /**
   * Sign Up against backend API
   */
  const signup = async (name, email, password) => {
    if (!isValidGmail(email)) {
      throw new Error('Please provide a valid Gmail address ending with @gmail.com (e.g., yourname@gmail.com).');
    }
    if (!name || !name.trim()) {
      throw new Error('Please enter your full name.');
    }
    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters.');
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up.');
      }

      setUser(data.user);
      setShouldOpenOnboarding(true);
      if (data.preferences) {
        if (data.user?.email) {
          try {
            localStorage.setItem(`mausam_user_pref_${data.user.email}`, JSON.stringify(data.preferences));
          } catch (e) {}
        }
        setLastUserPreferences(data.preferences);
      }
      setAuthLoading(false);
      return data;
    } catch (err) {
      setAuthLoading(false);
      throw err;
    }
  };

  /**
   * Continue as Trial / Guest
   */
  const continueAsGuest = () => {
    const guestUser = {
      id: 'usr_guest',
      email: 'guest@gmail.com',
      name: 'Guest Citizen',
      isGuest: true,
      loginTime: new Date().toISOString()
    };
    setUser(guestUser);
    setLastUserPreferences(null);
    setShouldOpenOnboarding(true);
  };

  /**
   * Log Out: Clears active session from current screen, BUT DOES NOT DELETE USER DATA FROM BACKEND!
   */
  const logout = () => {
    setUser(null);
    setLastUserPreferences(null);
    setShouldOpenOnboarding(false);
    setAuthView('welcome');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authView,
        setAuthView,
        authLoading,
        lastUserPreferences,
        login,
        signup,
        continueAsGuest,
        logout,
        shouldOpenOnboarding,
        setShouldOpenOnboarding,
        isValidGmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
