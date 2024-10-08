import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, Title, Snackbar, Text } from 'react-native-paper';
import { registerUser } from '../api/api';


import logo from '../images/logo_tech.png';

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('#04c074');

  const handleRegister = async () => {
    try {
      if (username && password) {
        await registerUser({ username, password });
        setTimeout(() => navigation.navigate('Login'), 2000);
      } else {
        setSnackbarMessage('Usuário e senha são necessários');
        setSnackbarColor('#B00020');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error(error)
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
        <Title style={styles.title}>Registrar</Title>
        <Text style={styles.subtitle}>Crie sua conta para gerenciar suas tarefas.</Text>

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
        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Registrar
        </Button>
        <Button mode="text" textColor='#044c78' onPress={() => navigation.navigate('Login')}>
          Já tem uma conta? Faça login
        </Button>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={{ backgroundColor: snackbarColor }}
        >
          {snackbarMessage}
        </Snackbar>
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
    marginBottom: 8,
    fontSize: 24,
    color: '#044c78',
    fontFamily: 'Geologica-Bold', 
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    color: '#555',
    fontFamily: 'Geologica', 
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  button: {
    marginBottom: 12,
    backgroundColor: "#04c074"
  },
  registerButton: {
    fontFamily: 'Geologica', 
    color: "#044c78",
    alignSelf: 'center',
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

export default RegisterScreen;
