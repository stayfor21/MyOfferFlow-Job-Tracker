import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

function normalizeOptions(options) {
  return options.map((option) => (
    typeof option === 'string' ? { value: option, label: option } : option
  ));
}

export default function CustomSelect({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = 'Select option',
  disabled = false,
  renderOption,
  renderValue,
  className = ''
}) {
  const selectId = useId();
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
  const selectedIndex = normalizedOptions.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? normalizedOptions[selectedIndex] : null;

  const updateMenuPosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width
    });
  };

  const openMenu = () => {
    if (disabled) return;
    updateMenuPosition();
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const selectOption = (option) => {
    onChange(option.value);
    closeMenu();
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (
        triggerRef.current?.contains(event.target)
        || menuRef.current?.contains(event.target)
      ) {
        return;
      }

      closeMenu();
    };

    const handlePositionUpdate = () => updateMenuPosition();

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('resize', handlePositionUpdate);
    window.addEventListener('scroll', handlePositionUpdate, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('resize', handlePositionUpdate);
      window.removeEventListener('scroll', handlePositionUpdate, true);
    };
  }, [isOpen]);

  const handleKeyDown = (event) => {
    if (disabled) return;

    if (!isOpen && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      openMenu();
      return;
    }

    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      setActiveIndex((current) => (current + 1) % normalizedOptions.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      setActiveIndex((current) => (current - 1 + normalizedOptions.length) % normalizedOptions.length);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      const activeOption = normalizedOptions[activeIndex];
      if (activeOption) selectOption(activeOption);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-controls={`${selectId}-listbox`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        className={[
          'flex h-11 w-full items-center justify-between gap-3 rounded-2xl border bg-[var(--input-bg)] px-3 text-left text-sm text-[var(--input-text)] outline-none transition-[border-color,box-shadow,background-color] duration-150 ease-out',
          isOpen
            ? 'border-[#635BFF]/50 ring-4 ring-[#635BFF]/15'
            : 'border-white/[0.10] hover:border-[#8B5CF6]/25 hover:bg-[#8B5CF6]/[0.06] focus:border-[#635BFF]/60 focus:ring-4 focus:ring-[#635BFF]/15',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          className
        ].join(' ')}
      >
        <span className="min-w-0 truncate font-medium">
          {selectedOption
            ? (renderValue ? renderValue(selectedOption) : selectedOption.label)
            : <span className="text-[var(--input-placeholder)]">{placeholder}</span>}
        </span>
        <ChevronDown
          size={16}
          className={[
            'shrink-0 text-zinc-500 transition-transform duration-150',
            isOpen ? 'rotate-180 text-violet-200' : ''
          ].join(' ')}
        />
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          id={`${selectId}-listbox`}
          role="listbox"
          aria-label={ariaLabel}
          className="modal-scrollbar fixed z-[300] max-h-64 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-2xl shadow-black/60 ring-1 ring-[#635BFF]/15"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
            width: menuPosition.width
          }}
        >
          {normalizedOptions.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
                className={[
                  'flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150',
                  isSelected
                    ? 'border border-[#635BFF]/25 bg-[#635BFF]/15 text-[var(--text)]'
                    : isActive
                    ? 'bg-[#635BFF]/10 text-zinc-100'
                    : 'text-[var(--text-soft)] hover:bg-[#635BFF]/10 hover:text-[var(--text)]'
                ].join(' ')}
              >
                <span className="min-w-0 truncate">
                  {renderOption ? renderOption(option, { isSelected, isActive }) : option.label}
                </span>
                {isSelected && <Check size={15} className="shrink-0 text-violet-200" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}
