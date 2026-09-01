<template>
  <input
    :id="id"
    type="range"
    :value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :style="sliderStyle"
    :class="[
      // 1. Base Reset
      'v-slider w-full cursor-pointer appearance-none bg-transparent outline-none transition-all duration-150',

      surfaceStyle.text,
      surfaceStyle.focus,

      // 3. Disabled State
      disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
    ]"
    @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
  />
</template>

<script setup lang="ts">
import { computed, type StyleValue } from 'vue';
import type {
  AttentionToken,
  ComponentSizeToken,
  IntentToken,
  SurfaceToken
} from '@auraflux/design-system/interfaces/theme';
import { SHARED_SLIDER_SIZE_CLASSES } from '@auraflux/design-system/constants/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

export interface VSliderProps {
  id?: string;
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: ComponentSizeToken;
  attention?: AttentionToken;
  intent?: IntentToken;
  surface?: SurfaceToken;
  disabled?: boolean;
}

const props = withDefaults(defineProps<VSliderProps>(), {
  id: undefined,
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  size: 'md',
  attention: 'secondary',
  disabled: false,
});

defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const surfaceStyle = computed(() => {
  return resolveSurfaceStyle(props.attention, props.intent, props.surface);
});

// 計算目前滑動進度百分比，供 Webkit/Firefox 渲染動態 fill progress (選用)
const progressPercent = computed(() => {
  const range = props.max - props.min;
  if (range <= 0) return 0;
  return Math.min(100, Math.max(0, ((props.modelValue - props.min) / range) * 100));
});

const sliderStyle = computed<StyleValue>(() => {
  const sizeConfig = SHARED_SLIDER_SIZE_CLASSES[props.size] || SHARED_SLIDER_SIZE_CLASSES.md;

  return {
    '--slider-track-height': sizeConfig.trackHeight,
    '--slider-thumb-size': sizeConfig.thumbSize,
    '--slider-thumb-margin-top': sizeConfig.thumbMarginTop,
    '--slider-progress': `${progressPercent.value}%`,
  };
});
</script>

<style scoped>
/* === Webkit (Chrome, Safari, Edge) === */
.v-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: var(--slider-track-height);
  background: linear-gradient(
    to right,
    currentColor 0%,
    currentColor var(--slider-progress),
    rgb(226 232 240 / 0.6) var(--slider-progress),
    rgb(226 232 240 / 0.6) 100%
  );
  border-radius: 9999px;
}

.v-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: var(--slider-thumb-size);
  height: var(--slider-thumb-size);
  background-color: currentColor;
  border-radius: 9999px;
  margin-top: var(--slider-thumb-margin-top);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.2);
  transition: background-color 150ms ease-in-out, transform 100ms ease-in-out;
}

.v-slider::-moz-range-track {
  width: 100%;
  height: var(--slider-track-height);
  background: linear-gradient(
    to right,
    currentColor 0%,
    currentColor var(--slider-progress),
    rgb(226 232 240 / 0.6) var(--slider-progress),
    rgb(226 232 240 / 0.6) 100%
  );
  border-radius: 9999px;
}

.v-slider::-moz-range-thumb {
  appearance: none;
  width: var(--slider-thumb-size);
  height: var(--slider-thumb-size);
  background-color: currentColor;
  border-radius: 9999px;
  border: 0;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.2);
  transition: background-color 150ms ease-in-out;
}

@media (prefers-color-scheme: dark) {
  .v-slider::-webkit-slider-runnable-track,
  .v-slider::-moz-range-track {
    background: linear-gradient(
      to right,
      currentColor 0%,
      currentColor var(--slider-progress),
      rgb(51 65 85 / 0.6) var(--slider-progress),
      rgb(51 65 85 / 0.6) 100%
    );
  }
}

/* Disabled Overrides */
.v-slider:disabled::-webkit-slider-thumb,
.v-slider:disabled::-moz-range-thumb {
  background-color: #94a3b8 !important;
}
</style>