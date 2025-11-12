import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

//created a custom hook called useAuth
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); 
  const [token, setToken] = useState(null);


  //If we refresh the page the user stays logged in.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (user, token) => {
    setCurrentUser(user);
    setToken(token);
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

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
    isAdmin: currentUser?.role?.toUpperCase() === 'ADMIN' 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}