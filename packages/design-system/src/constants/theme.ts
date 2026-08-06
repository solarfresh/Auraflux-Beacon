import type { Alignment, BorderToken, FontWeightToken, Justification, RoundedToken, SizeToken, SpacingToken, SurfaceToken, VariantToken } from '@auraflux/design-system/interfaces/theme';

export const SHARED_ALIGN_CLASSES: Record<Alignment, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

export const SHARED_BORDER_CLASSES: Record<BorderToken, string> = {
  all: 'border',
  top: 'border-t',
  bottom: 'border-b',
  left: 'border-l',
  right: 'border-r',
  dashed: 'border-2 border-dashed',
  none: 'border-none'
};

export const SHARED_FONT_WEIGHT_CLASSES: Record<FontWeightToken, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const SHARED_GAP_CLASSES: Record<SizeToken, string> = {
  xs: 'gap-1', // 4px
  sm: 'gap-2', // 8px
  md: 'gap-4', // 16px
  lg: 'gap-6', // 24px
  xl: 'gap-8', // 32px
  '2xl': 'gap-10',
};

export const SHARED_JUSTIFY_CLASSES: Record<Justification, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export const SHARED_PADDING_CLASS: Record<SpacingToken, string> = {
  none: 'p-0',
  xs: 'p-2',   // 8px
  sm: 'p-3',   // 12px
  md: 'p-4',   // 16px
  lg: 'p-6',   // 24px
  xl: 'p-8'    // 32px
};

export const SHARED_ROUNDED_CLASS: Record<RoundedToken, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export const SHARED_SIZE_CLASSES: Record<SizeToken, { badge: string; control: string; iconButton: string; icon: string; text: string; }> = {
  xs: {
    badge: 'px-1.5 py-0.5 text-[10px] leading-none',
    control: 'px-2.5 py-1.5 text-xs',
    iconButton: 'p-1',
    icon: 'w-3 h-3',
    text: 'text-xs'
  },
  sm: {
    badge: 'px-2 py-0.5 text-xs',
    control: 'px-3 py-2 text-sm',
    iconButton: 'p-1.5',
    icon: 'w-4 h-4',
    text: 'text-sm'
  },
  md: {
    badge: 'px-2.5 py-1 text-sm',
    control: 'px-5 py-2.5 text-base',
    iconButton: 'p-2.5',
    icon: 'w-6 h-6',
    text: 'text-md'
  },
  lg: {
    badge: 'px-3 py-1.5 text-base',
    control: 'px-6 py-3 text-lg',
    iconButton: 'p-3',
    icon: 'w-8 h-8',
    text: 'text-lg'
  },
  xl: {
    badge: 'px-3.5 py-2 text-lg',
    control: 'px-7 py-3.5 text-xl',
    iconButton: 'p-3.5',
    icon: 'w-10 h-10',
    text: 'text-xl'
  },
  '2xl': {
    badge: 'px-4 py-2.5 text-xl',
    control: 'px-8 py-4 text-2xl',
    iconButton: 'p-4',
    icon: 'w-12 h-12',
    text: 'text-2xl'
  },
};

export const SHARED_SURFACE_CLASSES: Record<SurfaceToken, { bg: string; text: string; border: string }> = {
  base: {
    bg: 'bg-white',
    text: 'text-slate-900',
    border: 'border-slate-200/80',
  },
  subtle: {
    bg: 'bg-slate-50/80',
    text: 'text-slate-700',
    border: 'border-slate-200/60',
  },
  sunken: {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300/60',
  },
  transparent: {
    bg: 'bg-transparent',
    text: 'text-current',
    border: 'border-transparent',
  },
};

export const SHARED_VARIANT_CLASSES: Record<VariantToken, { bg: string; text: string; border?: string; hover?: string }> = {
  primary: {
    bg: 'bg-indigo-600',
    text: 'text-white',
    hover: 'hover:bg-indigo-700',
  },
  secondary: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200/60',
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
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/60',
    hover: 'hover:bg-rose-100',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/60',
    hover: 'hover:bg-blue-100',
  },
};