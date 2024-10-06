import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, Title, ActivityIndicator } from 'react-native-paper';
import { loginUser } from '../api/api';
import useAuth from '../hooks/useAuth'; 

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { saveToken } = useAuth(); 
  const [loading, setLoading] = useState<boolean>(false); 
  const handleLogin = async () => {
    setLoading(true); 
    try {
      const data = await loginUser({ username, password });
      await saveToken(data.access_token); // Armazena o token retornado
      navigation.navigate('Lista de Tarefas');
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false); 
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
        <Button mode="text" textColor='#044c78' onPress={() => navigation.navigate('Cadastro')} style={styles.registerButton}>
          Registrar
        </Button>
      </View>
    </PaperProvider>
  );
};
// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5', 
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
    color: '#044c78', // Cor do título
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginBottom: 12,
    backgroundColor:"#04c074"
  },
  registerButton: {
    color:"#044c78",
    alignSelf: 'center', 
  },
});

// Tema para os inputs
const inputTheme = {
  colors: {
    primary: '#044c78', // Cor primária
    placeholder: '#6200ee', // Cor do placeholder
    text: '#000', // Cor do texto
    error: '#B00020', // Cor do erro
  },
};

export default LoginScreen;