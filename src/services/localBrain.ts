/**
 * NURA Ai - Local Smart Brain Engine
 * Handles exact offline / pre-key rules requested by user:
 * 1. "তোমাকে কে বানিয়েছে?" -> Creator is Nafiz Fuad Noyon
 * 2. "তোমার নাম কি?" -> Name is NURA Ai
 * 3. Any general question without Gemini Key -> "দয়া করে Gemini API Key ব্যবহার করুন..."
 * 4. When Gemini Key is connected -> Full answers to everything via Gemini API
 */

export interface LocalBrainResult {
  reply: string;
  action?: {
    type: string;
    data?: any;
  };
  requiresApiKey?: boolean;
}

export function evaluateNuraResponse(
  promptText: string,
  hasApiKey: boolean,
  userName: string = 'Noyon'
): LocalBrainResult | null {
  const text = promptText.trim();
  const lower = text.toLowerCase();

  // Rule 1: "তোমাকে কে বানিয়েছে?" (Always answers Nafiz Fuad Noyon, regardless of API key)
  if (
    lower.includes('তোমাকে কে বানিয়েছে') ||
    lower.includes('তোমাকে কে বানাইছে') ||
    lower.includes('তোমাকে কে তৈরি করেছে') ||
    lower.includes('তোমার ডেভলপার কে') ||
    lower.includes('তোমার প্রস্তুতকারক কে') ||
    lower.includes('who made you') ||
    lower.includes('who created you') ||
    lower.includes('who developed you') ||
    lower.includes('who is your developer')
  ) {
    return {
      reply: 'আমাকে তৈরি ও ডেভেলপ করেছেন নাফিজ ফুয়াদ নয়ন (Nafiz Fuad Noyon)। আমি তারই সার্বিক নির্দেশনায় সম্পূর্ণ পরিচালিত।',
    };
  }

  // Rule 2: "তোমার নাম কি?" (Always answers NURA Ai)
  if (
    lower.includes('তোমার নাম কি') ||
    lower.includes('তোমার নাম কী') ||
    lower.includes('তোমার নাম বলো') ||
    lower.includes('what is your name') ||
    lower.includes('whats your name') ||
    lower.includes('who are you') ||
    lower.includes('তোমার পরিচয়')
  ) {
    return {
      reply: 'আমার নাম NURA Ai (নূরা এআই)। আমি আপনার সার্বক্ষণিক ব্যক্তিগত ভয়েস ও ফোন অ্যাসিস্ট্যান্ট।',
    };
  }

  // Rule 3: Direct Phone Control Voice Commands (Works instantly without requiring API Key)
  if (
    lower.includes('ইউটিউব ওপেন') ||
    lower.includes('ইউটিউব খোলো') ||
    lower.includes('open youtube')
  ) {
    return {
      reply: 'ইউটিউব ওপেন করছি...',
      action: {
        type: 'OPEN_URL',
        data: { url: 'https://m.youtube.com', label: 'YouTube' },
      },
    };
  }

  if (
    lower.includes('হোয়াটসঅ্যাপ') ||
    lower.includes('whatsapp')
  ) {
    return {
      reply: 'হোয়াটসঅ্যাপ ওপেন করছি...',
      action: {
        type: 'WHATSAPP',
        data: { text: 'Hello from NURA Ai Voice Assistant', recipient: '' },
      },
    };
  }

  if (
    lower.includes('কল দাও') ||
    lower.includes('ফোন করো') ||
    lower.includes('call')
  ) {
    const numMatch = text.match(/(\+?\d[\d\s-]{6,15}\d)/);
    const number = numMatch ? numMatch[1].replace(/\s+/g, '') : '';
    return {
      reply: number ? `${number} নম্বরে সরাসরি কল দেওয়া হচ্ছে...` : 'ফোন ডায়ালার ওপেন করছি...',
      action: {
        type: 'CALL',
        data: { number },
      },
    };
  }

  if (
    lower.includes('টর্চ জ্বালাও') ||
    lower.includes('টর্চ অন') ||
    lower.includes('ফ্ল্যাশলাইট অন')
  ) {
    return {
      reply: 'ফোনের ফ্ল্যাশলাইট জ্বালানো হলো।',
      action: {
        type: 'TORCH',
        data: { enabled: true },
      },
    };
  }

  // Rule 4: If NO custom Gemini Key is connected:
  // For ANY other question (such as "আজকে কি বার?", "আবহাওয়া কেমন?", general questions)
  if (!hasApiKey) {
    return {
      reply: 'দয়া করে Gemini API Key ব্যবহার করুন। Settings থেকে আপনার Gemini API Key যুক্ত করলে আমি সকল প্রশ্নের সম্পূর্ণ তথ্য ও উত্তর দিতে পারব।',
      requiresApiKey: true,
      action: {
        type: 'PROMPT_API_KEY',
      },
    };
  }

  // If Gemini API Key IS present, return null so it passes through to Gemini Live API
  return null;
}
