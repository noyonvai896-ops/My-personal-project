import React from "react";
import { Home, MessageSquare, Mic, MicOff, Settings, Bell } from "lucide-react";

interface BottomNavBarProps {
  activeTab: "home" | "chat" | "settings" | "updates";
  onChangeTab: (tab: "home" | "chat" | "settings" | "updates") => void;
  isListening: boolean;
  onMicToggle: () => void;
  hasUpdateNotification?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  isListening,
  onMicToggle,
  hasUpdateNotification = true,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center pointer-events-none">
      {/* Floating Curved Bar */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-purple-100/70 shadow-[0_-8px_30px_rgba(122,88,230,0.08)] px-4 py-2 pointer-events-auto rounded-t-3xl flex items-center justify-between select-none">
        {/* 1. Home */}
        <button
          onClick={() => onChangeTab("home")}
          className={"flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer " + (
            activeTab === "home" ? "text-[#6342E8]" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div className={"p-1.5 rounded-xl transition-all " + (activeTab === "home" ? "bg-purple-50" : "")}>
            <Home className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[11px] font-bold mt-0.5">Home</span>
        </button>

        {/* 2. Chat */}
        <button
          onClick={() => onChangeTab("chat")}
          className={"flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer " + (
            activeTab === "chat" ? "text-[#6342E8]" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div className={"p-1.5 rounded-xl transition-all " + (activeTab === "chat" ? "bg-purple-50" : "")}>
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[11px] font-bold mt-0.5">Chat</span>
        </button>

        {/* 3. Center Floating Mic Button: RED with MicOff & cross when off, Purple with Mic when on */}
        <div className="relative flex-1 flex justify-center -top-3">
          <button
            onClick={onMicToggle}
            className={"w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 active:scale-90 cursor-pointer " + (
              isListening
                ? "bg-gradient-to-tr from-[#6342E8] to-[#8E5BF5] text-white shadow-purple-300/90 ring-4 ring-white animate-pulse"
                : "bg-gradient-to-tr from-rose-500 via-red-500 to-red-600 text-white shadow-lg shadow-red-300 ring-4 ring-white"
            )}
            title={isListening ? "Mike on • কথা শুনছে (ট্যাপ করে বন্ধ করুন)" : "Mike mute off • বন্ধ আছে (ট্যাপ করে অন করুন)"}
          >
            {isListening ? (
              <Mic className="w-6 h-6 animate-pulse" />
            ) : (
              <div className="relative flex items-center justify-center">
                <MicOff className="w-6 h-6 stroke-[2.4]" />
              </div>
            )}
          </button>
        </div>

        {/* 4. Settings */}
        <button
          onClick={() => onChangeTab("settings")}
          className={"flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer " + (
            activeTab === "settings" ? "text-[#6342E8]" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div className={"p-1.5 rounded-xl transition-all " + (activeTab === "settings" ? "bg-purple-50" : "")}>
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold mt-0.5">Settings</span>
        </button>

        {/* 5. Updates */}
        <button
          onClick={() => onChangeTab("updates")}
          className={"flex flex-col items-center justify-center flex-1 py-1 transition-all relative cursor-pointer " + (
            activeTab === "updates" ? "text-[#6342E8]" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div className={"p-1.5 rounded-xl transition-all relative " + (activeTab === "updates" ? "bg-purple-50" : "")}>
            <Bell className="w-5 h-5" />
            {hasUpdateNotification && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </div>
          <span className="text-[11px] font-bold mt-0.5">Updates</span>
        </button>
      </div>

      {/* Android Home indicator bar */}
      <div className="w-full max-w-md bg-white pb-2 flex justify-center pointer-events-auto">
        <div className="w-28 h-1 bg-slate-300 rounded-full" />
      </div>
    </div>
  );
};
