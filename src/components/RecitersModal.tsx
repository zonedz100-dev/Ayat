import React from 'react';
import { X, Headphones, Check, Sparkles, Volume2 } from 'lucide-react';
import { Reciter } from '../types';
import { RECITERS_LIST } from '../data/quranData';

interface RecitersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
}

export const RecitersModal: React.FC<RecitersModalProps> = ({
  isOpen,
  onClose,
  selectedReciter,
  onSelectReciter
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c0c0c] rounded-2xl w-full max-w-lg overflow-hidden border border-indigo-500/25 shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181818] border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">اختر القارئ</h3>
              <p className="text-xs text-slate-400">تلاوات بأصوات أشهر القراء في العالم الإسلامي</p>
            </div>
          </div>
          <button
            id="close-reciters-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1a1a] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reciters List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {RECITERS_LIST.map((reciter) => {
            const isSelected = reciter.id === selectedReciter.id;
            return (
              <div
                key={reciter.id}
                id={`reciter-option-${reciter.id}`}
                onClick={() => {
                  onSelectReciter(reciter);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#161616] border-indigo-500 ring-1 ring-indigo-500/30'
                    : 'bg-[#111] border-[#1f1f1f] hover:border-indigo-500/30 hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#181818] border border-indigo-500/20 text-indigo-400'
                  }`}>
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {reciter.arabicName}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {reciter.style} • {reciter.name}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#0e0e0e] text-center">
          <p className="text-xs text-slate-500">
            سيتم استخدام القارئ المختار في جميع التلاوات والاستماع الآني للآيات.
          </p>
        </div>

      </div>
    </div>
  );
};
