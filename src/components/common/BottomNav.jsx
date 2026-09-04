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
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2">
      <div className="max-w-md mx-auto rounded-3xl glass-nav px-3 py-2 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <div className="flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? 'text-sky-400 font-semibold scale-105' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                  {item.badge && (
                    <span className={`absolute -top-1.5 -right-2 w-4 h-4 rounded-full ${item.badgeColor} text-[9px] font-bold text-white flex items-center justify-center animate-pulse`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-sky-400' : 'text-slate-400'}`}>
                  {item.label}
                </span>

                {/* Subtle active pill indicator */}
                {isActive && (
                  <span className="absolute bottom-0 w-5 h-0.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
