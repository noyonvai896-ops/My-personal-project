export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
  image?: string;
  action?: AssistantAction;
}

export interface AssistantAction {
  type: string;
  data?: Record<string, any>;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
  isLive: boolean;
}

export type VoicePersona = 
  | "female" 
  | "male" 
  | "boy_child" 
  | "girl_child" 
  | "elder" 
  | "sweet_lady" 
  | "neural";

export interface UserProfile {
  name: string;
  title: string;
  preferredLanguage: string;
  voicePersona: VoicePersona;
  voiceSpeed: number;
  voicePitch: number;
  silentExecution: boolean;
  avatarSeed: string;
  theme: "lavender" | "sunset" | "cosmic" | "emerald" | "cyber";
  permissionsGranted: boolean;
  licenseKey: string;
  isLicensed: boolean;
}

export interface ServerStatus {
  status: string;
  appName: string;
  developer: string;
  hasEnvKey: boolean;
  version: string;
  model: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}
