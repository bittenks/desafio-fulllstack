import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { registerUser } from '../api/api';

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    try {
      if(username || password) {

        await registerUser({ username, password });
      }
      else{
      Alert.alert('Atenção', 'Usuaário e senha são necessários');

      }
      Alert.alert('Sucesso', 'Usuário registrado com sucesso.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar usuário.');
    }
  };

  return (
    <View>
      <TextInput placeholder="Usuário" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
