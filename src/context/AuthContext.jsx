import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trappe_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const registered = JSON.parse(localStorage.getItem('trappe_users') || '[]');
    const found = registered.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('trappe_user_session', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const signup = (name, email, password) => {
    const registered = JSON.parse(localStorage.getItem('trappe_users') || '[]');
    if (registered.find(u => u.email === email)) return false; // Fail if email exists

    const newUser = { name, email, password };
    registered.push(newUser);
    localStorage.setItem('trappe_users', JSON.stringify(registered));
    
    // Auto login securely after creating successfully
    setUser(newUser);
    localStorage.setItem('trappe_user_session', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trappe_user_session');
  };
  
  const updateName = (newName) => {
    if (user) {
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);
      localStorage.setItem('trappe_user_session', JSON.stringify(updatedUser));
      
      const registered = JSON.parse(localStorage.getItem('trappe_users') || '[]');
      const index = registered.findIndex(u => u.email === updatedUser.email);
      if (index !== -1) {
        registered[index].name = newName;
        localStorage.setItem('trappe_users', JSON.stringify(registered));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
