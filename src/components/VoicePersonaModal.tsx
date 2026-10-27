import React from "react";
import { User, Volume2, Sparkles, Check, X, Sliders, Baby, Heart, Shield, Radio } from "lucide-react";
import { VoicePersona } from "../types";

interface VoicePersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersona: VoicePersona;
  onSelectPersona: (persona: VoicePersona) => void;
  voiceSpeed: number;
  voicePitch: number;
  onChangeSpeed: (speed: number) => void;
  onChangePitch: (pitch: number) => void;
  onTestVoice: (persona: VoicePersona, sampleText: string) => void;
}

interface PersonaInfo {
  id: VoicePersona;
  name: string;
  category: string;
  gender: "female" | "male";
  description: string;
  sampleText: string;
  badge: string;
}

const PERSONAS: PersonaInfo[] = [
  {
    id: "female",
    name: "মায়া (মেয়ে কণ্ঠ)",
    category: "Young Adult Female",
    gender: "female",
    description: "মিষ্টি, স্বাভাবিক ও স্পষ্ট মানবী কণ্ঠ। দৈনন্দিন সকল কাজের জন্য সেরা।",
    sampleText: "আসসালামু আলাইকুম নয়ন ভাই! আমি মায়া, আপনার সার্বক্ষণিক সহকারী।",
    badge: "সবচেয়ে জনপ্রিয়",
  },
  {
    id: "male",
    name: "কবির (ছেলে কণ্ঠ)",
    category: "Adult Confident Male",
    gender: "male",
    description: "বলিষ্ঠ, আত্মবিশ্বাসী এবং গম্ভীর পুরুষ কণ্ঠ। কমান্ড শোনার জন্য চমৎকার।",
    sampleText: "হ্যালো স্যার! আমি কবির, আপনার ফোনের সকল কমান্ড কার্যকর করতে প্রস্তুত।",
    badge: "বলিষ্ঠ কণ্ঠ",
  },
  {
    id: "boy_child",
    name: "আবির (ছোট ছেলের কণ্ঠ)",
    category: "Little Boy / Child",
    gender: "male",
    description: "উচ্ছ্বসিত, চঞ্চল ও মিষ্টি ছোট ছেলের কণ্ঠ। শুনতে দারুণ মিষ্টি লাগে।",
    sampleText: "নয়ন ভাইয়া! আমি আবির, তোমার সাথে কথা বলতে আমার খুব ভালো লাগে!",
    badge: "ছোট ছেলে",
  },
  {
    id: "girl_child",
    name: "মাহি (ছোট মেয়ের কণ্ঠ)",
    category: "Little Girl / Child",
    gender: "female",
    description: "ফুটফুটে, নিষ্পাপ ও চঞ্চল ছোট মেয়ের কণ্ঠ। প্রাণবন্ত কথোপকথনের জন্য।",
    sampleText: "আসসালামু আলাইকুম ভাইয়া! আমি ছোট মাহি, বলো আমি কী করব?",
    badge: "ছোট মেয়ে",
  },
  {
    id: "elder",
    name: "দাদু (বয়স্ক প্রবীণ মুরুব্বি)",
    category: "Elderly Wise",
    gender: "male",
    description: "ধীরস্থির, অভিজ্ঞ, স্নেহশীল ও প্রবীণ মুরুব্বির মিষ্টি কণ্ঠ।",
    sampleText: "ভালো থেকো নয়ন দাদুভাই, তোমার দাদু তোমার সাথেই আছে।",
    badge: "মুরুব্বি কণ্ঠ",
  },
  {
    id: "sweet_lady",
    name: "শান্তি (মধুর শান্ত নারীকণ্ঠ)",
    category: "Melodic Gentle Lady",
    gender: "female",
    description: "অত্যন্ত মোলায়েম, শান্ত ও মধুর নারীকণ্ঠ। কানে মিষ্টি ও আরামদায়ক শোনায়।",
    sampleText: "শুভ দিন নয়ন ভাই। আপনার প্রতিটি দিন শান্তিময় কাটুক।",
    badge: "মধুর কণ্ঠ",
  },
  {
    id: "neural",
    name: "অরা (ফিউচারিস্টিক নিউরাল)",
    category: "AI Neural",
    gender: "female",
    description: "আধুনিক হাইপার-ইন্টেলিজেন্ট ডিজিটাল এআই অ্যাসিস্ট্যান্ট কণ্ঠ।",
    sampleText: "NURA AI কোর সিস্টেম সক্রিয়। পরবর্তী কমান্ডের জন্য অপেক্ষারত।",
    badge: "সাইবার এআই",
  },
];

export const VoicePersonaModal: React.FC<VoicePersonaModalProps> = ({
  isOpen,
  onClose,
  selectedPersona,
  onSelectPersona,
  voiceSpeed,
  voicePitch,
  onChangeSpeed,
  onChangePitch,
  onTestVoice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8] shadow-inner">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                AI Voice Persona (কণ্ঠ নির্বাচন)
              </h3>
              <p className="text-[10px] text-slate-500">
                এক কণ্ঠেই স্থায়ীভাবে কথা বলবে
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Persona List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1">
          {PERSONAS.map((item) => {
            const isSelected = selectedPersona === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectPersona(item.id)}
                className={"p-3 rounded-2xl border transition-all cursor-pointer " + (
                  isSelected
                    ? "bg-purple-50/70 border-purple-300 ring-2 ring-purple-400/30 shadow-xs"
                    : "bg-white border-slate-100 hover:border-purple-100 hover:bg-purple-50/20"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {item.name}
                      </span>
                      <span className={"text-[9px] px-1.5 py-0.2 rounded-md font-bold " + (
                        isSelected
                          ? "bg-[#6342E8] text-white"
                          : "bg-purple-100 text-[#6342E8]"
                      )}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPersona(item.id);
                        onTestVoice(item.id, item.sampleText);
                      }}
                      className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-[#6342E8] text-[10px] font-bold rounded-lg transition active:scale-95 flex items-center gap-1 cursor-pointer"
                      title="নমুনা শুনুন"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>টেস্ট</span>
                    </button>

                    <div
                      className={"w-5 h-5 rounded-full flex items-center justify-center " + (
                        isSelected
                          ? "bg-[#6342E8] text-white"
                          : "border border-slate-300 text-transparent"
                      )}
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sliders */}
        <div className="pt-2 border-t border-purple-50 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span>কণ্ঠের গতি (Speed): {voiceSpeed.toFixed(1)}x</span>
            <input
              type="range"
              min="0.7"
              max="1.4"
              step="0.05"
              value={voiceSpeed}
              onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
              className="w-28 accent-[#6342E8] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span>কণ্ঠের তীক্ষ্ণতা (Pitch): {voicePitch.toFixed(1)}</span>
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.05"
              value={voicePitch}
              onChange={(e) => onChangePitch(parseFloat(e.target.value))}
              className="w-28 accent-[#6342E8] cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-purple-50 mt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#6342E8] text-white rounded-xl font-bold text-xs hover:opacity-95 cursor-pointer shadow-md shadow-purple-200 transition"
          >
            এই কণ্ঠটি সংরক্ষণ করুন (Save Voice)
          </button>
        </div>
      </div>
    </div>
  );
};
