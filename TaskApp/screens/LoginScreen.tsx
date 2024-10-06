import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, Title, ActivityIndicator, Text } from 'react-native-paper';
import { loginUser } from '../api/api';
import useAuth from '../hooks/useAuth';
import logo from '../images/logo_tech.png'
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
      console.log(error);
      Alert.alert('Erro', 'Usuário ou senha inválidos. Tente novamente.'); // Exibe um alerta em caso de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <Title style={styles.title}>Bem-vindo(a) ao Gerenciador de Tarefas!</Title>
        <Text style={styles.subtitle}>Faça login para começar a organizar suas tarefas.</Text>

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
  logo: {
    width: 150, // Largura da imagem
    height: 150, // Altura da imagem
    alignSelf: 'center', // Centraliza a imagem
    marginBottom: 16, // Espaço entre a imagem e o título
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
    color: '#044c78', // Cor do título
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    color: '#555', // Cor do subtítulo
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginBottom: 12,
    backgroundColor: "#04c074"
  },
  registerButton: {
    color: "#044c78",
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
