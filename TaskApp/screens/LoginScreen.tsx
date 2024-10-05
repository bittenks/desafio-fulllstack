import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { loginUser } from '../api/api';
import useAuth from '../hooks/useAuth'; // Importando o hook

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { saveToken } = useAuth(); // Usando o hook de autenticação

  const handleLogin = async () => {
    try {
      const data = await loginUser({ username, password });
      await saveToken(data.access_token); // Armazena o token retornado
      navigation.navigate('TaskList');
    } catch (error) {
      Alert.alert('Erro', 'Usuário ou senha inválidos.');
    }
  };

  return (
    <View>
      <TextInput 
        placeholder="Usuário" 
        value={username} 
        onChangeText={setUsername} 
      />
      <TextInput 
        placeholder="Senha" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Registrar" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LoginScreen;
