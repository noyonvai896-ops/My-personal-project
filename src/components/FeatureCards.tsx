import React from 'react';
import { Tv, Layers, Globe } from 'lucide-react';

interface FeatureCardsProps {
  onOpenScreenVision: () => void;
  onOpenMemories: () => void;
  onOpenLanguageModal: () => void;
  currentLanguage: string;
  memoryCount: number;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({
  onOpenScreenVision,
  onOpenMemories,
  onOpenLanguageModal,
  currentLanguage,
  memoryCount,
}) => {
  const getLanguageLabel = () => {
    if (currentLanguage === 'bn-BD') return '🇧🇩 বাংলা';
    if (currentLanguage === 'bn-IN') return '🇮🇳 বাংলা';
    if (currentLanguage === 'en-US') return '🇺🇸 English';
    if (currentLanguage === 'en-GB') return '🇬🇧 English';
    if (currentLanguage === 'hi-IN') return '🇮🇳 हिन्दी';
    if (currentLanguage === 'ar-SA') return '🇸🇦 العربية';
    if (currentLanguage === 'es-ES') return '🇪🇸 Español';
    if (currentLanguage === 'auto') return '🌐 Auto';
    return currentLanguage;
  };

  return (
    <div className="w-full grid grid-cols-3 gap-2.5 mt-2 select-none">
      {/* 1. Screen / Share Screen */}
      <button
        onClick={onOpenScreenVision}
        className="flex flex-col items-start p-3.5 bg-white/95 rounded-2xl border border-purple-100 shadow-sm shadow-purple-50 text-left hover:border-purple-200 transition-all active:scale-[0.98] group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#6342E8] mb-2 group-hover:scale-105 transition-transform">
          <Tv className="w-4 h-4" />
        </div>
        <div className="text-xs font-bold text-slate-800">Screen</div>
        <div className="text-[10px] font-medium text-slate-400">Share screen</div>
      </button>

      {/* 2. Memories / Recall Core */}
      <button
        onClick={onOpenMemories}
        className="flex flex-col items-start p-3.5 bg-white/95 rounded-2xl border border-purple-100 shadow-sm shadow-purple-50 text-left hover:border-purple-200 transition-all active:scale-[0.98] group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#6342E8] mb-2 group-hover:scale-105 transition-transform">
          <Layers className="w-4 h-4" />
        </div>
        <div className="text-xs font-bold text-slate-800 flex items-center justify-between w-full">
          <span>Memories</span>
          {memoryCount > 0 && (
            <span className="text-[9px] px-1.5 py-0.2 bg-purple-100 text-purple-700 rounded-full font-bold">
              {memoryCount}
            </span>
          )}
        </div>
        <div className="text-[10px] font-medium text-slate-400">Recall Core</div>
      </button>

      {/* 3. Language / Auto */}
      <button
        onClick={onOpenLanguageModal}
        className="flex flex-col items-start p-3.5 bg-white/95 rounded-2xl border border-purple-100 shadow-sm shadow-purple-50 text-left hover:border-purple-200 transition-all active:scale-[0.98] group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#6342E8] mb-2 group-hover:scale-105 transition-transform">
          <Globe className="w-4 h-4" />
        </div>
        <div className="text-xs font-bold text-slate-800">Language</div>
        <div className="text-[10px] font-medium text-purple-600 font-semibold truncate max-w-[85px]">
          {getLanguageLabel()}
        </div>
      </button>
    </div>
  );
};
