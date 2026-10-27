import React, { useState } from 'react';
import {
  Sparkles,
  Mic,
  Key,
  Database,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Download,
  Lightbulb
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiKeyModal: () => void;
  onOpenMemoriesModal: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onOpenApiKeyModal,
  onOpenMemoriesModal,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [testOrbActive, setTestOrbActive] = useState(false);
  const [sampleMemory, setSampleMemory] = useState('');
  const [memorySaved, setMemorySaved] = useState(false);

  if (!isOpen) return null;

  const steps = [
    // Step 0: Welcome
    {
      title: 'Welcome to NURA Ai',
      subtitle: 'Your Personal Intelligent Voice & Phone Assistant',
      badge: 'OVERVIEW',
      content: (
        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 text-purple-900">
            <h4 className="font-bold text-sm text-[#6342E8] mb-1">
              Developed by Nafiz Fuad Noyon
            </h4>
            <p className="leading-relaxed">
              NURA Ai is designed with a modern pastel lavender aesthetic, conversational voice interactions, Neural Memory Bank, and phone automation tools.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-3 bg-white rounded-xl border border-purple-100">
              <div className="text-purple-600 font-bold mb-1 flex items-center gap-1">
                <Mic className="w-3.5 h-3.5" /> Voice Control
              </div>
              <p className="text-[11px] text-slate-500">বাংলা ও ইংরেজিতে সম্পূর্ণ কথা বলা ও শোনা।</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-purple-100">
              <div className="text-purple-600 font-bold mb-1 flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> Memory Bank
              </div>
              <p className="text-[11px] text-slate-500">আপনার ব্যক্তিগত তথ্য আজীবনের জন্য মনে রাখা।</p>
            </div>
          </div>
        </div>
      ),
    },

    // Step 1: Voice Commands & Neural Orb
    {
      title: 'Voice Assistant & Neural Orb',
      subtitle: 'Interactive Speech & Holographic Orb Control',
      badge: 'VOICE COMMANDS',
      content: (
        <div className="space-y-3.5 text-xs text-slate-600">
          <p>
            স্ক্রিনের মাঝখানের <strong>থ্রি-ডি স্ফিয়ার (Orb)</strong> বা নিচের <strong>মাইক্রোফোন বাটনে</strong> ট্যাপ করে সরাসরি কথা বলুন।
          </p>

          {/* Interactive Mini Practice Orb */}
          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex flex-col items-center text-center">
            <div className="text-[11px] font-bold text-purple-700 mb-2">
              Practice Orb (ট্যাপ করে টেস্ট করুন):
            </div>
            <button
              onClick={() => setTestOrbActive(!testOrbActive)}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                testOrbActive
                  ? 'bg-rose-500 text-white scale-110 shadow-rose-300 ring-4 ring-rose-200 animate-pulse'
                  : 'bg-gradient-to-tr from-[#6342E8] to-[#915BFF] text-white shadow-purple-300'
              }`}
            >
              <Mic className="w-8 h-8" />
            </button>
            <span className="text-[10px] font-semibold text-slate-500 mt-2">
              {testOrbActive ? '● Listening simulated! Tap again to mute' : 'Tap to test pulse'}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-purple-100 text-left">
            <div className="font-bold text-slate-800 mb-1">উদাহরণ কমান্ডসমূহ:</div>
            <ul className="space-y-1 text-[11px] text-slate-600 list-disc pl-4">
              <li>"আমার নাম নাফিজ ফুয়াদ নয়ন, মনে রাখো"</li>
              <li>"আজকের আবহাওয়া কেমন?"</li>
              <li>"WhatsApp-এ শুভ সকাল মেসেজ পাঠাও"</li>
              <li>"Can you explain how black holes work?"</li>
            </ul>
          </div>
        </div>
      ),
    },

    // Step 2: Gemini API Key Setup
    {
      title: 'Gemini API Key Setup',
      subtitle: 'Connecting the High-Performance AI Engine',
      badge: 'INTELLIGENCE KEY',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            NURA Ai সার্ভার এবং আপনার ব্যক্তিগত কী উভয় পদ্ধতিতেই চলে। আপনার নিজস্ব কী যুক্ত করতে নিচের ৪টি সহজ ধাপ অনুসরণ করুন:
          </p>

          <div className="space-y-2 text-left">
            <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-purple-100">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-[#6342E8] flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
              <div>
                <strong className="text-slate-800">গুগল এআই স্টুডিওতে যান:</strong>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 underline font-semibold flex items-center gap-1 mt-0.5"
                >
                  Get Free Gemini API Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-purple-100">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-[#6342E8] flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
              <div>
                <strong className="text-slate-800">"Create API key" বাটনে ক্লিক করুন</strong>
                <p className="text-[11px] text-slate-500">আপনার জিমেইল একাউন্ট দিয়ে একটি ফ্রি API Key পাবেন।</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-purple-100">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-[#6342E8] flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
              <div>
                <strong className="text-slate-800">Settings এ গিয়ে কী সেভ করুন:</strong>
                <p className="text-[11px] text-slate-500">Settings {'>'} "Gemini Live API & Model"-এ পেস্ট করুন।</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenApiKeyModal();
            }}
            className="w-full py-2 bg-gradient-to-r from-[#6342E8] to-[#8E5BF5] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" /> Open API Key Setting Now
          </button>
        </div>
      ),
    },

    // Step 3: Neural Memory Bank
    {
      title: 'Neural Memory Bank',
      subtitle: 'Long-term Recall & Personalized Knowledge',
      badge: 'MEMORY CORE',
      content: (
        <div className="space-y-3.5 text-xs text-slate-600">
          <p>
            NURA Ai আপনার বলা গুরুত্বপূর্ণ তথ্য ভুলে যায় না। এটি আপনার ডিভাইসের লোকাল স্টোরেজে সুরক্ষিতভাবে সংরক্ষিত থাকে।
          </p>

          <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1 text-[#6342E8]">
              <Database className="w-4 h-4" /> Try Memory Simulation:
            </div>
            <div className="flex gap-1.5 mt-2">
              <input
                type="text"
                value={sampleMemory}
                onChange={(e) => setSampleMemory(e.target.value)}
                placeholder="e.g. আমার জন্মদিন ১৫ অক্টোবর"
                className="flex-1 text-xs border border-purple-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800"
              />
              <button
                onClick={() => {
                  if (sampleMemory.trim()) {
                    setMemorySaved(true);
                  }
                }}
                className="px-3 py-1.5 bg-[#6342E8] text-white rounded-lg font-bold text-xs"
              >
                Save
              </button>
            </div>
            {memorySaved && (
              <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Memory saved to Neural Bank!
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenMemoriesModal();
            }}
            className="w-full py-2 bg-white border border-purple-200 text-[#6342E8] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-purple-50 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" /> View Saved Memories
          </button>
        </div>
      ),
    },

    // Step 4: Phone Automation & Hands-Free
    {
      title: 'Phone Automation & Tools',
      subtitle: 'WhatsApp, Calling, Screen Vision, & Weather',
      badge: 'AUTOMATION',
      content: (
        <div className="space-y-3 text-xs text-slate-600 text-left">
          <div className="p-3 bg-white rounded-2xl border border-purple-100 space-y-2">
            <div className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">WhatsApp Messaging:</strong>
                <p className="text-[11px] text-slate-500">
                  "WhatsApp-এ মেসেজ পাঠাও" বললে NURA সরাসরি মেসেজ প্রস্তুত করে সেন্ড উইন্ডো খুলে দেবে।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#6342E8] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Screen Sharing / Vision:</strong>
                <p className="text-[11px] text-slate-500">
                  "Screen" বাটনে চাপ দিয়ে যেকোনো স্ক্রিনশট বা ক্যামেরা ফটো আপলোড করে তাৎক্ষণিক সমাধান বা অনুবাদ পান।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Live Weather:</strong>
                <p className="text-[11px] text-slate-500">
                  হোম স্ক্রিনের ওয়েদার কার্ডে ট্যাপ করে আপনার বর্তমান এলাকার লাইভ তাপমাত্রা ও আবহাওয়া আপডেট করুন।
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Step 5: Mobile App Installation (PWA)
    {
      title: 'Install on Your Phone',
      subtitle: 'Download and run like an Android APK App',
      badge: 'APP INSTALL',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-left space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[#6342E8]" /> How to install on Mobile:
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div>
                <strong>Android (Chrome):</strong> ব্রাউজারের উপরে বা নিচে আসা <span className="text-[#6342E8] font-bold">"Install App"</span> বা ৩-ডট মেনু থেকে <strong>"Add to Home screen"</strong> চাপুন।
              </div>
              <div>
                <strong>iOS (Safari):</strong> নিচে থাকা <strong>Share (শেয়ার)</strong> আইকন {'>'} <strong>"Add to Home Screen"</strong> চাপুন।
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] font-semibold text-purple-700">
            এর ফলে অ্যাপটি সরাসরি আপনার ফোনের হোম স্ক্রিনে ইনস্টল হয়ে যাবে এবং কোনো ব্রাউজার বার ছাড়া ফুলস্ক্রিনে চলবে!
          </p>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-purple-50">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 bg-purple-100 text-[#6342E8] rounded-md">
              {currentStepData.badge}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="py-3 text-center">
          <h3 className="text-base font-extrabold text-slate-900 font-heading">
            {currentStepData.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentStepData.subtitle}
          </p>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-1">
          {currentStepData.content}
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 py-3">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentStep === i ? 'w-6 bg-[#6342E8]' : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-50">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              currentStep === 0
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'text-slate-700 hover:bg-slate-100 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="px-4 py-2 bg-[#6342E8] hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-[#6342E8] to-[#8E5BF5] text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
            >
              Get Started with NURA
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
