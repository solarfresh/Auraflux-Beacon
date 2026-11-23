export interface LinkItem {
  label: string;
  iconName: string;
  route?: string;
  [key: string]: any;
}

export interface ActionDefinition {
  id: string;
  label: string;
  iconName: string;
  disabled?: boolean;
  onClick?: () => void;
}
