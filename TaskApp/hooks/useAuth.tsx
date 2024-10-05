// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  const saveToken = async (token: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setToken(token);
  };

  const clearToken = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
    setToken(storedToken);
  };

  useEffect(() => {
    loadToken();
  }, []);

  return { token, saveToken, clearToken };
};

export default useAuth;
