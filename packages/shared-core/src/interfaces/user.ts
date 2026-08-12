
export interface TokenInfo {
  token: string;
  tokenType: string;
  expiresIn: number;
  expiresAt?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  // Add any other necessary user fields here (e.g., email, roles)
}
