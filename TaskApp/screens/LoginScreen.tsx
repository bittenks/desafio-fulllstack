import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Provider as PaperProvider } from 'react-native-paper';
import { loginUser } from '../api/api';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await loginUser({ username, password });
      navigation.navigate('TaskList');
    } catch (error) {
      Alert.alert('Erro', 'Usuário ou senha inválidos.');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TextInput
          label="Usuário"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>
        <Button mode="text" onPress={() => navigation.navigate('Register')}>
          Registrar
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5', // Cor de fundo suave
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginBottom: 12,
  },
});

export default LoginScreen;
