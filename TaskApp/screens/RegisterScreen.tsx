import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, Title } from 'react-native-paper';
import { registerUser } from '../api/api';

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    try {
      if (username && password) {
        await registerUser({ username, password });
        Alert.alert('Sucesso', 'Usuário registrado com sucesso.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Atenção', 'Usuário e senha são necessários');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar usuário.');
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
export default RegisterScreen;
