import type { VariantToken, SizeToken } from '@auraflux/design-system/interfaces/theme';

export interface VButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: VariantToken;
  size?: SizeToken;
  iconName?: string;
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
}
