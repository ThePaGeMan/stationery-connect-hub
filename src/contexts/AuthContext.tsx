import { createContext, useContext, useEffect, useState } from "react";
import { type User, type LoginCredentials, type SignupCredentials, type AuthState } from "@/types/auth";

const DUMMY_USERS = [
  { id: "1", email: "admin@test.com", name: "Admin User", company_id: "1", role: "admin" as const },
  { id: "2", email: "user@test.com", name: "Regular User", company_id: "1", role: "user" as const },
];

const AuthContext = createContext<{
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem("user");
      }
    }
    
    setTimeout(() => {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }, 1000);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = DUMMY_USERS.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (credentials: SignupCredentials) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.email.split("@")[0],
      company_id: "1",
      role: "user",
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};