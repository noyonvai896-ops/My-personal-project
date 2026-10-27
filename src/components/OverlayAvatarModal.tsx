import React from 'react';
import { Palette, Check, X, Smile, Sparkles, Bot, Circle } from 'lucide-react';

interface OverlayAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
}

export const OverlayAvatarModal: React.FC<OverlayAvatarModalProps> = ({
  isOpen,
  onClose,
  selectedAvatar,
  onSelectAvatar,
}) => {
  if (!isOpen) return null;

  const avatars = [
    {
      id: 'cute_island',
      name: 'Cute Floating Island',
      description: 'Animated dynamic face pill with mood expressions',
      preview: '(・‿・)',
      icon: Smile,
      badge: 'RECOMMENDED',
    },
    {
      id: 'orb',
      name: 'Mini Neural Sphere',
      description: 'Glowing 3D gradient orb floating on screen',
      preview: '🔮',
      icon: Sparkles,
      badge: '3D GLOW',
    },
    {
      id: 'bot',
      name: 'Cyber Assistant Bot',
      description: 'Futuristic robotic companion badge',
      preview: '🤖',
      icon: Bot,
      badge: 'CYBER',
    },
    {
      id: 'minimal',
      name: 'Minimal Pearl Badge',
      description: 'Discreet and subtle glowing status dot',
      preview: '⚪',
      icon: Circle,
      badge: 'MINIMAL',
    },
    {
      id: 'disabled',
      name: 'Overlay Off',
      description: 'Hide floating avatar widget completely',
      preview: '✕',
      icon: X,
      badge: 'OFF',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Overlay Avatars & Island
              </h3>
              <p className="text-[10px] text-slate-500">
                Choose a floating screen companion
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

        <div className="py-3 space-y-2 overflow-y-auto flex-1">
          {avatars.map((av) => {
            const isSelected = selectedAvatar === av.id;
            return (
              <div
                key={av.id}
                onClick={() => {
                  onSelectAvatar(av.id);
                  onClose();
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50/90 border-[#6342E8] shadow-xs'
                    : 'bg-white border-purple-50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/70 flex items-center justify-center text-xl font-mono">
                    {av.preview}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{av.name}</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.2 bg-purple-100 text-[#6342E8] rounded-md">
                        {av.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">{av.description}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#6342E8] flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#6342E8] text-white rounded-xl font-bold text-xs hover:opacity-95 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
