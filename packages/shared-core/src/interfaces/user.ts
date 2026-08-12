
export interface TokenInfo {
  token: string;
  token_type?: string;
  exp?: number;
  iat?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  // Add any other necessary user fields here (e.g., email, roles)
}
