export interface IntentOption {
  id: string;
  label: string;
  icon: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  // Add any other necessary user fields here (e.g., email, roles)
}
