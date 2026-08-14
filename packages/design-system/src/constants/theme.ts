import type {
  Alignment,
  AttentionToken,
  AttentionPreset,
  BorderToken,
  ContainerSizeToken,
  FontWeightToken,
  GapSizeToken,
  IntentToken,
  Justification,
  RoundedToken,
  ComponentSizeToken,
  SpacingToken,
  SurfaceStyleMap
} from '@auraflux/design-system/interfaces/theme';

/**
 * Maps Attention Tokens to their default Intent and Surface combinations.
 */
export const ATTENTION_PRESET_MAP: Record<AttentionToken, AttentionPreset> = {
  primary: {
    intent: 'brand',
    surface: 'solid',
  },
  secondary: {
    intent: 'neutral',
    surface: 'outline',
  },
  tertiary: {
    intent: 'neutral',
    surface: 'ghost',
  },
};

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
  y: 'border-y',
  left: 'border-l',
  right: 'border-r',
  dashed: 'border-2 border-dashed',
  none: 'border-none'
};

/**
 * Shared Tailwind CSS class mappings for Container/Surface sizing.
 * Ensures consistent width and layout dimensions across all layout components.
 */
export const SHARED_CONTAINER_SIZE_CLASSES: Record<ContainerSizeToken, string> = {
  /** Small container (~384px) - Ideal for simple confirm dialogs and small popovers */
  sm: 'max-w-md w-full',

  /** Medium container (~672px) - Default size for standard forms and modal dialogs */
  md: 'max-w-2xl w-full',

  /** Large container (~896px) - Suitable for data tables or two-column forms */
  lg: 'max-w-4xl w-full',

  /** Extra-large container (~1152px) - Designed for dashboards and complex views */
  xl: 'max-w-6xl w-full',

  /** Full-screen container - Takes up near-viewport dimensions for immersive flows */
  full: 'max-w-[95vw] w-full h-[90vh]'
};

export const SHARED_FONT_WEIGHT_CLASSES: Record<FontWeightToken, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
};

export const SHARED_GAP_CLASSES: Record<GapSizeToken, string> = {
  none: 'gap-0',
  xs: 'gap-1', // 4px
  sm: 'gap-2', // 8px
  md: 'gap-4', // 16px
  lg: 'gap-6', // 24px
  xl: 'gap-8' // 32px
};

export const SHARED_JUSTIFY_CLASSES: Record<Justification, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export const SHARED_PADDING_CLASSES: Record<SpacingToken, string> = {
  none: 'p-0',
  xs: 'p-2',   // 8px
  sm: 'p-3',   // 12px
  md: 'p-4',   // 16px
  lg: 'p-6',   // 24px
  xl: 'p-8'    // 32px
};

export const SHARED_ROUNDED_CLASSES: Record<RoundedToken, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export const SHARED_COMPONENT_SIZE_CLASSES: Record<ComponentSizeToken, { badge: string; control: string; iconButton: string; icon: string; text: string; }> = {
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

export const SHARED_LENGTH_CLASSES: Record<
  ContainerSizeToken,
  { vertical: string; horizontal: string }
> = {
  sm: { vertical: 'h-4', horizontal: 'w-4' },
  md: { vertical: 'h-8', horizontal: 'w-8' },
  lg: { vertical: 'h-12', horizontal: 'w-12' },
  xl: { vertical: 'h-16', horizontal: 'w-16' },
  full: { vertical: 'h-full', horizontal: 'w-full' },
};

export const NEUTRAL_SURFACE_MAP: SurfaceStyleMap = {
  base: {
    bg: 'bg-transparent',
    text: 'text-slate-700',
    border: 'border-slate-700',
    hover: 'hover:bg-transparent',
    focus: 'focus-visible:ring-slate-400',
  },
  solid: {
    bg: 'bg-white',
    text: 'text-slate-700',
    border: 'border-slate-200',
    hover: 'hover:bg-slate-400',
    focus: 'focus-visible:ring-slate-400',
  },
  soft: {
    bg: 'bg-slate-100',
    text: 'text-slate-900',
    border: 'border-slate-200',
    hover: 'hover:bg-slate-200',
    focus: 'focus-visible:ring-slate-400',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-slate-600',
    border: 'border-slate-300',
    hover: 'hover:bg-slate-100',
    focus: 'focus-visible:ring-slate-400',
  },
  ghost: {
    bg: 'bg-transparent',
    text: 'text-slate-400',
    border: 'border-slate-200',
    hover: 'hover:bg-slate-100',
    focus: 'focus-visible:ring-slate-400',
  },
};

export const BRAND_SURFACE_MAP: SurfaceStyleMap = {
  base: {
    bg: 'bg-transparent',
    text: 'text-indigo-600',
    border: 'border-indigo-600',
    hover: 'hover:bg-transparent',
    focus: 'focus-visible:ring-indigo-500',
  },
  solid: {
    bg: 'bg-indigo-500',
    text: 'text-white',
    border: 'text-white',
    hover: 'hover:bg-indigo-600',
    focus: 'focus-visible:ring-indigo-500',
  },
  soft: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
    hover: 'hover:bg-indigo-100',
    focus: 'focus-visible:ring-indigo-500',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-indigo-600',
    border: 'border-indigo-300',
    hover: 'hover:bg-indigo-50',
    focus: 'focus-visible:ring-indigo-500',
  },
  ghost: {
    bg: 'bg-transparent',
    text: 'text-indigo-400',
    border: 'border-indigo-200',
    hover: 'hover:bg-indigo-50',
    focus: 'focus-visible:ring-indigo-500',
  },
};

