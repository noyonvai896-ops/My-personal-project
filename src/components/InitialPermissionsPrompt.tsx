import React, { useState } from 'react';
import { Shield, Mic, MapPin, Bell, CheckCircle2, Sparkles, X } from 'lucide-react';

interface InitialPermissionsPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionsGranted: () => void;
}

export const InitialPermissionsPrompt: React.FC<InitialPermissionsPromptProps> = ({
  isOpen,
  onClose,
  onPermissionsGranted,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [step, setStep] = useState<'prompt' | 'success'>('prompt');

  if (!isOpen) return null;

  const handleAllowAll = async () => {
    setIsRequesting(true);

    // 1. Microphone
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {
      console.warn('Mic permission error:', e);
    }

    // 2. Geolocation
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {},
          () => {},
          { timeout: 4000 }
        );
      }
    } catch (e) {}

    // 3. Notification
    try {
      if ('Notification' in window && Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }
    } catch (e) {}

    setIsRequesting(false);
    setStep('success');

    setTimeout(() => {
      onPermissionsGranted();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 text-center">
        {step === 'prompt' ? (
          <>
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#6342E8] to-[#915BFF] flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-purple-200">
              <Shield className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-slate-900 font-heading">
              সকল পারমিশন এলাউ করুন
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              NURA Ai যেন ভয়েস শুনতে, আবহাওয়া ট্র্যাক করতে ও লাইভ রেসপন্স দিতে পারে:
            </p>

            <div className="space-y-2 text-left mb-5">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                <Mic className="w-5 h-5 text-[#6342E8]" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">মাইক্রোফোন (Microphone):</span>
                  <div className="text-[10px] text-slate-500">ভয়েসে কথা বলা ও শোনার জন্য</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                <MapPin className="w-5 h-5 text-[#6342E8]" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">লাইভ লোকেশন (Location):</span>
                  <div className="text-[10px] text-slate-500">সঠিক আবহাওয়া ও বায়ুমণ্ডল তথ্যের জন্য</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                <Bell className="w-5 h-5 text-[#6342E8]" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">অ্যাসিস্ট্যান্ট নোটিফিকেশন:</span>
                  <div className="text-[10px] text-slate-500">জরুরি রিমাইন্ডার ও আপডেট পেতে</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleAllowAll}
              disabled={isRequesting}
              className="w-full py-3 bg-gradient-to-r from-[#6342E8] to-[#8E5BF5] hover:opacity-95 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRequesting ? 'পারমিশন গ্রহণ করা হচ্ছে...' : 'সবগুলো পারমিশন এলাউ করুন (Allow All)'}</span>
            </button>

            <button
              onClick={onClose}
              className="mt-2 text-slate-400 hover:text-slate-600 text-xs font-semibold py-1"
            >
              পরে করবো (Skip for now)
            </button>
          </>
        ) : (
          <div className="py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              সকল পারমিশন সফলভাবে অনুমোদিত!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              NURA Ai এখন সম্পূর্ণ সক্রিয়।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
