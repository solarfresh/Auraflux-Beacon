import type { ComponentSize, ComponentVariant } from '@auraflux/design-system/interfaces/theme';

export const SHARED_SIZE_CLASSES: Record<ComponentSize, { button: string; iconButton: string; icon: string; badge: string }> = {
  xs: {
    button: 'px-2.5 py-1.5 text-xs',
    iconButton: 'p-1',
    icon: 'w-3 h-3',
    badge: 'px-1.5 py-0.5 text-[10px] leading-none',
  },
  sm: {
    button: 'px-3 py-2 text-sm',
    iconButton: 'p-1.5',
    icon: 'w-4 h-4',
    badge: 'px-2 py-0.5 text-xs',
  },
  md: {
    button: 'px-5 py-2.5 text-base',
    iconButton: 'p-2.5',
    icon: 'w-6 h-6',
    badge: 'px-2.5 py-1 text-sm',
  },
  lg: {
    button: 'px-6 py-3 text-lg',
    iconButton: 'p-3',
    icon: 'w-8 h-8',
    badge: 'px-3 py-1.5 text-base',
  },
  xl: {
    button: 'px-7 py-3.5 text-xl',
    iconButton: 'p-3.5',
    icon: 'w-10 h-10',
    badge: 'px-3.5 py-2 text-lg',
  },
  '2xl': {
    button: 'px-8 py-4 text-2xl',
    iconButton: 'p-4',
    icon: 'w-12 h-12',
    badge: 'px-4 py-2.5 text-xl',
  },
};

export const SHARED_VARIANT_CLASSES: Record<ComponentVariant, { bg: string; text: string; border?: string; hover?: string }> = {
  primary: {
    bg: 'bg-indigo-600',
    text: 'text-white',
    hover: 'hover:bg-indigo-700',
  },
  secondary: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    hover: 'hover:bg-indigo-100',
  },
  tertiary: {
    bg: 'bg-transparent',
    text: 'text-slate-600',
    hover: 'hover:bg-slate-100',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-slate-700',
    border: 'border border-slate-200',
    hover: 'hover:border-slate-300 hover:bg-slate-50',
  },
  ghost: {
    bg: 'bg-transparent',
    text: 'text-slate-400',
    hover: 'hover:text-slate-600 hover:bg-slate-100',
  },
  success: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border border-emerald-200',
    hover: 'hover:bg-emerald-100',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border border-amber-200',
    hover: 'hover:bg-amber-100',
  },
  danger: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border border-red-200',
    hover: 'hover:bg-red-100',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border border-blue-200',
    hover: 'hover:bg-blue-100',
  },
};