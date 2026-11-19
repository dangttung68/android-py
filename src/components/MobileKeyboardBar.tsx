import React, { useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ShortcutKey, KeySize } from '../types/shortcuts';

interface MobileKeyboardBarProps {
  shortcuts: ShortcutKey[];
  keySize: KeySize;
  onInsertText: (text: string, cursorOffset?: number) => void;
  onOpenConfig: () => void;
}

export const MobileKeyboardBar: React.FC<MobileKeyboardBarProps> = ({
  shortcuts,
  keySize,
  onInsertText,
  onOpenConfig,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Play subtle haptic feedback on touch devices
  const playHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch (e) {}
    }
  };

  const handleKeyClick = (key: ShortcutKey) => {
    playHaptic();
    onInsertText(key.insertText, key.cursorOffset || 0);
  };

  // Seamless single-strip height & touch width sizing
  const sizeConfig = {
    small: {
      height: 'h-8',
      keyWidth: 'min-w-[34px] px-2',
      configWidth: 'w-9',
      text: 'text-[11px]',
      icon: 'w-3.5 h-3.5',
    },
    medium: {
      height: 'h-9',
      keyWidth: 'min-w-[38px] px-2.5',
      configWidth: 'w-10',
      text: 'text-xs',
      icon: 'w-4 h-4',
    },
    large: {
      height: 'h-11',
      keyWidth: 'min-w-[44px] px-3',
      configWidth: 'w-11',
      text: 'text-[13px]',
      icon: 'w-4.5 h-4.5',
    },
  }[keySize];

  const visibleKeys = shortcuts.filter((k) => k.visible);

  return (
    <div className="w-full bg-[#070b14] border-t border-cyan-950/60 px-1.5 sm:px-3 py-1.5 select-none z-20 shrink-0">
      {/* Unified Seamless Single-Strip Keyboard Dock */}
      <div
        className={`w-full ${sizeConfig.height} rounded-2xl bg-gradient-to-r from-[#0b1120] via-[#0e1729] to-[#0b1120] border border-cyan-500/35 shadow-[0_0_18px_rgba(34,211,238,0.12)] flex items-stretch overflow-hidden`}
      >
        {/* Horizontal Scrollable Keys (Zero gaps, seamless edge-to-edge strip) */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-stretch overflow-x-auto no-scrollbar scroll-smooth divide-x divide-slate-800/85"
        >
          {visibleKeys.map((k) => {
            const isTabOrHighlight = k.isHighlight || k.id === 'tab';
            return (
              <button
                key={k.id}
                onClick={() => handleKeyClick(k)}
                title={k.description || k.label}
                className={`shrink-0 h-full font-mono font-semibold flex items-center justify-center transition-colors whitespace-nowrap ${sizeConfig.keyWidth} ${sizeConfig.text} ${
                  isTabOrHighlight
                    ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/10 text-amber-300 hover:bg-amber-500/25 active:bg-amber-400 active:text-slate-950 font-bold'
                    : 'bg-transparent text-slate-100 hover:bg-[#152038] active:bg-cyan-500/30 active:text-cyan-200'
                }`}
              >
                {k.label}
              </button>
            );
          })}
        </div>

        {/* Flush Integrated Settings Button on Right Edge of Same Strip */}
        <button
          onClick={() => {
            playHaptic();
            onOpenConfig();
          }}
          title="Cài đặt & Tùy biến thanh phím tắt"
          aria-label="Cài đặt thanh phím tắt"
          className={`relative shrink-0 h-full ${sizeConfig.configWidth} border-l border-cyan-500/30 bg-[#0e182c] hover:bg-[#162542] active:bg-cyan-500/30 text-slate-200 hover:text-cyan-300 flex items-center justify-center transition-colors`}
        >
          <SlidersHorizontal className={sizeConfig.icon} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0e182c]" />
        </button>
      </div>
    </div>
  );
};
