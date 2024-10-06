import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, Title, Snackbar } from 'react-native-paper';
import { registerUser } from '../api/api';

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('#04c074'); // Default to success color

  const handleRegister = async () => {
    try {
      if (username && password) {
        await registerUser({ username, password });
        setSnackbarMessage('Usuário registrado com sucesso.');
        setSnackbarColor('#04c074'); // Success color
        setSnackbarVisible(true);
        navigation.navigate('Login');
      } else {
        setSnackbarMessage('Usuário e senha são necessários');
        setSnackbarColor('#B00020'); // Error color
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage('Falha ao registrar usuário.');
      setSnackbarColor('#B00020'); // Error color
      setSnackbarVisible(true);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Title style={styles.title}>Registrar</Title>
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
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
    color: '#044c78',
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

export default RegisterScreen;
