import { useState, useEffect } from "react"; 
import { AuthContext } from "./AuthContext";
import api from "../Services/api"; 

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data.data;

      localStorage.setItem("token", token); 
      localStorage.setItem("user", JSON.stringify(userData)); 
      
      setUser(userData); 
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;