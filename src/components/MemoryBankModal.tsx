import React, { useState } from 'react';
import { BrainCircuit, Search, Plus, Trash2, X, Check, Download, Upload, Sparkles, HardDrive } from 'lucide-react';

interface MemoryBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: string[];
  onAddMemory: (memory: string) => void;
  onDeleteMemory: (index: number) => void;
  onClearAll: () => void;
}

export const MemoryBankModal: React.FC<MemoryBankModalProps> = ({
  isOpen,
  onClose,
  memories,
  onAddMemory,
  onDeleteMemory,
  onClearAll,
}) => {
  const [newMemory, setNewMemory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const maxCapacity = 10000;
  const usedPercent = Math.min(100, Math.max(0.1, (memories.length / maxCapacity) * 100));

  const handleAdd = () => {
    if (!newMemory.trim()) return;
    onAddMemory(newMemory.trim());
    setNewMemory('');
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'nura_memories_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredMemories = memories.filter((m) =>
    m.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#6342E8]">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Neural Memory Bank
              </h3>
              <p className="text-[10px] text-slate-500">
                Recall Core • ধারণক্ষমতা {memories.length} / {maxCapacity} ফ্যাক্টস
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

        {/* Capacity Bar */}
        <div className="pt-2.5 pb-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-[#6342E8]" /> মেমোরি ধারণ ক্ষমতা
            </span>
            <span className="text-[#6342E8]">{memories.length} সংরক্ষিত (অসীম স্টোরেজ)</span>
          </div>
          <div className="w-full h-1.5 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6342E8] to-[#915BFF] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(4, usedPercent)}%` }}
            />
          </div>
        </div>

        {/* Add Memory Input */}
        <div className="py-2.5 border-b border-purple-50">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. আমার প্রিয় খাবার বিরিয়ানি..."
              className="flex-1 text-xs p-2 rounded-xl border border-purple-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6342E8]"
            />
            <button
              onClick={handleAdd}
              disabled={!newMemory.trim()}
              className="px-3 py-2 bg-[#6342E8] disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-purple-700 transition cursor-pointer"
            >
              {addedSuccess ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>সেভ</span>
            </button>
          </div>
          {addedSuccess && (
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">
              ✓ মেমোরি ব্যাংকে তথ্য সংরক্ষিত হয়েছে!
            </p>
          )}
        </div>

        {/* Search */}
        {memories.length > 2 && (
          <div className="py-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="মেমোরি সার্চ করুন..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-purple-100 bg-purple-50/50 text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Memories List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              {searchQuery ? 'কোনো তথ্য পাওয়া যায়নি।' : 'কোনো মেমোরি এখনো সেভ নেই। মুখে বললেই NURA মনে রাখবে!'}
            </div>
          ) : (
            filteredMemories.map((mem, index) => (
              <div
                key={index}
                className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100/70 flex items-start justify-between gap-2 group hover:bg-purple-50 transition"
              >
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6342E8] mt-1.5 shrink-0" />
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {mem}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteMemory(index)}
                  className="p-1 text-slate-300 hover:text-rose-500 rounded-lg transition shrink-0 cursor-pointer"
                  title="Delete memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer info & Backup */}
        <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[11px]">
          <button
            onClick={handleExport}
            className="text-[#6342E8] hover:underline font-bold flex items-center gap-1 text-[10px]"
          >
            <Download className="w-3 h-3" /> ব্যাকআপ (Export)
          </button>
          {memories.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-rose-500 hover:underline font-bold text-[10px] cursor-pointer"
            >
              সব মুছুন (Clear All)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
