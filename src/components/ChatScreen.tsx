import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  Image as ImageIcon,
  X,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Phone,
  ExternalLink
} from 'lucide-react';
import { Message, AssistantAction } from '../types';

interface ChatScreenProps {
  messages: Message[];
  onSendMessage: (text: string, imageBase64?: string) => void;
  isProcessing: boolean;
  isListening: boolean;
  transcript: string;
  onMicToggle: () => void;
  onSpeakMessage: (text: string) => void;
  onClearHistory: () => void;
  onExecuteAction: (action: AssistantAction) => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  isListening,
  transcript,
  onMicToggle,
  onSpeakMessage,
  onClearHistory,
  onExecuteAction,
  autoSpeak,
  onToggleAutoSpeak,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // When transcript updates while chat is open, copy to input if user stops
  useEffect(() => {
    if (transcript && isListening) {
      setInputText(transcript);
    }
  }, [transcript, isListening]);

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isProcessing) return;
    onSendMessage(inputText.trim(), selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-80px)] max-w-md mx-auto px-3 pt-3 pb-2 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-100/80 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6342E8] to-[#915BFF] flex items-center justify-center text-white shadow-xs font-bold text-xs">
            NA
          </div>
          <div>
            <div className="text-sm font-black text-[#1F1D36] font-heading flex items-center gap-1">
              <span>NURA Ai Chat</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              Developed by Nafiz Fuad Noyon
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Auto Speak Toggle */}
          <button
            onClick={onToggleAutoSpeak}
            className={`p-2 rounded-xl transition cursor-pointer ${
              autoSpeak
                ? 'bg-purple-100 text-[#6342E8]'
                : 'bg-slate-100 text-slate-400 hover:text-slate-600'
            }`}
            title={autoSpeak ? 'Voice output enabled' : 'Voice output muted'}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clear History */}
          <button
            onClick={onClearHistory}
            className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-16 h-16 rounded-3xl bg-purple-50 flex items-center justify-center text-[#6342E8] mb-3">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-700">Chat with NURA Ai</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              বাংলা বা ইংরেজিতে কথা বলুন বা প্রশ্ন লিখুন। আপনার মেমোরি ও কমান্ড অনুযায়ী NURA সাহায্য করবে।
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#6342E8] to-[#7A58E6] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-purple-100/90 rounded-bl-xs'
                }`}
              >
                {/* Attached Image if any */}
                {msg.image && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-h-48">
                    <img
                      src={msg.image}
                      alt="Uploaded"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>

                {/* Assistant Action Button if generated */}
                {msg.action && (
                  <div className="mt-2.5 pt-2 border-t border-purple-100/40">
                    <button
                      onClick={() => onExecuteAction(msg.action!)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#6342E8] font-bold rounded-xl transition"
                    >
                      {msg.action.type === 'WHATSAPP' ? (
                        <MessageCircle className="w-3.5 h-3.5" />
                      ) : msg.action.type === 'CALL' ? (
                        <Phone className="w-3.5 h-3.5" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {msg.action.type === 'WHATSAPP'
                          ? 'Open WhatsApp Message'
                          : msg.action.type === 'CALL'
                          ? `Call: ${msg.action.data?.number || 'Phone'}`
                          : `Execute ${msg.action.type}`}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bot Action Tools: Read aloud, Copy, Time */}
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  <button
                    onClick={() => onSpeakMessage(msg.text)}
                    className="p-1 text-slate-400 hover:text-purple-600 transition"
                    title="Speak Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(msg.id, msg.text)}
                    className="p-1 text-slate-400 hover:text-purple-600 transition"
                    title="Copy Text"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>
          ))
        )}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-purple-600 font-medium py-1 px-2">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
            <span>NURA Ai is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview if selected */}
      {selectedImage && (
        <div className="relative mb-2 inline-block">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-purple-400 shadow-md">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="w-full flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-purple-100 shadow-sm mt-1">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Upload Image Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-[#6342E8] hover:bg-purple-50 rounded-xl transition cursor-pointer"
          title="Upload image / Screenshot for analysis"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Text Input Field */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening to your voice...' : 'Ask NURA Ai anything...'}
          className="flex-1 text-xs py-2 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />

        {/* Mic Toggle Button */}
        <button
          onClick={onMicToggle}
          className={`p-2 rounded-xl transition cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'text-slate-400 hover:text-[#6342E8] hover:bg-purple-50'
          }`}
          title={isListening ? 'Stop recording' : 'Tap to speak'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={(!inputText.trim() && !selectedImage) || isProcessing}
          className={`p-2 rounded-xl transition cursor-pointer ${
            (inputText.trim() || selectedImage) && !isProcessing
              ? 'bg-[#6342E8] text-white hover:bg-purple-700 shadow-sm'
              : 'bg-slate-100 text-slate-300'
          }`}
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
