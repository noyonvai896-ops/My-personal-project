import React, { useState, useEffect } from 'react';
import { MessageSquare, Settings, Plus } from 'lucide-react';

interface HeaderProps {
  userName: string;
  onOpenChat: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  onOpenChat,
  onOpenSettings,
  onOpenTutorial,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateString = `${days[currentTime.getDay()]}, ${currentTime.getDate()} ${months[currentTime.getMonth()]}`;

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h >= 5 && h < 12) return 'Good morning';
    if (h >= 12 && h < 17) return 'Good afternoon';
    if (h >= 17 && h < 21) return 'Good evening';
    return 'Good night';
  };

  return (
    <div className="w-full flex items-start justify-between px-4 pt-3 pb-2 select-none">
      <button
        onClick={onOpenChat}
        className="w-12 h-12 rounded-2xl bg-white/90 shadow-sm border border-purple-100 flex items-center justify-center text-purple-900 hover:bg-white hover:scale-105 transition-all active:scale-95 cursor-pointer"
        title="Open Chat"
      >
        <MessageSquare className="w-5 h-5 fill-purple-900 text-purple-900" />
      </button>

      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-1 font-heading">
          <span className="text-[#6342E8]">NURA</span>
          <span className="text-[#4BA3E3]">Ai</span>
        </h1>

        <p className="text-sm font-semibold text-slate-800 mt-0.5">
          {getGreeting()}, {userName || 'Noyon'}
        </p>

        <div className="text-4xl font-extrabold tracking-tight text-[#1F1D36] font-heading my-0.5">
          {timeString}
        </div>

        <p className="text-xs font-semibold text-purple-700/80">
          {dateString}
        </p>

        <div className="w-14 h-1 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-600 mt-1.5" />
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onOpenSettings}
          className="w-12 h-12 rounded-2xl bg-white/90 shadow-sm border border-purple-100 flex items-center justify-center text-slate-700 hover:bg-white hover:scale-105 transition-all active:scale-95 cursor-pointer"
          title="Settings & Intelligence"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenTutorial}
          className="w-12 h-12 rounded-2xl bg-white/90 shadow-sm border border-purple-100 flex items-center justify-center text-purple-700 hover:bg-white hover:scale-105 transition-all active:scale-95 cursor-pointer"
          title="Interactive Tutorial & Guide (+)"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
