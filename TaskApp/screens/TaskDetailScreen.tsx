import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Text, Button, Card, Provider as PaperProvider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; // Importando o Picker aqui
import { getTaskById, updateTask } from '../api/api';
import useAuth from '../hooks/useAuth';

const TaskDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [responsavel, setResponsavel] = useState<string>(''); // Para o responsável
  const [status, setStatus] = useState<string>(''); // Para o status
  const { token } = useAuth();

  const fetchTaskDetails = async () => {
    if (token) {
      try {
        const response = await getTaskById(taskId, token);
        setTask(response);
        setResponsavel(response.responsavel);
        setStatus(response.status);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  }

  const handleUpdateTask = async () => {
    try {
      await updateTask(taskId, { ...task, responsavel, status }, token);
      Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
      fetchTaskDetails(); // Atualiza os detalhes da tarefa após a atualização
    } catch (error) {
      console.error(error);

    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.backButton}>
          Voltar
        </Button>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Detalhes da Tarefa</Text>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.text}>{task?.descricao}</Text>

            {/* Campo para editar o responsável */}
            <Text style={styles.label}>Responsável:</Text>
            <TextInput
              style={styles.input}
              value={responsavel}
              onChangeText={setResponsavel}
            />

            {/* Seletor para editar o status */}
            <Text style={styles.label}>Status:</Text>
            <Picker
              selectedValue={status}
              style={styles.picker}
              onValueChange={(itemValue) => setStatus(itemValue)}
            >
              <Picker.Item label="Não Iniciada" value="Não Iniciada" />
              <Picker.Item label="Em Andamento" value="Em Andamento" />
              <Picker.Item label="Concluída" value="Concluída" />
            </Picker>

            <Button mode="contained" onPress={handleUpdateTask} style={styles.updateButton}>
              Atualizar Tarefa
            </Button>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  backButton: {
    marginBottom: 16,
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
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  updateButton: {
    marginTop: 12,
    backgroundColor:"#04c074"
  },
});

export default TaskDetailScreen;
