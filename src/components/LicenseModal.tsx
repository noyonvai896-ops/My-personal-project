import React, { useState } from 'react';
import { ShieldCheck, Key, CheckCircle2, Copy, Check, X, Sparkles } from 'lucide-react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  licenseKey: string;
  onSaveLicenseKey: (key: string) => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({
  isOpen,
  onClose,
  licenseKey,
  onSaveLicenseKey,
}) => {
  const [key, setKey] = useState(licenseKey || 'NURA-PRO-NOYON-2026-UNLIMITED');
  const [copied, setCopied] = useState(false);
  const [activated, setActivated] = useState(true);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveLicenseKey(key);
    setActivated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                NURA Master License
              </h3>
              <p className="text-[10px] text-slate-500">
                Personal Master Activation
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

        <div className="py-4 space-y-3.5 text-xs">
          {/* Active Banner */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-emerald-900 text-xs">
                Permanent Master Edition Active
              </div>
              <div className="text-[10px] text-emerald-700">
                Developed for Nafiz Fuad Noyon • No Limits
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Master License Key:
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="flex-1 font-mono text-[11px] p-2 rounded-xl border border-purple-200 bg-purple-50/40 text-slate-800"
              />
              <button
                onClick={handleCopy}
                className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 font-bold"
                title="Copy Key"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1 text-[11px] text-slate-600">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#6342E8]" /> Unlocked Capabilities:
            </div>
            <div>✓ Voice Recognition & Multi-Language Synthesis</div>
            <div>✓ Neural Memory Bank (Unlimited Long-Term Recall)</div>
            <div>✓ WhatsApp & Phone Automation Handlers</div>
            <div>✓ Screen & Vision Multimodal AI Analysis</div>
            <div>✓ Offline PWA Mobile Installation</div>
          </div>
        </div>

        <button
          onClick={() => {
            handleSave();
            onClose();
          }}
          className="w-full py-2.5 bg-[#6342E8] text-white rounded-xl font-bold text-xs hover:opacity-95 cursor-pointer"
        >
          Active & Verified (Done)
        </button>
      </div>
    </div>
  );
};
