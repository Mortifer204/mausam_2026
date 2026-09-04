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
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-3 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto rounded-3xl bg-[#111A2E]/90 border border-white/[0.08] px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl pointer-events-auto">
        <div className="grid grid-cols-5 items-center">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const displayLabel = item.label === 'Home' ? 'Today' : item.label;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active highlight background pill/indicator */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-white/[0.08] border border-white/[0.1] shadow-sm -z-0" />
                )}

                <div className="relative z-10 flex items-center justify-center mb-1">
                  <Icon className={`w-4 h-4 transition-all duration-200 ${
                    isActive ? 'text-cyan-400 scale-110 stroke-[2.2]' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  {item.badge && (
                    <span className={`absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full ${item.badgeColor} text-[8px] font-bold text-white flex items-center justify-center shadow-sm ${isActive ? 'ring-2 ring-[#111A2E]' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className={`relative z-10 text-[10px] font-medium tracking-tight transition-colors duration-200 truncate max-w-full ${
                  isActive ? 'text-cyan-300 font-semibold' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  {displayLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