export const SUCCESS_SURFACE_MAP: SurfaceStyleMap = {
  base: {
    bg: 'bg-transparent',
    text: 'text-emerald-600',
    border: 'border-emerald-600',
    hover: 'hover:bg-transparent',
    focus: 'focus-visible:ring-emerald-500',
  },
  solid: {
    bg: 'bg-emerald-500',
    text: 'text-white',
    border: 'text-white',
    hover: 'hover:bg-emerald-600',
    focus: 'focus-visible:ring-emerald-500',
  },
  soft: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    hover: 'hover:bg-emerald-100',
    focus: 'focus-visible:ring-emerald-500',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-emerald-600',
    border: 'border-emerald-300',
    hover: 'hover:bg-emerald-50',
    focus: 'focus-visible:ring-emerald-500',
  },
  ghost: {
    bg: 'bg-transparent',
    text: 'text-emerald-400',
    border: 'border-emerald-200',
    hover: 'hover:bg-emerald-50',
    focus: 'focus-visible:ring-emerald-500',
  },
};

export const WARNING_SURFACE_MAP: SurfaceStyleMap = {
  base: {
    bg: 'bg-transparent',
    text: 'text-amber-600',
    border: 'border-amber-600',
    hover: 'hover:bg-transparent',
    focus: 'focus-visible:ring-amber-500',
  },
  solid: {
    bg: 'bg-amber-500',
    text: 'text-white',
    border: 'text-white',
    hover: 'hover:bg-amber-600',
    focus: 'focus-visible:ring-amber-500',
  },
  soft: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-100',
    focus: 'focus-visible:ring-amber-500',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-amber-600',
    border: 'border-amber-300',
    hover: 'hover:bg-amber-50',
    focus: 'focus-visible:ring-amber-500',
  },
  ghost: {
    bg: 'bg-transparent',
    text: 'text-amber-400',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-50',
    focus: 'focus-visible:ring-amber-500',
  },
};

export const DANGER_SURFACE_MAP: SurfaceStyleMap = {
  base: {
    bg: 'bg-transparent',
    text: 'text-rose-600',
    border: 'border-rose-600',
    hover: 'hover:bg-transparent',
    focus: 'focus-visible:ring-rose-500',
  },
  solid: {
    bg: 'bg-rose-500',
    text: 'text-white',
    border: 'text-white',
    hover: 'hover:bg-rose-600',
    focus: 'focus-visible:ring-rose-500',
  },
  soft: {
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-200',
    hover: 'hover:bg-rose-100',
    focus: 'focus-visible:ring-rose-500',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-rose-600',
    border: 'border-rose-300',
    hover: 'hover:bg-rose-50',
    focus: 'focus-visible:ring-rose-500',
  },
  ghost: {
    bg: 'bg-transparent',
    text: 'text-rose-400',
    border: 'border-rose-200',
    hover: 'hover:bg-rose-50',
    focus: 'focus-visible:ring-rose-500',
  },
};

export const INFO_SURFACE_MAP: SurfaceStyleMap = {
  base: {
    bg: 'bg-transparent',
    text: 'text-sky-600',
    border: 'border border-sky-600',
    hover: 'hover:bg-transparent',
    focus: 'focus-visible:ring-sky-500',
  },
  solid: {
    bg: 'bg-sky-500',
    text: 'text-white',
    border: 'text-white',
    hover: 'hover:bg-sky-600',
    focus: 'focus-visible:ring-sky-500',
  },
  soft: {
    bg: 'bg-sky-50',
    text: 'text-sky-900',
    border: 'border border-sky-200',
    hover: 'hover:bg-sky-100',
    focus: 'focus-visible:ring-sky-500',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-sky-600',
    border: 'border border-sky-300',
    hover: 'hover:bg-sky-50',
    focus: 'focus-visible:ring-sky-500',
  },
  ghost: {
    bg: 'bg-transparent',
    text: 'text-sky-400',
    border: 'border border-sky-200',
    hover: 'hover:bg-sky-50',
    focus: 'focus-visible:ring-sky-500',
  },
};

export const SURFACE_STYLE_MAP: Record<IntentToken, SurfaceStyleMap> = {
  neutral: NEUTRAL_SURFACE_MAP,
  brand: BRAND_SURFACE_MAP,
  success: SUCCESS_SURFACE_MAP,
  warning: WARNING_SURFACE_MAP,
  danger: DANGER_SURFACE_MAP,
  info: INFO_SURFACE_MAP,
};
