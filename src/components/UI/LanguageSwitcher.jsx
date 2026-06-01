import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../i18n.jsx';

const options = [
  { value: 'en', short: 'EN', labelKey: 'lang.english' },
  { value: 'de', short: 'DE', labelKey: 'lang.german' },
  { value: 'ru', short: 'RU', labelKey: 'lang.russian' }
];

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const current = options.find((option) => option.value === language) || options[0];

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ top: rect.bottom + 8, left: rect.left, width: Math.max(rect.width, 150) });
  };

  const open = () => {
    updatePosition();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (triggerRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={t('lang.change')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        className={[
          'theme-icon-button inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-semibold',
          'transition-[background-color,border-color,box-shadow,color] duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20',
          isOpen ? 'border-[#8B5CF6]/35 shadow-[0_0_18px_rgba(99,91,255,0.14)]' : ''
        ].join(' ')}
      >
        <Languages size={15} className="text-current opacity-70" />
        <span>{current.short}</span>
        <ChevronDown size={14} className={isOpen ? 'rotate-180 text-violet-300 transition-transform' : 'text-current opacity-70 transition-transform'} />
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          role="listbox"
          aria-label={t('lang.change')}
          className="fixed z-[300] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-2xl shadow-black/60 ring-1 ring-[#635BFF]/15"
          style={{ top: position.top, left: position.left, width: position.width }}
        >
          {options.map((option) => {
            const selected = option.value === language;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setLanguage(option.value);
                  setIsOpen(false);
                  requestAnimationFrame(() => triggerRef.current?.focus());
                }}
                className={[
                  'flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150',
                  selected ? 'bg-[#635BFF]/15 text-[var(--text)]' : 'text-[var(--text-soft)] hover:bg-[#635BFF]/10 hover:text-[var(--text)]'
                ].join(' ')}
              >
                <span>{t(option.labelKey)}</span>
                {selected && <Check size={15} className="text-violet-200" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}
