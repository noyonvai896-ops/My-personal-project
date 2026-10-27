import React, { useState } from 'react';
import { Smartphone, MessageCircle, Phone, Youtube, Search, Timer, X, Send, Play } from 'lucide-react';

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutomationModal: React.FC<AutomationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [waNumber, setWaNumber] = useState('');
  const [waText, setWaText] = useState('নমস্কার! NURA Ai-এর মাধ্যমে মেসেজ পাঠানো হচ্ছে।');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ytQuery, setYtQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleSendWhatsApp = () => {
    const cleanNum = waNumber.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(waText);
    const url = cleanNum ? `https://wa.me/${cleanNum}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleYouTube = () => {
    if (ytQuery) {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(ytQuery)}`, '_blank');
    }
  };

  const handleGoogle = () => {
    if (searchQuery) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                App Control & Hands-Free
              </h3>
              <p className="text-[10px] text-slate-500">
                ফোন অটোমেশন ও শর্টকাট হাব
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

        <div className="py-3 space-y-3.5 overflow-y-auto flex-1 text-xs">
          {/* 1. WhatsApp Launcher */}
          <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Voice Messenger</span>
            </div>
            <input
              type="text"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="ফোন নম্বর (ঐচ্ছিক, e.g. 88017...)"
              className="w-full p-2 bg-white rounded-xl border border-emerald-200 text-slate-800 text-[11px]"
            />
            <input
              type="text"
              value={waText}
              onChange={(e) => setWaText(e.target.value)}
              placeholder="মেসেজ লিখুন..."
              className="w-full p-2 bg-white rounded-xl border border-emerald-200 text-slate-800 text-[11px]"
            />
            <button
              onClick={handleSendWhatsApp}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
            >
              <Send className="w-3.5 h-3.5" /> WhatsApp-এ ওপেন করুন
            </button>
          </div>

          {/* 2. Direct Phone Dialer */}
          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-800">
              <Phone className="w-4 h-4" />
              <span>Phone Call Dialer</span>
            </div>
            <div className="flex gap-1.5">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="ফোন নম্বর লিখুন (e.g. 0171...)"
                className="flex-1 p-2 bg-white rounded-xl border border-blue-200 text-slate-800 text-[11px]"
              />
              <button
                onClick={handleCall}
                disabled={!phoneNumber}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition"
              >
                Call
              </button>
            </div>
          </div>

          {/* 3. YouTube Search */}
          <div className="p-3 bg-red-50/70 rounded-2xl border border-red-100 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-red-800">
              <Youtube className="w-4 h-4" />
              <span>YouTube Quick Play</span>
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={ytQuery}
                onChange={(e) => setYtQuery(e.target.value)}
                placeholder="গান বা ভিডিও খুঁজুন..."
                className="flex-1 p-2 bg-white rounded-xl border border-red-200 text-slate-800 text-[11px]"
              />
              <button
                onClick={handleYouTube}
                disabled={!ytQuery}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Play
              </button>
            </div>
          </div>

          {/* 4. Google Search */}
          <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#6342E8]">
              <Search className="w-4 h-4" />
              <span>Google Web Intelligence</span>
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="গুগল অনুসন্ধান..."
                className="flex-1 p-2 bg-white rounded-xl border border-purple-200 text-slate-800 text-[11px]"
              />
              <button
                onClick={handleGoogle}
                disabled={!searchQuery}
                className="px-3 py-1.5 bg-[#6342E8] hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#6342E8] text-white rounded-xl font-bold text-xs hover:opacity-95 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
