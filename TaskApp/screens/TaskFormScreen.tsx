// screens/TaskFormScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, Title } from 'react-native-paper';
import { createTask } from '../api/api';

const TaskFormScreen = ({ navigation }: { navigation: any }) => {
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const token = 'seu_token_aqui'; 

  const handleCreateTask = async () => {
    try {
      if (descricao && responsavel) {
        await createTask({ descricao, responsavel, status: 'pendente' }, token);
        Alert.alert('Sucesso', 'Tarefa criada com sucesso.');
        navigation.navigate('TaskList');
      } else {
        Alert.alert('Atenção', 'Descrição e responsável são necessários.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar tarefa.');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Title style={styles.title}>Criar Tarefa</Title>
        <TextInput
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Responsável"
          value={responsavel}
          onChangeText={setResponsavel}
          style={styles.input}
          mode="outlined"
        />
        <Button mode="contained" onPress={handleCreateTask} style={styles.button}>
          Criar Tarefa
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
    backgroundColor: '#f5f5f5', // Cor de fundo suave
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    textAlign: 'center',
    marginBottom: 12,

  },
});

export default TaskFormScreen;
