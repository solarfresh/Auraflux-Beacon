import type { IntentToken, SurfaceToken, AttentionToken, SurfaceStyle } from '@auraflux/design-system/interfaces/theme';
import { ATTENTION_PRESET_MAP, SURFACE_STYLE_MAP} from '@auraflux/design-system/constants/theme';

/**
 * Resolves the final SurfaceStyle by applying explicit Intent/Surface overrides
 * over the defaulted Attention presets.
 */
export function resolveSurfaceStyle(
  attention: AttentionToken = 'primary',
  intent?: IntentToken,
  surface?: SurfaceToken
): SurfaceStyle {
// Get default fallback preset based on attention level
  const preset = ATTENTION_PRESET_MAP[attention] || ATTENTION_PRESET_MAP.primary;

  // Determine final Intent & Surface (explicit arguments override preset fallbacks)
  const finalIntent = intent ?? preset.intent;
  const finalSurface = surface ?? preset.surface;

  // Direct O(1) lookup from static mapping table
  return SURFACE_STYLE_MAP[finalIntent][finalSurface];
}