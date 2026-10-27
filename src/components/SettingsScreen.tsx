import React, { useState } from 'react';
import {
  Sparkles,
  User,
  ShieldCheck,
  MessageSquare,
  Cpu,
  Database,
  Lock,
  Smile,
  Smartphone,
  Palette,
  Send,
  Phone,
  ChevronRight,
  CheckCircle2,
  Download,
  Volume2,
  Globe
} from 'lucide-react';
import { UserProfile, ServerStatus, VoicePersona } from '../types';

interface SettingsScreenProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (profile: Partial<UserProfile>) => void;
  serverStatus: ServerStatus | null;
  onOpenApiKeyModal: () => void;
  onOpenMemoriesModal: () => void;
  onOpenPermissionsModal: () => void;
  onOpenVoiceModal: () => void;
  onOpenLanguageModal: () => void;
  onOpenAccountModal: () => void;
  onOpenLicenseModal: () => void;
  onOpenAvatarModal: () => void;
  onOpenAutomationModal: () => void;
  onOpenTutorial: () => void;
  memoryCount: number;
  hasCustomKey: boolean;
  themeColor: 'lavender' | 'sunset' | 'cosmic' | 'emerald' | 'cyber';
  onChangeTheme: (theme: 'lavender' | 'sunset' | 'cosmic' | 'emerald' | 'cyber') => void;
  isInstallable: boolean;
  onInstallApp: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  userProfile,
  onUpdateUserProfile,
  serverStatus,
  onOpenApiKeyModal,
  onOpenMemoriesModal,
  onOpenPermissionsModal,
  onOpenVoiceModal,
  onOpenLanguageModal,
  onOpenAccountModal,
  onOpenLicenseModal,
  onOpenAvatarModal,
  onOpenAutomationModal,
  onOpenTutorial,
  memoryCount,
  hasCustomKey,
  themeColor,
  onChangeTheme,
  isInstallable,
  onInstallApp,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const getPersonaLabel = (p: VoicePersona) => {
    switch (p) {
      case 'female':
        return 'মায়া (মেয়ে কণ্ঠ)';
      case 'male':
        return 'কবির (ছেলে কণ্ঠ)';
      case 'elder':
        return 'দাদু (বয়স্ক প্রবীণ কণ্ঠ)';
      case 'neural':
      default:
        return 'অরা (আধুনিক নিউরাল)';
    }
  };

  const getLanguageLabel = (code: string) => {
    if (code === 'auto') return 'Auto (স্বয়ংক্রিয়)';
    if (code.startsWith('bn')) return 'বাংলা';
    if (code.startsWith('en')) return 'English';
    if (code.startsWith('hi')) return 'हिन्दी';
    if (code.startsWith('ar')) return 'العربية';
    return code;
  };

  return (
    <div className="w-full flex flex-col px-4 pt-4 pb-28 max-w-md mx-auto select-none">
      {/* Title Header matching Screenshot 3 & 5 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-[#1F1D36] font-heading flex items-center gap-2">
            Settings & Intelligence
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            System preferences & neural configuration
          </p>
        </div>
        <div
          onClick={onOpenTutorial}
          className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6342E8] hover:bg-purple-100 transition cursor-pointer"
          title="Open Tutorial & Guide"
        >
          <Sparkles className="w-5 h-5 fill-current" />
        </div>
      </div>

      {/* Decorative hairline progress bar */}
      <div className="w-full h-1 bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-300 rounded-full mb-4" />

      {/* PWA Mobile Install Banner */}
      {isInstallable && (
        <div className="mb-4 p-3.5 bg-gradient-to-r from-[#6342E8] to-[#8E5BF5] text-white rounded-2xl shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold">Install NURA Ai App</div>
              <div className="text-[10px] text-purple-100">Add to phone home screen (Full Screen)</div>
            </div>
          </div>
          <button
            onClick={onInstallApp}
            className="px-3 py-1.5 bg-white text-[#6342E8] font-bold rounded-xl text-xs hover:bg-purple-50 cursor-pointer"
          >
            Install
          </button>
        </div>
      )}

      {/* SECTION 1: SYSTEM & DATA ENGINE matching Screenshot 3 & 5 */}
      <div className="mb-2">
        <span className="text-[11px] font-black tracking-wider text-[#6342E8] uppercase">
          SYSTEM & DATA ENGINE
        </span>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-purple-100 shadow-sm divide-y divide-purple-50 overflow-hidden mb-6">
        {/* 1. NURA Account & User */}
        <div
          onClick={onOpenAccountModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>{userProfile.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-purple-100 text-[#6342E8] rounded-md font-bold">
                  OPERATOR
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                লগইন করুন বা নতুন NURA ID খুলুন
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* 2. NURA License */}
        <div
          onClick={onOpenLicenseModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>NURA License</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-md font-bold">
                  ACTIVE
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                লাইসেন্স সক্রিয় করুন বা অবস্থা দেখুন
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* 3. Family Messaging */}
        <div
          onClick={onOpenAccountModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Family Messaging</div>
              <div className="text-[11px] font-medium text-slate-400">
                Trusted connections, requests & family chat
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* 4. Gemini Live API & Model */}
        <div
          onClick={onOpenApiKeyModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>Gemini Live API & Model</span>
                {hasCustomKey || serverStatus?.hasEnvKey ? (
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-md font-bold">
                    CONNECTED
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-700 rounded-md font-bold">
                    SETUP
                  </span>
                )}
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                gemini-3.8-flash • Live WebSocket
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* 5. Neural Memory Bank */}
        <div
          onClick={onOpenMemoriesModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>Neural Memory Bank</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-purple-100 text-[#6342E8] rounded-md font-bold">
                  {memoryCount} facts
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                Search, review and back up learned facts
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* 6. System Permissions */}
        <div
          onClick={onOpenPermissionsModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">System Permissions</div>
              <div className="text-[11px] font-medium text-slate-400">
                Microphone, Accessibility, Notifications & System
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* 7. Overlay Avatars */}
        <div
          onClick={onOpenAvatarModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Overlay Avatars</div>
              <div className="text-[11px] font-medium text-slate-400">
                Choose a floating avatar or turn the overlay off
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* 8. Cute Floating Island */}
        <div
          onClick={onOpenAvatarModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Cute Floating Island</div>
              <div className="text-[11px] font-medium text-slate-400">
                Animated cute face pill, expressions & gradients
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-[#6342E8]">
            {userProfile.avatarSeed !== 'disabled' ? 'ON' : 'OFF'}
          </div>
        </div>

        {/* 9. AI Voice Persona (Boy, Girl, Elder, Neural) */}
        <div
          onClick={onOpenVoiceModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer bg-purple-50/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>AI Voice Persona (কণ্ঠ)</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-purple-200 text-purple-900 rounded-md font-bold">
                  MULTI-VOICE
                </span>
              </div>
              <div className="text-[11px] font-medium text-purple-700">
                {getPersonaLabel(userProfile.voicePersona)} • {userProfile.voiceSpeed}x speed
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* 10. Voice & System Language */}
        <div
          onClick={onOpenLanguageModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Voice Language</div>
              <div className="text-[11px] font-medium text-purple-700 font-semibold">
                {getLanguageLabel(userProfile.preferredLanguage)} (যেকোনো দেশের ভাষা)
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* 11. App Control & Hands-Free */}
        <div
          onClick={onOpenAutomationModal}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">App Control & Hands-Free</div>
              <div className="text-[11px] font-medium text-slate-400">
                WhatsApp, YouTube, Media & Phone Automation
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
      </div>

      {/* SECTION 2: APPEARANCE & SECURITY matching Screenshot 5 */}
      <div className="mb-2">
        <span className="text-[11px] font-black tracking-wider text-[#6342E8] uppercase">
          APPEARANCE & SECURITY
        </span>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-purple-100 shadow-sm divide-y divide-purple-50 overflow-hidden mb-6">
        {/* Theme & 3D Orb Colors */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Theme & 3D Orb Colors</div>
              <div className="text-[11px] font-medium text-slate-400 capitalize">
                {themeColor} Sunset Theme
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            {(['lavender', 'sunset', 'cosmic', 'emerald', 'cyber'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChangeTheme(t)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  themeColor === t ? 'scale-125 border-purple-600' : 'border-white'
                } ${
                  t === 'lavender'
                    ? 'bg-purple-400'
                    : t === 'sunset'
                    ? 'bg-rose-400'
                    : t === 'cosmic'
                    ? 'bg-blue-400'
                    : t === 'emerald'
                    ? 'bg-emerald-400'
                    : 'bg-slate-800'
                }`}
                title={t}
              />
            ))}
          </div>
        </div>

        {/* Privacy & Data Shield */}
        <div
          onClick={() => setActiveModal('privacy')}
          className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Privacy & Data Shield</div>
              <div className="text-[11px] font-medium text-slate-400">
                On-device biometric processing & TLS encryption
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
      </div>

      {/* Developer Credit Footer matching Screenshot 5 */}
      <div className="flex flex-col items-center justify-center pt-2 pb-4 text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-purple-200 bg-white shadow-xs flex items-center justify-center text-[#6342E8] hover:bg-purple-50 hover:scale-105 transition-all"
            title="Telegram"
          >
            <Send className="w-5 h-5" />
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-purple-200 bg-white shadow-xs flex items-center justify-center text-[#6342E8] hover:bg-purple-50 hover:scale-105 transition-all font-bold text-lg"
            title="Facebook"
          >
            f
          </a>

          <a
            href="https://wa.me"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-purple-200 bg-white shadow-xs flex items-center justify-center text-[#6342E8] hover:bg-purple-50 hover:scale-105 transition-all"
            title="WhatsApp"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        <p className="text-xs font-bold text-slate-400">
          NURA AI • v1.8.13
        </p>
        <p className="text-sm font-black text-[#6342E8] mt-0.5">
          Developed by Nafiz Fuad Noyon
        </p>
      </div>

      {/* Privacy modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h3 className="text-sm font-bold text-slate-900">Privacy & Data Shield</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>
                All Neural Memories and user credentials are stored exclusively in your browser local storage.
              </p>
              <p>
                Requests sent to Google Gemini are securely encrypted via TLS 1.3 with industry standard protocols.
              </p>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-[#6342E8] text-white rounded-xl font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
