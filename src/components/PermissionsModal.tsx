import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mic,
  Sun,
  Bell,
  Settings,
  CheckSquare,
  MessageSquare,
  Smile,
  Circle,
  Bluetooth,
  BellOff,
  Palette,
  Check,
  Smartphone,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionsUpdated?: (allGranted: boolean) => void;
}

export interface AuthPermissionItem {
  id: string;
  title: string;
  status: "Action Required • Tap Grant" | "Not granted" | "Granted";
  description: string;
  icon: any;
  granted: boolean;
  intentAction?: string;
  isNative: boolean;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  onPermissionsUpdated,
}) => {
  const [permissions, setPermissions] = useState<AuthPermissionItem[]>(() => {
    const saved = localStorage.getItem("nura_authorizations_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "mic",
        title: "Microphone Access",
        status: "Action Required • Tap Grant",
        description: "Required for voice conversations, voice recognition, and real-time audio interaction with NURA AI.",
        icon: Mic,
        granted: false,
        isNative: true,
      },
      {
        id: "location",
        title: "Precise Location",
        status: "Action Required • Tap Grant",
        description: "Required to detect your exact city/locality and provide accurate real-time weather and temperature reports on Home screen.",
        icon: Sun,
        granted: false,
        isNative: true,
      },
      {
        id: "notifications",
        title: "Notifications",
        status: "Action Required • Tap Grant",
        description: "Required for reminders, schedule alerts, and continuous background voice service notifications.",
        icon: Bell,
        granted: false,
        isNative: true,
      },
      {
        id: "overlay",
        title: "Display Over Other Apps",
        status: "Action Required • Tap Grant",
        description: "Optional: Allows NURA AI floating bubble to appear anywhere on your phone for quick one-tap voice commands.",
        icon: Settings,
        granted: false,
        intentAction: "android.settings.action.MANAGE_OVERLAY_PERMISSION",
        isNative: false,
      },
      {
        id: "accessibility",
        title: "Accessibility Service",
        status: "Action Required • Tap Grant",
        description: "Essential for autonomous AI actions: allows NURA AI to tap buttons, search apps, type messages, and scroll hands-free on your screen.",
        icon: CheckSquare,
        granted: false,
        intentAction: "android.settings.ACCESSIBILITY_SETTINGS",
        isNative: false,
      },
      {
        id: "contacts",
        title: "Contacts",
        status: "Not granted",
        description: "Lets WhatsApp and calling features resolve saved contact names.",
        icon: MessageSquare,
        granted: false,
        intentAction: "android.settings.APPLICATION_DETAILS_SETTINGS",
        isNative: false,
      },
      {
        id: "calls",
        title: "Phone calls",
        status: "Not granted",
        description: "Needed only when you ask NURA AI to place a normal phone call.",
        icon: Smile,
        granted: false,
        intentAction: "android.settings.APPLICATION_DETAILS_SETTINGS",
        isNative: false,
      },
      {
        id: "camera",
        title: "Camera and flashlight",
        status: "Not granted",
        description: "Camera access is used only for the flashlight control.",
        icon: Circle,
        granted: false,
        isNative: true,
      },
      {
        id: "bluetooth",
        title: "Nearby Bluetooth devices",
        status: "Not granted",
        description: "Optional: allows NURA AI to detect and route audio to a connected headset.",
        icon: Bluetooth,
        granted: false,
        intentAction: "android.settings.BLUETOOTH_SETTINGS",
        isNative: false,
      },
      {
        id: "battery",
        title: "Background battery access",
        status: "Not granted",
        description: "Recommended on Android/Vivo devices so voice service and overlay can stay active in the background.",
        icon: BellOff,
        granted: false,
        intentAction: "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS",
        isNative: false,
      },
      {
        id: "system_settings",
        title: "Modify system settings",
        status: "Not granted",
        description: "Optional: lets NURA AI adjust screen brightness when you ask.",
        icon: Palette,
        granted: false,
        intentAction: "android.settings.APPLICATION_DETAILS_SETTINGS",
        isNative: false,
      },
    ];
  });

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("nura_authorizations_state", JSON.stringify(permissions));
  }, [permissions]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const openAndroidIntent = (intentAction?: string) => {
    const action = intentAction || "android.settings.APPLICATION_DETAILS_SETTINGS";
    try {
      window.location.href = "intent:#Intent;action=" + action + ";package=com.nuraai.app;end";
    } catch (e) {
      window.location.href = "app-settings:";
    }
  };

  // Real native phone permission handler
  const handleGrantSingle = async (item: AuthPermissionItem) => {
    let success = false;

    if (item.id === "mic") {
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          showNotification("ফোনের মাইক্রোফোন পারমিশন এলাউ করুন...");
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((t) => t.stop());
          success = true;
          localStorage.setItem("nura_mic_permitted", "true");
        }
      } catch (err: any) {
        showNotification("মাইক্রোফোন পারমিশন ডিনাই হয়েছে। ফোনের সেটিংস থেকে এলাউ করুন।");
        openAndroidIntent("android.settings.APPLICATION_DETAILS_SETTINGS");
        return;
      }
    } else if (item.id === "location") {
      try {
        if (navigator.geolocation) {
          showNotification("ফোনের লোকেশন পারমিশন এলাউ করুন...");
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 });
          });
          success = true;
        }
      } catch (err) {
        showNotification("লোকেশন পারমিশন ফোনের সেটিংস থেকে এলাউ করুন।");
        openAndroidIntent("android.settings.LOCATION_SOURCE_SETTINGS");
        return;
      }
    } else if (item.id === "notifications") {
      try {
        if ("Notification" in window) {
          showNotification("ফোনের নোটিফিকেশন এলাউ করুন...");
          const res = await Notification.requestPermission();
          if (res === "granted") success = true;
        }
      } catch (err) {}
    } else if (item.id === "camera") {
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          showNotification("ফোনের ক্যামেরা পারমিশন এলাউ করুন...");
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach((t) => t.stop());
          success = true;
        }
      } catch (err) {
        showNotification("ক্যামেরা পারমিশন সেটিংস থেকে এলাউ করুন।");
        openAndroidIntent("android.settings.APPLICATION_DETAILS_SETTINGS");
        return;
      }
    } else {
      // System Android settings: open directly on phone
      showNotification("ফোনের Settings ওপেন করা হচ্ছে...");
      openAndroidIntent(item.intentAction);
      success = true;
    }

    setPermissions((prev) =>
      prev.map((p) =>
        p.id === item.id
          ? {
              ...p,
              granted: true,
              status: "Granted",
            }
          : p
      )
    );

    if (success) {
      showNotification("✓ " + item.title + " সফলভাবে এলাউ হয়েছে!");
    }
  };

  // Real "Grant All Permissions" directly on user phone
  const handleGrantAll = async () => {
    showNotification("ফোনের সকল পারমিশন সরাসরি চাওয়া হচ্ছে...");

    // 1. Phone Microphone Real Request
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        s.getTracks().forEach((t) => t.stop());
        localStorage.setItem("nura_mic_permitted", "true");
      }
    } catch (e) {}

    // 2. Phone Notifications Real Request
    try {
      if ("Notification" in window && Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
    } catch (e) {}

    // 3. Phone Location Real Request
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
      }
    } catch (e) {}

    // 4. Phone Camera Real Request
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true });
        cam.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {}

    const updated = permissions.map((p) => ({
      ...p,
      granted: true,
      status: "Granted" as const,
    }));

    setPermissions(updated);
    localStorage.setItem("nura_authorizations_state", JSON.stringify(updated));
    localStorage.setItem("nura_permissions_handled", "true");
    localStorage.setItem("nura_mic_permitted", "true");

    if (onPermissionsUpdated) {
      onPermissionsUpdated(true);
    }

    // Now open Android System App Settings so user can enable Accessibility and Overlay
    setTimeout(() => {
      openAndroidIntent("android.settings.APPLICATION_DETAILS_SETTINGS");
    }, 800);

    showNotification("🎉 ফোনের পারমিশন রিকোয়েস্ট সম্পন্ন! সেটিংস পেইজ ওপেন করা হচ্ছে...");
  };

  const openAndroidSettings = () => {
    showNotification("ফোনের Settings ওপেন করা হচ্ছে...");
    openAndroidIntent("android.settings.APPLICATION_DETAILS_SETTINGS");
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F3FB] flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-3.5 bg-[#F6F3FB]/90 backdrop-blur-md sticky top-0 z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-2xl bg-white border border-purple-100 flex items-center justify-center text-slate-800 shadow-sm active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-purple-900" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            System Authorizations
          </h1>
          <p className="text-xs text-purple-900/60 font-medium">
            Permissions & Privacy Control
          </p>
        </div>
      </div>

      {toast && (
        <div className="mx-4 mb-2 p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl font-bold text-center animate-in fade-in shadow-xs">
          {toast}
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3.5 max-w-md mx-auto w-full">
        {/* Hero Card */}
        <div className="w-full bg-gradient-to-b from-[#E7E0FF]/60 via-[#F3EDFF]/60 to-white/80 rounded-3xl p-5 border border-purple-100/80 text-center shadow-xs">
          <div className="inline-block mb-1">
            <span className="text-2xl font-black bg-gradient-to-r from-[#8E5BF5] via-[#6342E8] to-[#3B82F6] bg-clip-text text-transparent font-heading">
              NURA Ai
            </span>
          </div>
          <h2 className="text-sm font-black text-slate-900">
            NURA AI • Neural Assistant
          </h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed px-2">
            Grant necessary authorizations so NURA AI can listen, speak, deliver accurate weather, and process your requests seamlessly.
          </p>
        </div>

        {/* Permissions List */}
        <div className="space-y-3">
          {permissions.map((item) => {
            const Icon = item.icon;
            const isGranted = item.granted;

            return (
              <div
                key={item.id}
                className="bg-white/90 backdrop-blur-xs rounded-3xl p-4 border border-purple-100/90 shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={"w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 " + (
                        isGranted
                          ? "bg-emerald-500 text-white"
                          : "bg-purple-50 text-[#6342E8]"
                      )}
                    >
                      {isGranted ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={"text-[11px] font-semibold " + (
                            isGranted
                              ? "text-emerald-600"
                              : "text-amber-600"
                          )}
                        >
                          {isGranted ? "Granted" : item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGrantSingle(item)}
                    className={"px-4 py-2 rounded-full font-bold text-xs shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 " + (
                      isGranted
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gradient-to-r from-[#6342E8] to-[#8E5BF5] text-white hover:opacity-95"
                    )}
                  >
                    {isGranted ? "GRANTED" : "Grant"}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed pl-1">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Note */}
        <p className="text-[10px] text-slate-500 leading-relaxed text-center px-4 py-2">
          Screen sharing uses Android one-time screen-capture confirmation when you start sharing. Internet, network, notifications, and foreground-service access are managed by Android.
        </p>

        {/* Bottom CTA Buttons */}
        <div className="space-y-2.5 pt-2 pb-6">
          <button
            onClick={handleGrantAll}
            className="w-full py-4 bg-gradient-to-r from-[#6342E8] to-[#7B46F6] text-white font-black text-sm tracking-wide rounded-full shadow-lg shadow-purple-300/60 hover:opacity-95 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 uppercase"
          >
            <span>GRANT ALL PERMISSIONS</span>
          </button>

          <button
            onClick={openAndroidSettings}
            className="w-full py-3.5 bg-white border border-[#6342E8] text-[#6342E8] font-black text-xs tracking-wide rounded-full shadow-xs hover:bg-purple-50/50 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-1.5 uppercase"
          >
            <span>OPEN SYSTEM APP SETTINGS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
