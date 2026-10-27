/**
 * @license
 * NURA Ai - Neural Voice & Phone Assistant
 * Exclusively Developed by Nafiz Fuad Noyon (noyonvai896@gmail.com)
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { ChatScreen } from "./components/ChatScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { UpdatesScreen } from "./components/UpdatesScreen";
import { BottomNavBar } from "./components/BottomNavBar";
import { TutorialModal } from "./components/TutorialModal";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { MemoryBankModal } from "./components/MemoryBankModal";
import { ScreenVisionModal } from "./components/ScreenVisionModal";
import { PermissionsModal } from "./components/PermissionsModal";
import { LanguageModal } from "./components/LanguageModal";
import { VoicePersonaModal } from "./components/VoicePersonaModal";
import { AccountModal } from "./components/AccountModal";
import { LicenseModal } from "./components/LicenseModal";
import { OverlayAvatarModal } from "./components/OverlayAvatarModal";
import { AutomationModal } from "./components/AutomationModal";
import { AndroidPermissionDialog } from "./components/AndroidPermissionDialog";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";
import { usePWAInstall } from "./hooks/usePWAInstall";
import { evaluateNuraResponse } from "./services/localBrain";
import { Message, AssistantAction, WeatherInfo, UserProfile, ServerStatus, VoicePersona } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "chat" | "settings" | "updates">("home");

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("nura_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: "Noyon",
      title: "NURA AI OPERATOR • PRIMARY USER",
      preferredLanguage: "auto",
      voicePersona: "female",
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      silentExecution: false,
      avatarSeed: "cute_island",
      theme: "lavender",
      permissionsGranted: false,
      licenseKey: "NURA-PRO-NOYON-2026-UNLIMITED",
      isLicensed: true,
    };
  });

  // Custom Gemini Key
  const [customKey, setCustomKey] = useState<string>(() => {
    return localStorage.getItem("nura_gemini_key") || "";
  });

  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);

  // Permanent Neural Memory Bank
  const [memories, setMemories] = useState<string[]>(() => {
    const saved = localStorage.getItem("nura_memories");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      "User name is Noyon (Nafiz Fuad Noyon).",
      "Creator and developer of NURA Ai is Nafiz Fuad Noyon.",
      "User prefers polite, warm, and natural voice answers.",
      "NURA Ai is operating under Master Unlimited license.",
    ];
  });

  // Chat History
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("nura_chat_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "welcome",
        role: "model",
        text: "আসসালামু আলাইকুম Noyon ভাই! আমি NURA Ai। কথা বলতে নিচে লাল মাইক বাটনে ক্লিক করে পারমিশন দিন।",
        timestamp: Date.now(),
      },
    ];
  });

  // Weather State
  const [weather, setWeather] = useState<WeatherInfo>({
    temperature: 28,
    condition: "Sunny",
    location: "Dhaka",
    humidity: 62,
    isLive: true,
  });
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Active Action & Processing
  const [activeAction, setActiveAction] = useState<AssistantAction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Speaker state: STRICTLY OFF BY DEFAULT (Muted)
  const [isSpeakerActive, setIsSpeakerActive] = useState(false);

  // Mic state: STRICTLY OFF BY DEFAULT
  const [isMicActive, setIsMicActive] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean>(() => {
    return localStorage.getItem("nura_mic_permitted") === "true";
  });
  const [isAndroidPermissionOpen, setIsAndroidPermissionOpen] = useState(false);

  // Modals state
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isMemoriesModalOpen, setIsMemoriesModalOpen] = useState(false);
  const [isScreenVisionModalOpen, setIsScreenVisionModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(() => {
    return !localStorage.getItem("nura_tutorial_seen");
  });

  const { isInstallable, install } = usePWAInstall();

  // Browser Speech Synthesis Hook (Fallback with strictly locked single persona)
  const { speak: fallbackSpeak, stop: stopBrowserSpeech, isSpeaking: isBrowserSpeaking } = useSpeechSynthesis({
    rate: userProfile.voiceSpeed,
    pitch: userProfile.voicePitch,
    silent: !isSpeakerActive || userProfile.silentExecution,
    persona: userProfile.voicePersona,
    language: userProfile.preferredLanguage,
  });

  const isSpeakingCombined = isAudioPlaying || isBrowserSpeaking;

  // Realistic Human Voice Player (Consistent with userProfile.voicePersona ONLY)
  const speakWithRealisticVoice = useCallback(
    async (text: string, personaOverride?: VoicePersona) => {
      // If speaker is OFF or silent mode is on, DO NOT vocalize!
      if (!isSpeakerActive || userProfile.silentExecution || !text.trim()) return;

      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      stopBrowserSpeech();

      // ALWAYS lock strictly to userProfile.voicePersona to prevent gender/voice switching
      const activePersona = personaOverride || userProfile.voicePersona;

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            persona: activePersona,
            customKey,
          }),
        });

        const data = await response.json();
        if (response.ok && data.audioBase64) {
          const audio = new Audio("data:audio/wav;base64," + data.audioBase64);
          currentAudioRef.current = audio;
          audio.onplay = () => setIsAudioPlaying(true);
          audio.onended = () => {
            setIsAudioPlaying(false);
            currentAudioRef.current = null;
          };
          audio.onerror = () => {
            setIsAudioPlaying(false);
            currentAudioRef.current = null;
            fallbackSpeak(text, activePersona);
          };
          await audio.play();
          return;
        }
      } catch (e) {
        console.warn("Realistic TTS fallback:", e);
      }

      fallbackSpeak(text, activePersona);
    },
    [isSpeakerActive, userProfile.silentExecution, userProfile.voicePersona, customKey, stopBrowserSpeech, fallbackSpeak]
  );

  const stopAllSpeech = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsAudioPlaying(false);
    stopBrowserSpeech();
  }, [stopBrowserSpeech]);

  // Speaker toggle button handler
  const handleToggleSpeaker = useCallback(() => {
    if (isSpeakerActive) {
      // Turn speaker OFF (Muted)
      setIsSpeakerActive(false);
      stopAllSpeech();
    } else {
      // Turn speaker ON
      setIsSpeakerActive(true);
      // Announce in locked voice persona
      setTimeout(() => {
        speakWithRealisticVoice("স্পিকার চালু করা হয়েছে।");
      }, 100);
    }
  }, [isSpeakerActive, stopAllSpeech, speakWithRealisticVoice]);

  // Execute Phone Automation Actions
  const handleExecuteAction = useCallback((action: AssistantAction) => {
    if (action.type === "WHATSAPP") {
      const text = encodeURIComponent(action.data?.text || "Hello from NURA Ai");
      const phone = action.data?.recipient ? action.data.recipient.replace(/[^0-9]/g, "") : "";
      const url = phone ? "https://wa.me/" + phone + "?text=" + text : "https://wa.me/?text=" + text;
      window.open(url, "_blank");
    } else if (action.type === "CALL") {
      const number = action.data?.number || "";
      window.location.href = "tel:" + number;
    } else if (action.type === "OPEN_URL" && action.data?.url) {
      window.open(action.data.url, "_blank");
    } else if (action.type === "TORCH") {
      try {
        navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } }).catch(() => {});
      } catch (e) {}
    } else if (action.type === "SEARCH") {
      const q = encodeURIComponent(action.data?.query || "");
      window.open("https://www.google.com/search?q=" + q, "_blank");
    }
    setActiveAction(null);
  }, []);

  // Send query to local brain or Gemini API
  const sendQueryToGemini = useCallback(
    async (promptText: string, imageBase64?: string) => {
      if ((!promptText && !imageBase64) || isProcessing) return;

      setIsProcessing(true);
      setActiveAction(null);

      const userMessage: Message = {
        id: "msg-" + Date.now(),
        role: "user",
        text: promptText,
        image: imageBase64,
        timestamp: Date.now(),
      };
      setMessages((prev) => {
        const updated = [...prev, userMessage];
        localStorage.setItem("nura_chat_history", JSON.stringify(updated.slice(-30)));
        return updated;
      });

      const hasKey = Boolean(customKey && customKey.trim().length > 10);
      const localResult = evaluateNuraResponse(promptText, hasKey, userProfile.name);

      if (localResult) {
        if (localResult.requiresApiKey) {
          const keyRequiredReply = "দয়া করে Gemini API Key ব্যবহার করুন। Settings থেকে আপনার Gemini API Key যুক্ত করলে আমি সকল প্রশ্নের সম্পূর্ণ তথ্য ও উত্তর দিতে পারব।";
          const botMessage: Message = {
            id: "bot-" + Date.now(),
            role: "model",
            text: keyRequiredReply,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setLastAiResponse(keyRequiredReply);
          speakWithRealisticVoice("দয়া করে Gemini API Key ব্যবহার করুন।");
          setIsProcessing(false);
          setTimeout(() => {
            setIsApiKeyModalOpen(true);
          }, 1500);
          return;
        }

        const botReply = localResult.reply;
        setLastAiResponse(botReply);
        const botMessage: Message = {
          id: "bot-" + Date.now(),
          role: "model",
          text: botReply,
          action: localResult.action,
          timestamp: Date.now(),
        };
        setMessages((prev) => {
          const updated = [...prev, botMessage];
          localStorage.setItem("nura_chat_history", JSON.stringify(updated.slice(-30)));
          return updated;
        });

        if (localResult.action) {
          setActiveAction(localResult.action);
          handleExecuteAction(localResult.action);
        }

        speakWithRealisticVoice(botReply);
        setIsProcessing(false);
        return;
      }

      // Query Gemini Live API with world knowledge
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: promptText,
            imageBase64,
            userName: userProfile.name,
            memories,
            customKey,
            language: userProfile.preferredLanguage,
            history: messages.slice(-4),
          }),
        });

        const data = await response.json();
        if (response.ok && data.reply) {
          const botReply = data.reply;
          setLastAiResponse(botReply);

          if (data.action) {
            setActiveAction(data.action);
            handleExecuteAction(data.action);
            if (data.action.type === "REMEMBER" && data.action.data?.fact) {
              const newFact = data.action.data.fact;
              setMemories((prev) => {
                if (!prev.includes(newFact)) {
                  const updated = [newFact, ...prev];
                  localStorage.setItem("nura_memories", JSON.stringify(updated));
                  return updated;
                }
                return prev;
              });
            }
          }

          const botMessage: Message = {
            id: "bot-" + Date.now(),
            role: "model",
            text: botReply,
            action: data.action,
            timestamp: Date.now(),
          };
          setMessages((prev) => {
            const updated = [...prev, botMessage];
            localStorage.setItem("nura_chat_history", JSON.stringify(updated.slice(-30)));
            return updated;
          });

          speakWithRealisticVoice(botReply);
        } else {
          const errorReply = "দয়া করে Gemini API Key ব্যবহার করুন। Settings থেকে সঠিক কি যুক্ত করে আবার চেষ্টা করুন।";
          const errorBotMessage: Message = {
            id: "err-" + Date.now(),
            role: "model",
            text: errorReply,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, errorBotMessage]);
          speakWithRealisticVoice("দয়া করে Gemini API Key ব্যবহার করুন।");
        }
      } catch (err: any) {
        const errorBotMessage: Message = {
          id: "err-" + Date.now(),
          role: "model",
          text: "ইন্টারনেট বা এপিআই সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে সেটিংস থেকে Gemini API Key চেক করুন।",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorBotMessage]);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, userProfile, memories, customKey, messages, speakWithRealisticVoice, handleExecuteAction]
  );

  // Speech Recognition Hook
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: userProfile.preferredLanguage === "auto" ? "bn-BD" : userProfile.preferredLanguage,
    onFinalResult: (finalText) => {
      if (finalText.trim()) {
        sendQueryToGemini(finalText.trim());
      }
    },
  });

  // Tap mic button handler: Strictly OFF unless clicked. Triggers phone permission on first tap.
  const handleMicToggle = useCallback(async () => {
    // If phone permission is not granted yet, request real phone permission
    if (!hasMicPermission) {
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((t) => t.stop());
          setHasMicPermission(true);
          localStorage.setItem("nura_mic_permitted", "true");
        }
      } catch (e) {
        // If device requires in-app dialog prompt
        setIsAndroidPermissionOpen(true);
        return;
      }
    }

    if (isMicActive) {
      // Turn mic OFF
      setIsMicActive(false);
      stopListening();
      stopAllSpeech();
    } else {
      // Turn mic ON and turn speaker ON
      setIsMicActive(true);
      setIsSpeakerActive(true);
      stopAllSpeech();
      resetTranscript();

      // Automated Welcome speech upon permission / activation:
      const welcomePhrase = "Welcome to Nura ai! বলুন স্যার আমি আপনাকে কিভাবে সাহায্য করতে পারি?";
      const welcomeBotMsg: Message = {
        id: "greet-" + Date.now(),
        role: "model",
        text: welcomePhrase,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, welcomeBotMsg]);
      setLastAiResponse(welcomePhrase);

      speakWithRealisticVoice(welcomePhrase);
      await startListening();
    }
  }, [hasMicPermission, isMicActive, stopListening, stopAllSpeech, resetTranscript, speakWithRealisticVoice, startListening]);

  // Android Permission Dialog response
  const handleGrantFromAndroidDialog = async (mode: "always" | "once") => {
    setIsAndroidPermissionOpen(false);
    setHasMicPermission(true);
    localStorage.setItem("nura_mic_permitted", "true");

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {}

    setIsMicActive(true);
    setIsSpeakerActive(true);
    stopAllSpeech();
    resetTranscript();

    const welcomePhrase = "Welcome to Nura ai! বলুন স্যার আমি আপনাকে কিভাবে সাহায্য করতে পারি?";
    const welcomeBotMsg: Message = {
      id: "greet-" + Date.now(),
      role: "model",
      text: welcomePhrase,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, welcomeBotMsg]);
    setLastAiResponse(welcomePhrase);

    speakWithRealisticVoice(welcomePhrase);
    await startListening();
  };

  const handleDenyFromAndroidDialog = () => {
    setIsAndroidPermissionOpen(false);
    setIsMicActive(false);
  };

  // Live Weather via Open-Meteo
  const fetchLiveWeather = useCallback(async () => {
    setIsWeatherLoading(true);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const res = await fetch(
              "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
            );
            const data = await res.json();
            if (data.current) {
              const temp = Math.round(data.current.temperature_2m);
              const code = data.current.weather_code;
              let cond = "Sunny";
              if (code > 0 && code <= 3) cond = "Partly Cloudy";
              else if (code >= 45 && code <= 48) cond = "Foggy";
              else if (code >= 51 && code <= 67) cond = "Rainy";
              else if (code >= 80) cond = "Showers";

              setWeather({
                temperature: temp,
                condition: cond,
                location: "Live GPS",
                humidity: data.current.relative_humidity_2m || 60,
                isLive: true,
              });
            }
            setIsWeatherLoading(false);
          },
          () => {
            setWeather((prev) => ({ ...prev, isLive: true }));
            setIsWeatherLoading(false);
          },
          { timeout: 7000 }
        );
      } else {
        setIsWeatherLoading(false);
      }
    } catch (e) {
      setIsWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setServerStatus(data))
      .catch((err) => console.warn("Could not fetch server status:", err));
    fetchLiveWeather();
  }, [fetchLiveWeather]);

  const handleAddMemory = (newMem: string) => {
    setMemories((prev) => {
      const updated = [newMem, ...prev];
      localStorage.setItem("nura_memories", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteMemory = (index: number) => {
    setMemories((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("nura_memories", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearMemories = () => {
    setMemories([]);
    localStorage.removeItem("nura_memories");
  };

  const handleUpdateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem("nura_user_profile", JSON.stringify(next));
      return next;
    });
  };

  const handleTestVoicePersona = (targetPersona: VoicePersona, sampleText: string) => {
    speakWithRealisticVoice(sampleText, targetPersona);
  };

  const isConnectedKey = Boolean(customKey && customKey.trim().length > 10);

  return (
    <div className="min-h-screen bg-[#F6F3FB] text-[#1F1D36] relative flex flex-col font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <main className="flex-1 w-full z-10 flex flex-col">
        {activeTab === "home" && (
          <HomeScreen
            userName={userProfile.name}
            isListening={isMicActive && (isListening || isProcessing)}
            isSpeaking={isSpeakingCombined}
            isProcessing={isProcessing}
            transcript={transcript}
            interimTranscript={interimTranscript}
            lastAiResponse={lastAiResponse}
            onMicToggle={handleMicToggle}
            onOpenChat={() => setActiveTab("chat")}
            onOpenSettings={() => setActiveTab("settings")}
            onOpenTutorial={() => setIsTutorialModalOpen(true)}
            onOpenScreenVision={() => setIsScreenVisionModalOpen(true)}
            onOpenMemories={() => setIsMemoriesModalOpen(true)}
            onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
            currentLanguage={userProfile.preferredLanguage}
            memoryCount={memories.length}
            weather={weather}
            onRefreshWeather={fetchLiveWeather}
            isWeatherLoading={isWeatherLoading}
            activeAction={activeAction}
            onExecuteAction={handleExecuteAction}
            onQuickPrompt={(text) => sendQueryToGemini(text)}
            cuteIslandEnabled={userProfile.avatarSeed === "cute_island"}
            themeColor={userProfile.theme}
            isSpeakerActive={isSpeakerActive}
            onToggleSpeaker={handleToggleSpeaker}
            hasCustomKey={isConnectedKey}
          />
        )}

        {activeTab === "chat" && (
          <ChatScreen
            messages={messages}
            isProcessing={isProcessing}
            isListening={isListening}
            transcript={transcript}
            onMicToggle={handleMicToggle}
            onSendMessage={(text: string, imageBase64?: string) => sendQueryToGemini(text, imageBase64)}
            onSpeakMessage={(text: string) => speakWithRealisticVoice(text)}
            onClearHistory={() => {
              setMessages([]);
              localStorage.removeItem("nura_chat_history");
            }}
            onExecuteAction={handleExecuteAction}
            autoSpeak={isSpeakerActive}
            onToggleAutoSpeak={handleToggleSpeaker}
          />
        )}

        {activeTab === "settings" && (
          <SettingsScreen
            userProfile={userProfile}
            onUpdateUserProfile={handleUpdateUserProfile}
            serverStatus={serverStatus}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onOpenMemoriesModal={() => setIsMemoriesModalOpen(true)}
            onOpenPermissionsModal={() => setIsPermissionsModalOpen(true)}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
            onOpenAccountModal={() => setIsAccountModalOpen(true)}
            onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
            onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
            onOpenAutomationModal={() => setIsAutomationModalOpen(true)}
            onOpenTutorial={() => setIsTutorialModalOpen(true)}
            memoryCount={memories.length}
            hasCustomKey={isConnectedKey}
            themeColor={userProfile.theme}
            onChangeTheme={(theme) => handleUpdateUserProfile({ theme })}
            isInstallable={isInstallable}
            onInstallApp={install}
          />
        )}

        {activeTab === "updates" && (
          <UpdatesScreen
            silentExecution={userProfile.silentExecution}
            onToggleSilentExecution={() =>
              handleUpdateUserProfile({
                silentExecution: !userProfile.silentExecution,
              })
            }
            isInstallable={isInstallable}
            onInstallApp={install}
          />
        )}
      </main>

      {/* Center Floating Mic Button with Red MicOff when off */}
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isListening={isMicActive}
        onMicToggle={handleMicToggle}
      />

      {/* Android System Dialog */}
      <AndroidPermissionDialog
        isOpen={isAndroidPermissionOpen}
        onGrant={handleGrantFromAndroidDialog}
        onDeny={handleDenyFromAndroidDialog}
      />

      {/* Full Phone System Authorizations */}
      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        onPermissionsUpdated={(allGranted) => {
          if (allGranted) {
            setHasMicPermission(true);
            localStorage.setItem("nura_mic_permitted", "true");
          }
        }}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguage={userProfile.preferredLanguage}
        onSelectLanguage={(code) => handleUpdateUserProfile({ preferredLanguage: code })}
      />

      <VoicePersonaModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        selectedPersona={userProfile.voicePersona}
        onSelectPersona={(persona) => handleUpdateUserProfile({ voicePersona: persona })}
        voiceSpeed={userProfile.voiceSpeed}
        voicePitch={userProfile.voicePitch}
        onChangeSpeed={(speed) => handleUpdateUserProfile({ voiceSpeed: speed })}
        onChangePitch={(pitch) => handleUpdateUserProfile({ voicePitch: pitch })}
        onTestVoice={handleTestVoicePersona}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        userName={userProfile.name}
        onUpdateName={(name) => handleUpdateUserProfile({ name })}
      />

      <LicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        licenseKey={userProfile.licenseKey}
        onSaveLicenseKey={(k) => handleUpdateUserProfile({ licenseKey: k, isLicensed: true })}
      />

      <OverlayAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        selectedAvatar={userProfile.avatarSeed}
        onSelectAvatar={(avatar) => handleUpdateUserProfile({ avatarSeed: avatar })}
      />

      <AutomationModal
        isOpen={isAutomationModalOpen}
        onClose={() => setIsAutomationModalOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={customKey}
        onSaveKey={(k) => {
          setCustomKey(k);
          if (k) localStorage.setItem("nura_gemini_key", k);
          else localStorage.removeItem("nura_gemini_key");
        }}
        serverHasKey={!!serverStatus?.hasEnvKey}
      />

      <MemoryBankModal
        isOpen={isMemoriesModalOpen}
        onClose={() => setIsMemoriesModalOpen(false)}
        memories={memories}
        onAddMemory={handleAddMemory}
        onDeleteMemory={handleDeleteMemory}
        onClearAll={handleClearMemories}
      />

      <ScreenVisionModal
        isOpen={isScreenVisionModalOpen}
        onClose={() => setIsScreenVisionModalOpen(false)}
        onAnalyzeScreen={(img, prompt) => {
          setActiveTab("chat");
          sendQueryToGemini(prompt, img);
        }}
        isProcessing={isProcessing}
      />

      <TutorialModal
        isOpen={isTutorialModalOpen}
        onClose={() => {
          setIsTutorialModalOpen(false);
          localStorage.setItem("nura_tutorial_seen", "true");
        }}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenMemoriesModal={() => setIsMemoriesModalOpen(true)}
      />
    </div>
  );
}
