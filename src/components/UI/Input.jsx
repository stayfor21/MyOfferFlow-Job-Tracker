import React from 'react';

export default function Input({ label, id, className = '', children, ...props }) {
  return (
    <div className="space-y-1.5 relative">
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all ${className}`}
        {...props}
      />
      {children}
    </div>
  );
}