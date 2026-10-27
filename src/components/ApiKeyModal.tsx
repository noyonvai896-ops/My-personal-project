import React, { useState } from "react";
import { Key, CheckCircle2, AlertCircle, ExternalLink, X, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSaveKey: (key: string) => void;
  serverHasKey: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  onSaveKey,
  serverHasKey,
}) => {
  const [apiKey, setApiKey] = useState(currentKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const isConnected = Boolean(currentKey && currentKey.trim().length > 10);

  const handleTestAndSave = async () => {
    if (!apiKey.trim()) {
      onSaveKey("");
      setTestResult({
        success: false,
        message: "এপিআই কী মুছে ফেলা হয়েছে। বর্তমানে ডিসকানেক্ট অবস্থায় রয়েছে।",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        onSaveKey(apiKey.trim());
        setTestResult({
          success: true,
          message: "🎉 অভিনন্দন! Gemini API Key সফলভাবে কানেক্ট হয়েছে (Connected)।",
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || "এপিআই কি সঠিক নয়। অনুগ্রহ করে আবার চেক করুন।",
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    setApiKey("");
    onSaveKey("");
    setTestResult({
      success: false,
      message: "Gemini API Key ডিসকানেক্ট করা হয়েছে।",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center text-[#6342E8] shadow-inner">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Gemini Live API Key
              </h3>
              <p className="text-[10px] text-slate-500">
                উন্মুক্ত জ্ঞানভাণ্ডার ও গভীর বুদ্ধিমত্তা
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

        <div className="mt-3 mb-2 p-2.5 rounded-2xl border flex items-center justify-between bg-slate-50/70 border-slate-200">
          <div className="text-xs font-bold text-slate-700">
            সংযোগ অবস্থা:
          </div>
          {isConnected ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>🟢 CONNECTED (কানেক্টেড)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-[11px] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>🔴 DISCONNECTED (ডিসকানেক্ট)</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
          Gemini API Key কানেক্ট করলে NURA Ai পুরো বিশ্বের যে কোনো উন্মুক্ত প্রশ্নের উত্তর দিতে পারবে।
        </p>

        <div className="space-y-1.5 mb-3">
          <label className="text-[11px] font-bold text-slate-700">
            আপনার Gemini API Key পেস্ট করুন:
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2.5 text-xs font-mono bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6342E8] text-slate-800"
          />
        </div>

        {testResult && (
          <div
            className={"p-2.5 rounded-xl text-xs mb-3 flex items-start gap-2 " + (testResult.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200")}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            )}
            <span className="text-[11px] leading-tight font-medium">
              {testResult.message}
            </span>
          </div>
        )}

        <div className="mb-4">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-[#6342E8] hover:underline flex items-center gap-1 font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google AI Studio থেকে ফ্রি API Key নিন</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>

        <div className="flex gap-2">
          {isConnected && (
            <button
              onClick={handleDisconnect}
              className="py-2.5 px-3 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              ডিসকানেক্ট
            </button>
          )}

          <button
            onClick={handleTestAndSave}
            disabled={isTesting}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#6342E8] to-[#8E5BF5] hover:opacity-95 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-200 cursor-pointer disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>কানেক্ট হচ্ছে...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>কানেক্ট ও সেভ করুন (Connect)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
