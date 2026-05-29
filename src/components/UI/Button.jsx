import React from 'react';

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'default',
  ...props
}) {
  const baseStyles = [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold',
    'transition-[transform,background-color,box-shadow,border-color,color,filter] duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20',
    'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100'
  ].join(' ');

  const variants = {
    primary: [
      'border border-[#8B5CF6]/30 bg-gradient-to-br from-[#8B5CF6] via-[#6D5DFB] to-[#635BFF] text-white',
      'shadow-[0_0_22px_rgba(99,91,255,0.20)]',
      'hover:border-[#A78BFA]/45 hover:brightness-110 hover:shadow-[0_0_28px_rgba(99,91,255,0.30)]',
      'disabled:hover:brightness-100 disabled:hover:shadow-none'
    ].join(' '),
    secondary: [
      'border border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] shadow-none',
      'hover:border-[#8B5CF6]/25 hover:bg-[var(--button-secondary-hover)] hover:text-[var(--button-secondary-hover-text)]',
      'disabled:hover:border-[var(--button-secondary-border)] disabled:hover:bg-[var(--button-secondary-bg)] disabled:hover:text-[var(--button-secondary-text)]'
    ].join(' '),
    danger: [
      'border border-rose-400/20 bg-rose-500/10 text-rose-200 shadow-none',
      'hover:border-rose-400/35 hover:bg-rose-500/15 hover:text-rose-100'
    ].join(' '),
    ghost: [
      'border border-transparent bg-transparent text-[var(--text-muted)] shadow-none',
      'hover:bg-[var(--surface-muted)] hover:text-[var(--text)]'
    ].join(' '),
  };

  const sizes = {
    large: 'h-14 rounded-2xl px-5 text-sm',
    default: 'h-11 rounded-2xl px-5 text-sm',
    compact: 'h-8 rounded-xl px-3 text-[11px]',
    icon: 'h-10 w-10 rounded-2xl p-0'
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size] || sizes.default} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
