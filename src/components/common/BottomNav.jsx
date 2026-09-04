import React from 'react';
import { Home, Compass, Bookmark, AlertTriangle, Sliders } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export function BottomNav({ currentTab, setTab }) {
  const { weatherData } = useWeather();
  const alertCount = weatherData?.alerts ? weatherData.alerts.length : 0;
  const hasSevereAlert = weatherData?.alerts?.some(a => a.level === 'orange' || a.level === 'red');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { 
      id: 'alerts', 
      label: 'Alerts', 
      icon: AlertTriangle,
      badge: alertCount > 0 ? alertCount : null,
      badgeColor: hasSevereAlert ? 'bg-orange-500' : 'bg-emerald-500'
    },
    { id: 'profile', label: 'Personalize', icon: Sliders },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto rounded-full bg-[#131B2E]/95 border border-white/[0.08] px-3 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl pointer-events-auto">
        <div className="flex items-center justify-between gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`relative flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#222F4C] text-white px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm gap-1.5' 
                    : 'text-slate-400 hover:text-slate-200 p-2 rounded-full hover:bg-white/5'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-accent-cyan scale-105' : 'text-slate-400'}`} />
                  {item.badge && (
                    <span className={`absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full ${item.badgeColor} text-[8px] font-bold text-white flex items-center justify-center animate-pulse`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {isActive && (
                  <span className="text-xs font-semibold text-white tracking-tight">
                    {item.label === 'Home' ? 'Today' : item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
