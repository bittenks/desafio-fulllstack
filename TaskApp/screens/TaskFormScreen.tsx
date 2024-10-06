import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Appbar, Snackbar, Title } from 'react-native-paper';
import { createTask } from '../api/api';
import useAuth from '../hooks/useAuth'; // Importando o hook

const TaskFormScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const { token } = useAuth(); 
  const [snackbarVisible, setSnackbarVisible] = useState(false); // Snackbar para feedback

  const handleCreateTask = async () => {
    if (!token) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      await createTask({ descricao, responsavel, status: 'Não iniciada' }, token); 
      setSnackbarVisible(true); // Mostra o Snackbar ao criar a tarefa
      setTimeout(() => {
        navigation.navigate('Lista de Tarefas'); // Navega após um tempo
      }, 1000);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar tarefa.');
    }
  };

  const hideSnackbar = () => setSnackbarVisible(false); // Função para ocultar o Snackbar

  return (
    <View style={styles.container}>
       <Title style={styles.title}>Nova Tarefa</Title>
      <TextInput 
        label="Descrição" 
        value={descricao} 
        onChangeText={setDescricao} 
        style={styles.input} 
        mode="outlined" 
        theme={inputTheme}
      />
      
      <TextInput 
        label="Responsável" 
        value={responsavel} 
        onChangeText={setResponsavel} 
        style={styles.input} 
        mode="outlined" 
        theme={inputTheme}
      />
      
      <Button 
        mode="contained" 
        onPress={handleCreateTask} 
        style={styles.button}
        icon={'plus-box-outline'}
      >
        Criar Tarefa
      </Button>

  
      <Snackbar
        visible={snackbarVisible}
        onDismiss={hideSnackbar}
        duration={1000}
        action={{
          label: 'Fechar',
          onPress: hideSnackbar, 
        }}
      >
        Tarefa criada com sucesso!
      </Snackbar>
    </View>
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
    borderColor:"#044c78"
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


export default TaskFormScreen;
