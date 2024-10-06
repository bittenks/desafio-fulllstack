import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button,  Title } from 'react-native-paper';
import { createTask } from '../api/api';
import useAuth from '../hooks/useAuth'; 

const TaskFormScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const { token } = useAuth(); 

  const handleCreateTask = async () => {
    if (!token) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      await createTask({ descricao, responsavel, status: 'Não Iniciada' }, token); 
      setTimeout(() => {
        navigation.navigate('Lista de Tarefas'); 
      }, 1000);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar tarefa.');
    }
  };


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

  
    </View>
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


const inputTheme = {
  colors: {
    primary: '#044c78', 
    placeholder: '#6200ee', 
    text: '#000', 
    error: '#B00020', 
  },
};


export default TaskFormScreen;
