import React, { useState } from 'react';
import { Globe, Check, Search, X } from 'lucide-react';
import { LanguageOption } from '../types';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'auto', name: 'Auto Detect', nativeName: 'স্বয়ংক্রিয় সনাক্তকরণ', flag: '🌐' },
  { code: 'bn-BD', name: 'Bengali (Bangladesh)', nativeName: 'বাংলা (বাংলাদেশ)', flag: '🇧🇩' },
  { code: 'bn-IN', name: 'Bengali (India)', nativeName: 'বাংলা (ভারত)', flag: '🇮🇳' },
  { code: 'en-US', name: 'English (United States)', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (United Kingdom)', nativeName: 'English (UK)', flag: '🇬🇧' },
  { code: 'hi-IN', name: 'Hindi (India)', nativeName: 'हिन्दी (भारत)', flag: '🇮🇳' },
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', nativeName: 'العربية (السعودية)', flag: '🇸🇦' },
  { code: 'es-ES', name: 'Spanish (Spain)', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (France)', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Germany)', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja-JP', name: 'Japanese (Japan)', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ur-PK', name: 'Urdu (Pakistan)', nativeName: 'اردو', flag: '🇵🇰' },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(query.toLowerCase()) ||
      l.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Voice & System Language
              </h3>
              <p className="text-[10px] text-slate-500">
                যেকোনো দেশের ভাষা নির্বাচন করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="py-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country / language..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-purple-100 bg-purple-50/40 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6342E8]"
            />
          </div>
        </div>

        {/* Languages List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 py-1 pr-1">
          {filtered.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50/90 border-[#6342E8] shadow-xs'
                    : 'bg-white border-purple-50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {lang.nativeName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {lang.name}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#6342E8] flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
