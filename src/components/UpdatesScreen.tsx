import React from 'react';
import { Sparkles, Download, CheckCircle2, Shield, Smartphone, VolumeX, MessageSquare } from 'lucide-react';

interface UpdatesScreenProps {
  silentExecution: boolean;
  onToggleSilentExecution: () => void;
  isInstallable: boolean;
  onInstallApp: () => void;
}

export const UpdatesScreen: React.FC<UpdatesScreenProps> = ({
  silentExecution,
  onToggleSilentExecution,
  isInstallable,
  onInstallApp,
}) => {
  return (
    <div className="w-full flex flex-col px-4 pt-4 pb-28 max-w-md mx-auto select-none">
      {/* Header matching Screenshot 2 */}
      <div className="mb-4">
        <h2 className="text-2xl font-black text-[#1F1D36] font-heading">
          Updates
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          NURA AI updates & announcements
        </p>
      </div>

      {/* PWA Mobile App Card */}
      {isInstallable && (
        <div className="mb-3.5 p-4 rounded-3xl bg-gradient-to-tr from-[#6342E8] to-[#915BFF] text-white shadow-md shadow-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-white/20 rounded-md">
              MOBILE APP (APK / PWA)
            </span>
            <span className="text-xs font-bold text-purple-200">Ready</span>
          </div>
          <h3 className="text-sm font-bold mb-1">Install NURA Ai on Your Phone</h3>
          <p className="text-xs text-purple-100 leading-relaxed mb-3">
            Add NURA Ai to your Android home screen as a standalone full-screen mobile app with offline capabilities and high performance.
          </p>
          <button
            onClick={onInstallApp}
            className="w-full py-2 bg-white text-[#6342E8] font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-purple-50 transition cursor-pointer"
          >
            <Download className="w-4 h-4" /> Install Application
          </button>
        </div>
      )}

      {/* 1. AGENT TASKS matching Screenshot 2 */}
      <div className="mb-3.5 p-4 rounded-3xl bg-white/95 border border-purple-100/90 shadow-sm shadow-purple-50">
        <div className="text-[10px] font-black tracking-wider text-[#6342E8] uppercase mb-1">
          AGENT TASKS
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1.5">
          Verified actions and recovery
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          NURA AI observes the current screen, checks action results, tracks progress, and stops safely when the UI is unclear.
        </p>
      </div>

      {/* 2. FLOATING AVATAR matching Screenshot 2 */}
      <div className="mb-3.5 p-4 rounded-3xl bg-white/95 border border-purple-100/90 shadow-sm shadow-purple-50">
        <div className="text-[10px] font-black tracking-wider text-[#6342E8] uppercase mb-1">
          FLOATING AVATAR
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1.5">
          Always-on or working-only display
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Choose an avatar, double-tap for compact task progress, drag it anywhere on screen, and choose a dock edge in Settings.
        </p>
      </div>

      {/* 3. TASK PROGRESS matching Screenshot 2 */}
      <div className="mb-3.5 p-4 rounded-3xl bg-white/95 border border-purple-100/90 shadow-sm shadow-purple-50">
        <div className="text-[10px] font-black tracking-wider text-[#6342E8] uppercase mb-1">
          TASK PROGRESS
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1.5">
          Four-step compact status
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The task HUD shows the goal, recent steps, a running indicator, completed checks, and a subdued dark progress line.
        </p>
      </div>

      {/* 4. SILENT EXECUTION matching Screenshot 2 */}
      <div className="mb-3.5 p-4 rounded-3xl bg-white/95 border border-purple-100/90 shadow-sm shadow-purple-50">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] font-black tracking-wider text-[#6342E8] uppercase">
            SILENT EXECUTION
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={silentExecution}
              onChange={onToggleSilentExecution}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6342E8]" />
          </label>
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1.5">
          Quiet task automation
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          When enabled, task narration is muted while ordinary conversation stays audible.
        </p>
      </div>

      {/* 5. WHATSAPP matching Screenshot 2 */}
      <div className="mb-3.5 p-4 rounded-3xl bg-white/95 border border-purple-100/90 shadow-sm shadow-purple-50">
        <div className="text-[10px] font-black tracking-wider text-[#6342E8] uppercase mb-1">
          WHATSAPP
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1.5">
          Saved contact lookup
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Allows automated messaging, voice typing, and contact lookup with hands-free operation.
        </p>
      </div>
    </div>
  );
};
