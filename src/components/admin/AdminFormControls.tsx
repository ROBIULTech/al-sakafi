import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';

export const SectionCard: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, description, action, children }) => (
  <div className="rounded-xl border border-[#1a1a1a] bg-[#0b0b0b] p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#181818] pb-4">
      <div>
        <h3 className="text-[16px] font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-[12px] text-[#8C8C8C]">{description}</p>
        )}
      </div>
      {action}
    </div>
    <div className="mt-5 space-y-4">{children}</div>
  </div>
);

export const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <label className="block space-y-1.5">
    <span className="block text-[12px] font-medium text-white/85">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[#1f1f1f] bg-[#080808] px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:border-[#00BC91] focus:outline-none"
    />
  </label>
);

export const TextAreaField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
}> = ({ label, value, onChange, rows = 3, placeholder }) => (
  <label className="block space-y-1.5">
    <span className="block text-[12px] font-medium text-white/85">{label}</span>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full resize-y rounded-lg border border-[#1f1f1f] bg-[#080808] px-3.5 py-2.5 text-[13px] leading-relaxed text-white placeholder:text-white/30 focus:border-[#00BC91] focus:outline-none"
    />
  </label>
);

export const CheckboxField: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="inline-flex items-center gap-2.5 text-[12px] font-medium text-white/90 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 accent-[#F20101] rounded cursor-pointer"
    />
    <span>{label}</span>
  </label>
);

export const StringListEditor: React.FC<{
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}> = ({ label, items, onChange, placeholder = 'Add item...' }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-medium text-white/85">{label}</span>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="inline-flex items-center gap-1 rounded-md border border-[#242424] bg-[#141414] px-2.5 py-1 text-[11px] font-medium text-[#00BC91] hover:border-[#00BC91] cursor-pointer"
      >
        <Plus className="h-3 w-3" />
        Add
      </button>
    </div>

    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const copy = [...items];
              copy[idx] = e.target.value;
              onChange(copy);
            }}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-[#1f1f1f] bg-[#080808] px-3 py-2 text-[12px] text-white placeholder:text-white/30 focus:border-[#00BC91] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            aria-label="Remove item"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#222222] bg-[#111111] text-white/60 hover:border-[#F20101] hover:text-[#F20101] cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export const ConfirmModal: React.FC<{
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-xl border border-[#242424] bg-[#0c0c0c] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[16px] font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation"
            className="text-white/60 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2.5 text-[13px] leading-relaxed text-[#A1A1AA]">
          {description}
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-[#262626] bg-[#141414] px-4 py-2 text-[12px] font-medium text-white hover:border-white/30 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-[#F20101] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#d80000] cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
