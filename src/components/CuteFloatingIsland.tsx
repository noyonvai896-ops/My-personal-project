import React, { useState } from 'react';
import { Sparkles, Mic, Volume2, X } from 'lucide-react';

interface CuteFloatingIslandProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  statusText?: string;
  onMicToggle: () => void;
  enabled: boolean;
}

export const CuteFloatingIsland: React.FC<CuteFloatingIslandProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  statusText,
  onMicToggle,
  enabled,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!enabled) return null;

  const getExpression = () => {
    if (isListening) return { face: '(⊙_⊙)', label: 'Listening...' };
    if (isProcessing) return { face: '(•̀ᴗ•́)و', label: 'Thinking...' };
    if (isSpeaking) return { face: '(＾◡＾)♪', label: 'Speaking...' };
    return { face: '(・‿・)', label: 'NURA Ready' };
  };

  const expression = getExpression();

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 transition-all duration-300">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer transition-all duration-300 ease-out flex items-center justify-between rounded-full shadow-lg border border-white/50 backdrop-blur-xl ${
          isListening
            ? 'bg-rose-500/90 text-white shadow-rose-300/50 px-4 py-1.5'
            : isSpeaking
            ? 'bg-purple-600/90 text-white shadow-purple-300/50 px-4 py-1.5'
            : isProcessing
            ? 'bg-indigo-600/90 text-white shadow-indigo-300/50 px-4 py-1.5'
            : 'bg-white/85 text-slate-800 shadow-purple-100 px-3.5 py-1'
        } ${isExpanded ? 'scale-105' : 'hover:scale-102'}`}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold tracking-wider select-none animate-pulse">
            {expression.face}
          </span>
          <span className="text-[11px] font-semibold tracking-wide">
            {statusText || expression.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          {isListening ? (
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          ) : isSpeaking ? (
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
          ) : (
            <Sparkles className="w-3 h-3 text-purple-500" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-purple-100 p-3 mt-1 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-purple-50">
            <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Cute Island HUD
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-2.5 text-center">
            <div className="text-2xl font-mono mb-1">{expression.face}</div>
            <p className="text-xs text-slate-500">
              NURA AI Neural Companion • Active
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onMicToggle();
              setIsExpanded(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-200 hover:opacity-95"
          >
            <Mic className="w-3.5 h-3.5" />
            {isListening ? 'Stop Listening' : 'Tap to Speak Now'}
          </button>
        </div>
      )}
    </div>
  );
};
