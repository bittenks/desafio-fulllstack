import { useState, useEffect } from 'react';

const TOKEN_KEY = 'authToken';
const USERNAME_KEY = 'username';

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const saveToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setToken(token);
  };

  const saveUsername = (username: string) => {
    localStorage.setItem(USERNAME_KEY, username);
    setUsername(username);
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setUsername(null);
  };

  const loadToken = () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    setToken(storedToken);
  };

  const loadUsername = () => {
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    setUsername(storedUsername);
  };

  useEffect(() => {
    loadToken();
    loadUsername();
  }, []);

  return { token, username, saveToken, saveUsername, clearAuth };
};

export default useAuth;
