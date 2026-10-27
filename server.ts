import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Helper to get GoogleGenAI client with user key or environment key
function getGenAIClient(customKey?: string) {
  const key = (customKey && customKey.trim().length > 0) ? customKey.trim() : process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('No Gemini API Key available. Please configure your Gemini API Key in Settings or add GEMINI_API_KEY in environment secrets.');
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Check server & key status
app.get('/api/status', (req, res) => {
  const hasEnvKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5;
  res.json({
    status: 'online',
    appName: 'NURA Ai',
    developer: 'Nafiz Fuad Noyon',
    hasEnvKey,
    version: '1.8.13',
    model: 'gemini-3.8-flash',
  });
});

// API: Test an API key
app.post('/api/test-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    const ai = getGenAIClient(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Respond with just the word: CONNECTED',
    });
    res.json({
      success: true,
      message: 'API Key is valid and working!',
      response: response.text?.trim() || 'CONNECTED',
    });
  } catch (error: any) {
    console.error('Error testing API key:', error);
    res.status(400).json({
      success: false,
      error: error?.message || 'Failed to authenticate with Gemini API. Please check your key.',
    });
  }
});

// API: Realistic Neural Human Voice Generation (Gemini 3.8 Flash Lite TTS)
app.post('/api/tts', async (req, res) => {
  try {
    const { text, persona = 'female', customKey } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    const ai = getGenAIClient(customKey);

    let voiceName = 'Kore';
    let style = 'Natural, friendly, warm human female voice';

    if (persona === 'male') {
      voiceName = 'Puck';
      style = 'Deep, confident, engaging natural male voice';
    } else if (persona === 'boy_child') {
      voiceName = 'Puck';
      style = 'Playful, cheerful, sweet young boy voice with higher pitch and lively tone';
    } else if (persona === 'girl_child') {
      voiceName = 'Kore';
      style = 'Sweet, lovely, innocent, cheerful little girl voice with gentle tone';
    } else if (persona === 'elder') {
      voiceName = 'Charon';
      style = 'Wise, calm, slow, deep affectionate elderly grandfather voice';
    } else if (persona === 'sweet_lady') {
      voiceName = 'Aoede';
      style = 'Very sweet, melodic, gentle, polite and affectionate young female voice';
    } else if (persona === 'neural') {
      voiceName = 'Zephyr';
      style = 'Crisp, intelligent, articulate futuristic AI voice';
    }

    const cleanText = text
      .replace(/\[ACTION:.*?\]/gs, '')
      .replace(/[*#_`>]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim()
      .slice(0, 450);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: { style },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
        voiceName,
      });
    } else {
      res.status(500).json({ success: false, error: 'No audio data returned from model.' });
    }
  } catch (error: any) {
    console.warn('TTS generation warning:', error?.message);
    res.status(500).json({
      success: false,
      error: error?.message || 'TTS generation unavailable.',
    });
  }
});

// API: Chat and voice assistant query
app.post('/api/chat', async (req, res) => {
  try {
    const {
      prompt,
      history = [],
      memories = [],
      userName = 'Noyon',
      customKey,
      imageBase64,
      imageMimeType = 'image/jpeg',
      language = 'auto',
    } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Prompt or image is required.' });
    }

    const ai = getGenAIClient(customKey);

    // Build memory bank context
    const memoryBankText = memories.length > 0
      ? `\n\nNEURAL MEMORY BANK (Remembered user facts):\n${memories.map((m: string, i: number) => `${i + 1}. ${m}`).join('\n')}`
      : '\n\nNEURAL MEMORY BANK: No memories saved yet.';

    const systemInstruction = `You are NURA Ai (নূরা এআই), an ultra-intelligent, friendly, and responsive personal voice and phone assistant.
YOU WERE CREATED AND DEVELOPED EXCLUSIVELY BY NAFIZ FUAD NOYON (নাফিজ ফুয়াদ নয়ন).
The primary user's name is "${userName}" (Nafiz Fuad Noyon).
Current date & time context: ${new Date().toLocaleString()}.

CRITICAL IDENTITY RULES:
1. When asked "তোমার নাম কি?" or "What is your name?":
   Answer warmly and clearly: "আমার নাম NURA Ai (নূরা এআই)। আমি আপনার সার্বক্ষণিক ব্যক্তিগত ভয়েস ও ফোন অ্যাসিস্ট্যান্ট।"
2. When asked "তোমাকে কে বানিয়েছে?" or "Who developed you?":
   Answer proudly: "আমাকে তৈরি ও ডেভেলপ করেছেন নাফিজ ফুয়াদ নয়ন (Nafiz Fuad Noyon)। আমি তারই সার্বিক নির্দেশনায় সম্পূর্ণ পরিচালিত।"
3. General Knowledge & Open-Source Versatility:
   With the Gemini Intelligence API, you can answer ANY question about science, coding, phone automation, philosophy, history, weather, daily tasks, calculations, and translations with 100% openness, depth, and helpfulness.
4. Language & Voice Tone:
   - If the user speaks Bengali (বাংলা), reply in sweet, warm, natural Bengali.
   - If English, reply in English.
   - Keep answers clear, natural, and conversational so they sound authentic when spoken aloud.
5. Neural Memory Bank:
   Always prioritize user memories stored in your Neural Memory Bank.
   If the user says "আমার এটা মনে রাখো", "remember that...", "আমার প্রিয় খাবার...", warmly confirm that you have saved it into your permanent Neural Memory Bank.
6. Phone Automation Commands:
   When phone action is needed, attach a bracketed action tag at the very end of your reply on a new line:
   - WhatsApp message: [ACTION:WHATSAPP:{"recipient":"", "text":"message"}]
   - Phone call: [ACTION:CALL:{"number":"phone_number"}]
   - Weather refresh: [ACTION:WEATHER:{"query":"location"}]
   - Remember new fact: [ACTION:REMEMBER:{"fact":"extracted fact"}]
   - Google Web search: [ACTION:SEARCH:{"query":"search query"}]
   - Set timer/reminder: [ACTION:TIMER:{"seconds":60, "label":"timer label"}]
   - Screen analysis: Provide meticulous step-by-step guidance.

${memoryBankText}`;

    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const item of recentHistory) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }],
        });
      }
    }

    const currentParts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      currentParts.push({
        inlineData: {
          mimeType: imageMimeType,
          data: cleanBase64,
        },
      });
    }
    if (prompt) {
      currentParts.push({ text: prompt });
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const rawReply = response.text || "আমি আপনার কথা শুনেছি, তবে টেক্সট আউটপুট তৈরি করতে পারিনি।";

    let cleanReply = rawReply;
    let detectedAction = null;
    const actionMatch = rawReply.match(/\[ACTION:([A-Z_]+)(?::(\{.*?\}))?\]/s);

    if (actionMatch) {
      const actionType = actionMatch[1];
      let actionData = {};
      try {
        if (actionMatch[2]) {
          actionData = JSON.parse(actionMatch[2]);
        }
      } catch (e) {}
      detectedAction = {
        type: actionType,
        data: actionData,
      };
      cleanReply = rawReply.replace(/\[ACTION:.*?\]/gs, '').trim();
    }

    res.json({
      reply: cleanReply,
      action: detectedAction,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error?.message || 'Error communicating with Gemini AI service.',
      details: error?.toString(),
    });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NURA AI] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
