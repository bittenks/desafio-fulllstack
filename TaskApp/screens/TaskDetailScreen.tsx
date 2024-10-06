import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, } from 'react-native';
import { Text, Button, Card, TextInput, Provider as PaperProvider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { getTaskById, updateTask, deleteTask } from '../api/api';
import useAuth from '../hooks/useAuth';
import { IconButton } from 'react-native-paper';

const TaskDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [responsavel, setResponsavel] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const { token } = useAuth();

  const fetchTaskDetails = async () => {
    if (token && taskId) {

      try {
        const response = await getTaskById(taskId, token);
        setTask(response);
        setResponsavel(response.responsavel);
        setStatus(response.status);
        setDescricao(response.descricao);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateTask = async () => {
    if (token) {
      try {
        await updateTask(taskId, { ...task, descricao, responsavel, status }, token);
        fetchTaskDetails();
        navigation.navigate('Lista de Tarefas');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteTask = async () => {
    if (token) {
      try {
        await deleteTask(taskId, token);
        navigation.navigate('Lista de Tarefas');
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#044c78" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>

              <Text style={styles.title}>Detalhes da Tarefa</Text>
              <IconButton
                icon="trash-can"
                iconColor={"#ff0000"}
                size={24}
                onPress={handleDeleteTask}
              />
            </View>
            <TextInput
              style={styles.input}
              value={descricao}
              onChangeText={setDescricao}
              mode="outlined"
              label={'Decrição'}
              theme={inputTheme}
            />

            <TextInput
              style={styles.input}
              value={responsavel}
              onChangeText={setResponsavel}
              label={'Responsável'}
              theme={inputTheme}
              mode="outlined"

            />
           
            <Text style={styles.label}>Status:</Text>
            <Picker
              selectedValue={status}
              style={styles.picker}
              onValueChange={(itemValue) => setStatus(itemValue)}
              mode='dropdown'
            >
              <Picker.Item label="Não Iniciada" value="Não Iniciada" />
              <Picker.Item label="Em Andamento" value="Em Andamento" />
              <Picker.Item label="Concluída" value="Concluída" />
            </Picker>

            <Button mode="contained" icon={'update'} onPress={handleUpdateTask} style={styles.updateButton}>
              Atualizar Tarefa
            </Button>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
};
const inputTheme = {
  colors: {
    primary: '#044c78', 
    placeholder: '#6200ee', 
    text: '#000',
    error: '#B00020', 
  },
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  input: {
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
    borderRadius: 50,
  },
  updateButton: {
    marginTop: 12,
    backgroundColor: "#04c074",
  },

});

export default TaskDetailScreen;
