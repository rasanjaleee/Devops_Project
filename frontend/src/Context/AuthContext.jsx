import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user and token from localStorage safely on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedUser !== "undefined" && storedToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Login function
  const login = (user, token) => {
    setCurrentUser(user);
    setToken(token);

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setToken(null);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Update user info
  const updateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user: currentUser,
    token,
    login,
    logout,
    updateUser,
    isAdmin: currentUser?.role?.toUpperCase() === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
