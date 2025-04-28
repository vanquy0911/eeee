import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types/User"; // Interface của user (bạn đã có)

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  // Khi component mount, kiểm tra lại localStorage (phòng trường hợp useState chưa đủ)
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    if (!token) {
      const storedToken = localStorage.getItem("token");
      if (storedToken) setToken(storedToken);
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const getToken = () => {
    return token || localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
