interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export default AuthState;