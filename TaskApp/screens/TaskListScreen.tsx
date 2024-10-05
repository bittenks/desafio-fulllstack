import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, Title, ActivityIndicator } from 'react-native-paper';
import { loginUser } from '../api/api';
import useAuth from '../hooks/useAuth'; // Importando o hook de autenticação

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Estado de loading
  const { saveToken } = useAuth(); // Usando o hook de autenticação

  const handleLogin = async () => {
    setLoading(true); // Ativando o loading
    try {
      const response = await loginUser({ username, password });
      await saveToken(response.token); // Armazena o token recebido
      navigation.navigate('TaskList');
    } catch (error) {
      Alert.alert('Erro', 'Usuário ou senha inválidos.');
    } finally {
      setLoading(false); // Desativando o loading
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Title style={styles.title}>Login</Title>
        <TextInput
          label="Usuário"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
          theme={inputTheme}
        />
        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          theme={inputTheme}
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          disabled={loading} // Desabilita o botão enquanto está carregando
        >
          {loading ? <ActivityIndicator color="#ffffff" /> : 'Login'}
        </Button>
        <Button mode="text" onPress={() => navigation.navigate('Register')} style={styles.registerButton}>
          Registrar
        </Button>
      </View>
    </PaperProvider>
  );
}

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5', // Cor de fundo suave
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
    color: '#6200ee', // Cor do título
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginBottom: 12,
  },
  registerButton: {
    alignSelf: 'center', // Centraliza o botão de registro
  },
});

// Tema para os inputs
const inputTheme = {
  colors: {
    primary: '#6200ee', // Cor primária
    placeholder: '#6200ee', // Cor do placeholder
    text: '#000', // Cor do texto
    error: '#B00020', // Cor do erro
  },
};

export default LoginScreen;
