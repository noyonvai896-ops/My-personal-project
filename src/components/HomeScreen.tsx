import React from "react";
import { Header } from "./Header";
import { ParticleOrb } from "./ParticleOrb";
import { WeatherCard } from "./WeatherCard";
import { FeatureCards } from "./FeatureCards";
import { CuteFloatingIsland } from "./CuteFloatingIsland";
import { Sparkles, MessageCircle, Phone, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { WeatherInfo, AssistantAction } from "../types";

interface HomeScreenProps {
  userName: string;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  transcript: string;
  interimTranscript: string;
  lastAiResponse: string;
  onMicToggle: () => void;
  onOpenChat: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  onOpenScreenVision: () => void;
  onOpenMemories: () => void;
  onOpenLanguageModal: () => void;
  currentLanguage: string;
  memoryCount: number;
  weather: WeatherInfo;
  onRefreshWeather: () => void;
  isWeatherLoading: boolean;
  activeAction: AssistantAction | null;
  onExecuteAction: (action: AssistantAction) => void;
  onQuickPrompt: (text: string) => void;
  cuteIslandEnabled: boolean;
  themeColor: "lavender" | "sunset" | "cosmic" | "emerald" | "cyber";
  isSpeakerActive: boolean;
  onToggleSpeaker: () => void;
  hasCustomKey: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  isListening,
  isSpeaking,
  isProcessing,
  transcript,
  interimTranscript,
  lastAiResponse,
  onMicToggle,
  onOpenChat,
  onOpenSettings,
  onOpenTutorial,
  onOpenScreenVision,
  onOpenMemories,
  onOpenLanguageModal,
  currentLanguage,
  memoryCount,
  weather,
  onRefreshWeather,
  isWeatherLoading,
  activeAction,
  onExecuteAction,
  onQuickPrompt,
  cuteIslandEnabled,
  themeColor,
  isSpeakerActive,
  onToggleSpeaker,
  hasCustomKey,
}) => {
  const currentTranscript = interimTranscript || transcript;

  return (
    <div className="w-full flex flex-col items-center pb-24 max-w-md mx-auto">
      <CuteFloatingIsland
        enabled={cuteIslandEnabled}
        isListening={isListening}
        isSpeaking={isSpeaking}
        isProcessing={isProcessing}
        onMicToggle={onMicToggle}
      />

      <Header
        userName={userName}
        onOpenChat={onOpenChat}
        onOpenSettings={onOpenSettings}
        onOpenTutorial={onOpenTutorial}
        isSpeakerActive={isSpeakerActive}
        onToggleSpeaker={onToggleSpeaker}
      />

      {/* 3D Particle Orb */}
      <div className="my-1">
        <ParticleOrb
          isListening={isListening}
          isSpeaking={isSpeaking}
          isProcessing={isProcessing}
          onTap={onMicToggle}
          themeColor={themeColor === "emerald" ? "cosmic" : themeColor === "cyber" ? "lavender" : themeColor}
        />
      </div>

      {/* Microphone Status Pill */}
      <div className="flex flex-col items-center text-center select-none my-1">
        <button
          onClick={onMicToggle}
          className={"flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-300 shadow-sm active:scale-95 cursor-pointer " + (
            isListening
              ? "bg-rose-50 border-rose-200 text-rose-600 shadow-rose-100 ring-2 ring-rose-300/40"
              : isProcessing
              ? "bg-purple-50 border-purple-200 text-purple-700 shadow-purple-100"
              : isSpeaking
              ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-indigo-100"
              : "bg-white border-purple-100/90 text-slate-800 shadow-purple-100/40 hover:bg-purple-50/50"
          )}
        >
          <span
            className={"w-2.5 h-2.5 rounded-full " + (
              isListening
                ? "bg-rose-500 animate-ping"
                : isProcessing
                ? "bg-purple-600 animate-pulse"
                : isSpeaking
                ? "bg-indigo-600 animate-pulse"
                : "bg-rose-500"
            )}
          />
          <span className="text-xs font-black tracking-wider uppercase">
            {isListening
              ? "LISTENING... TAP TO STOP"
              : isProcessing
              ? "NURA IS THINKING..."
              : isSpeaking
              ? "NURA IS SPEAKING..."
              : "MIC MUTED (OFF) • TAP TO TALK"}
          </span>
        </button>

        <p className="text-xs text-slate-500 font-medium mt-1.5 px-6 min-h-[18px] max-w-xs truncate">
          {currentTranscript
            ? ' + currentTranscript + '
            : isListening
            ? "কথা বলুন... NURA Ai আপনার নির্দেশ শুনছে"
            : isSpeaking
            ? "কথা থামাতে মাইক বা অর্বে ট্যাপ করুন"
            : "Microphone is muted • Tap mic to unmute"}
        </p>

        {/* Dual Control Badges: Speaker Status & Gemini API Status */}
        <div className="flex items-center gap-2 mt-1">
          {/* Speaker Button */}
          <button
            onClick={onToggleSpeaker}
            className={"flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer " + (
              isSpeakerActive
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
            )}
          >
            {isSpeakerActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>স্পিকার অন (ON)</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                <span>স্পিকার বন্ধ (OFF)</span>
              </>
            )}
          </button>

          {/* Gemini API Badge */}
          <div className="flex items-center gap-1 px-3 py-1 bg-white border border-purple-100 rounded-full text-[10px] font-bold text-slate-600 shadow-xs">
            <span>Gemini:</span>
            {hasCustomKey ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Connected
              </span>
            ) : (
              <span className="text-rose-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Disconnected
              </span>
            )}
          </div>
        </div>
      </div>

      {activeAction && (
        <div className="w-full px-4 my-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-3.5 shadow-lg shadow-purple-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {activeAction.type === "WHATSAPP" ? (
                <MessageCircle className="w-5 h-5 text-emerald-300" />
              ) : activeAction.type === "CALL" ? (
                <Phone className="w-5 h-5 text-amber-300" />
              ) : (
                <Sparkles className="w-5 h-5 text-purple-200" />
              )}
              <div className="text-xs">
                <div className="font-bold">Device Action Ready</div>
                <div className="text-[11px] text-purple-100 opacity-90">
                  {activeAction.type === "WHATSAPP"
                    ? "Open WhatsApp with drafted message"
                    : activeAction.type === "CALL"
                    ? "Dial number: " + (activeAction.data?.number || "Phone")
                    : "Action: " + activeAction.type}
                </div>
              </div>
            </div>
            <button
              onClick={() => onExecuteAction(activeAction)}
              className="px-3 py-1.5 bg-white text-purple-700 font-bold rounded-xl text-xs shadow-sm hover:bg-purple-50 flex items-center gap-1 cursor-pointer"
            >
              <span>Execute</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <div className="w-full px-4 mt-2">
        <WeatherCard
          weather={weather}
          onRefresh={onRefreshWeather}
          isLoading={isWeatherLoading}
        />
      </div>

      <div className="w-full px-4">
        <FeatureCards
          onOpenScreenVision={onOpenScreenVision}
          onOpenMemories={onOpenMemories}
          onOpenLanguageModal={onOpenLanguageModal}
          currentLanguage={currentLanguage}
          memoryCount={memoryCount}
        />
      </div>

      <div className="w-full px-4 mt-4 select-none">
        <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 flex items-center justify-between">
          <span>Quick Commands</span>
          <span className="text-purple-600 text-[10px]">Tap to ask</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            "তোমাকে কে বানিয়েছে?",
            "তোমার নাম কি?",
            "আজকের আবহাওয়া কেমন?",
            "আমার কী মনে রেখেছো?",
            "ইউটিউব ওপেন করো",
          ].map((prompt, index) => (
            <button
              key={index}
              onClick={() => onQuickPrompt(prompt)}
              className="text-xs px-3 py-1.5 bg-white/90 hover:bg-purple-50 text-slate-700 font-medium rounded-full border border-purple-100 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
