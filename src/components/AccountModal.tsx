import React, { useState } from 'react';
import { User, Users, Shield, Smartphone, Plus, Trash2, X, Check } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onUpdateName: (name: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  userName,
  onUpdateName,
}) => {
  const [name, setName] = useState(userName);
  const [familyMembers, setFamilyMembers] = useState<string[]>([
    'Nafiz Fuad Noyon (Primary Owner)',
    'Family Circle (Trusted)',
  ]);
  const [newMember, setNewMember] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onUpdateName(name.trim());
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    }
  };

  const handleAddMember = () => {
    if (newMember.trim()) {
      setFamilyMembers([...familyMembers, newMember.trim()]);
      setNewMember('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                NURA Account & Family
              </h3>
              <p className="text-[10px] text-slate-500">
                Primary Operator & Trusted Circle
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

        <div className="py-4 space-y-4 text-xs overflow-y-auto flex-1">
          {/* User Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Primary Operator Name:
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 text-xs p-2 rounded-xl border border-purple-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6342E8]"
              />
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-[#6342E8] text-white rounded-xl font-bold text-xs hover:bg-purple-700 transition"
              >
                {savedMessage ? <Check className="w-3.5 h-3.5" /> : 'Save'}
              </button>
            </div>
            {savedMessage && (
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                ✓ Operator name updated!
              </p>
            )}
          </div>

          {/* Account ID / Status */}
          <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">NURA ID:</span>
              <span className="font-mono font-bold text-[#6342E8]">NURA-896-NOYON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-emerald-600">Active • Verified</span>
            </div>
          </div>

          {/* Family Circle */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Family Circle & Connected Users:</span>
            </label>
            <div className="space-y-1.5 mb-2">
              {familyMembers.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="font-medium text-slate-700 text-[11px]">{m}</span>
                  {idx > 0 && (
                    <button
                      onClick={() => setFamilyMembers(familyMembers.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-500 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-1.5">
              <input
                type="text"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Add family member name..."
                className="flex-1 text-xs p-2 rounded-xl border border-purple-100 bg-white text-slate-800"
              />
              <button
                onClick={handleAddMember}
                disabled={!newMember.trim()}
                className="px-2.5 py-1.5 bg-purple-100 text-[#6342E8] hover:bg-purple-200 rounded-xl font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
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
