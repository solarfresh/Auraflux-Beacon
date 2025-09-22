type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'danger-outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
}
