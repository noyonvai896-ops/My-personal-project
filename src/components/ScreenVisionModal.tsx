import React, { useState, useRef } from 'react';
import { Tv, Camera, Upload, Sparkles, X, RefreshCw } from 'lucide-react';

interface ScreenVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeScreen: (imageBase64: string, prompt: string) => void;
  isProcessing: boolean;
}

export const ScreenVisionModal: React.FC<ScreenVisionModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeScreen,
  isProcessing,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [promptText, setPromptText] = useState('অনুগ্রহ করে এই স্ক্রিনশটটি বিস্তারিত ব্যাখ্যা করুন এবং প্রয়োজনীয় তথ্য দিন।');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle Display Media (Screen Capture)
  const handleCaptureScreen = async () => {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        alert('Screen capture is not supported directly in this browser. Please use the Upload Image button.');
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const imageCapture = new (window as any).ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();
      
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(bitmap, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      track.stop();
      stream.getTracks().forEach((t) => t.stop());

      setPreviewImage(dataUrl);
    } catch (e) {
      console.warn('Screen capture cancelled or error:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!previewImage || isProcessing) return;
    onAnalyzeScreen(previewImage, promptText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Screen Vision & Analysis
              </h3>
              <p className="text-[10px] text-slate-500">
                Powered by Gemini Multimodal Vision
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="py-4 space-y-3 flex-1 overflow-y-auto text-xs">
          {previewImage ? (
            <div className="relative rounded-2xl overflow-hidden border border-purple-200 shadow-sm max-h-56 bg-slate-100">
              <img
                src={previewImage}
                alt="Captured Screen"
                className="w-full h-auto object-contain"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[10px] font-bold rounded-lg backdrop-blur-sm"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleCaptureScreen}
                className="flex flex-col items-center justify-center p-4 bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 rounded-2xl text-center transition cursor-pointer"
              >
                <Tv className="w-6 h-6 text-[#6342E8] mb-1.5" />
                <span className="font-bold text-slate-800 text-xs">Capture Screen</span>
                <span className="text-[10px] text-slate-500">Live display share</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-4 bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 rounded-2xl text-center transition cursor-pointer"
              >
                <Upload className="w-6 h-6 text-[#6342E8] mb-1.5" />
                <span className="font-bold text-slate-800 text-xs">Upload Image</span>
                <span className="text-[10px] text-slate-500">From gallery/phone</span>
              </button>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Instructions for NURA Ai:
            </label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={2}
              placeholder="What do you want NURA to analyze?"
              className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6342E8]"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-purple-50">
          <button
            onClick={handleSubmit}
            disabled={!previewImage || isProcessing}
            className="w-full py-2.5 bg-gradient-to-r from-[#6342E8] to-[#8E5BF5] disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze with NURA Ai</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
