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
      await saveToken(data.access_token);
      navigation.navigate('Lista de Tarefas');
    } catch (error) {
      console.log(error);
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
          disabled={loading}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Geologica-Bold',
    marginBottom: 8,
    fontSize: 24,
    color: '#044c78',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    fontFamily: 'Geologica',
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 12,
    fontFamily: 'Geologica',
  },
  button: {
    marginBottom: 12,
    backgroundColor: "#04c074",
    fontFamily: 'Geologica',
  },
  registerButton: {
    color: "#044c78",
    alignSelf: 'center',
    fontFamily: 'Geologica',
  },
});

const inputTheme = {
  colors: {
    primary: '#044c78',
    placeholder: '#6200ee',
    text: '#000',
    error: '#B00020',
  },
};

export default LoginScreen;
