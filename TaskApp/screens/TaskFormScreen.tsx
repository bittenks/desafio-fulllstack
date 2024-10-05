// screens/TaskFormScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { createTask } from '../api/api';
import useAuth from '../hooks/useAuth'; // Importando o hook

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
      await createTask({ descricao, responsavel, status: 'pendente' }, token); 
      Alert.alert('Sucesso', 'Tarefa criada com sucesso.');
      navigation.navigate('TaskList');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar tarefa.');
    }
  };

  return (
    <View>
      <TextInput 
        placeholder="Descrição" 
        value={descricao} 
        onChangeText={setDescricao} 
      />
      <TextInput 
        placeholder="Responsável" 
        value={responsavel} 
        onChangeText={setResponsavel} 
      />
      <Button title="Criar Tarefa" onPress={handleCreateTask} />
    </View>
  );
};

export default TaskFormScreen;
