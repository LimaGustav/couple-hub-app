export interface User {
  id: string;
  email: string;
  name: string;
  coupleId: string | null;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  username: string;
  birthday: string;
  password: string;
}

export interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  coupleId?: string;
  exp: number;
}
