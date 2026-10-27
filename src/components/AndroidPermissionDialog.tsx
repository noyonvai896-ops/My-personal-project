import React from "react";
import { Mic } from "lucide-react";

interface AndroidPermissionDialogProps {
  isOpen: boolean;
  onGrant: (mode: "always" | "once") => void;
  onDeny: () => void;
}

export const AndroidPermissionDialog: React.FC<AndroidPermissionDialogProps> = ({
  isOpen,
  onGrant,
  onDeny,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4">
      <div className="w-full max-w-sm bg-[#222429] text-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-white/10 animate-in slide-in-from-bottom-6 duration-200 text-center select-none">
        {/* Green Mic Icon */}
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
          <Mic className="w-7 h-7 stroke-[2.2]" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-normal text-white mb-6">
          Allow <strong className="font-bold">NURA AI</strong> to record audio?
        </h3>

        {/* Action Options in Android green */}
        <div className="space-y-4 text-emerald-400 text-base font-medium">
          <button
            onClick={() => onGrant("always")}
            className="w-full py-2.5 hover:bg-white/5 active:bg-white/10 rounded-xl transition cursor-pointer"
          >
            While using the app
          </button>

          <button
            onClick={() => onGrant("once")}
            className="w-full py-2.5 hover:bg-white/5 active:bg-white/10 rounded-xl transition cursor-pointer"
          >
            Only this time
          </button>

          <button
            onClick={onDeny}
            className="w-full py-2.5 hover:bg-white/5 active:bg-white/10 rounded-xl transition cursor-pointer"
          >
            Don’t allow
          </button>
        </div>
      </div>
    </div>
  );
};
