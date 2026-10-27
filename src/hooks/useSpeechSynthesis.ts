import { useState, useEffect, useCallback, useRef } from "react";
import { VoicePersona } from "../types";

interface UseSpeechSynthesisProps {
  rate?: number;
  pitch?: number;
  silent?: boolean;
  persona?: VoicePersona;
  language?: string;
}

export function useSpeechSynthesis({
  rate = 1.0,
  pitch = 1.0,
  silent = false,
  persona = "female",
  language = "auto",
}: UseSpeechSynthesisProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Compute pitch and rate modifiers strictly matching chosen persona
  const getPersonaModifiers = useCallback(
    (targetPersona: VoicePersona) => {
      switch (targetPersona) {
        case "female":
          return { pitchModifier: 1.2, rateModifier: 1.0, isFemale: true };
        case "sweet_lady":
          return { pitchModifier: 1.15, rateModifier: 0.95, isFemale: true };
        case "girl_child":
          return { pitchModifier: 1.65, rateModifier: 1.08, isFemale: true };
        case "male":
          return { pitchModifier: 0.82, rateModifier: 0.98, isFemale: false };
        case "boy_child":
          return { pitchModifier: 1.5, rateModifier: 1.12, isFemale: false };
        case "elder":
          return { pitchModifier: 0.68, rateModifier: 0.85, isFemale: false };
        case "neural":
        default:
          return { pitchModifier: 1.05, rateModifier: 1.05, isFemale: true };
      }
    },
    []
  );

  const speak = useCallback(
    (text: string, customPersona?: VoicePersona, customLang?: string) => {
      if (!isSupported || silent || !text.trim()) return;

      window.speechSynthesis.cancel();

      const cleanText = text
        .replace(/\[ACTION:.*?\]/gs, "")
        .replace(/[*#_\`>]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const activePersona = customPersona || persona;
      const { pitchModifier, rateModifier, isFemale } = getPersonaModifiers(activePersona);

      utterance.rate = Math.max(0.5, Math.min(2.0, rate * rateModifier));
      utterance.pitch = Math.max(0.2, Math.min(2.0, pitch * pitchModifier));

      const activeLang = customLang || language;
      const hasBengali = /[\u0980-\u09FF]/.test(cleanText);
      const targetLang =
        activeLang !== "auto"
          ? activeLang
          : hasBengali
          ? "bn-BD"
          : "en-US";

      // Match voice strictly based on female/male classification
      const langMatches = voices.filter((v) =>
        v.lang.toLowerCase().startsWith(targetLang.split("-")[0].toLowerCase())
      );

      let chosenVoice: SpeechSynthesisVoice | undefined;
      const searchPool = langMatches.length > 0 ? langMatches : voices;

      if (isFemale) {
        chosenVoice = searchPool.find(
          (v) =>
            v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("girl") ||
            v.name.toLowerCase().includes("woman") ||
            v.name.toLowerCase().includes("zira") ||
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("google")
        ) || searchPool[0];
      } else {
        chosenVoice = searchPool.find(
          (v) =>
            v.name.toLowerCase().includes("male") ||
            v.name.toLowerCase().includes("guy") ||
            v.name.toLowerCase().includes("david") ||
            v.name.toLowerCase().includes("george")
        ) || searchPool[searchPool.length - 1];
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      } else {
        utterance.lang = targetLang;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        isSpeakingRef.current = true;
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, silent, rate, pitch, persona, language, voices, getPersonaModifiers]
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    availableVoices: voices,
  };
}
