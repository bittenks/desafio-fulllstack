import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, Card, Provider as PaperProvider } from 'react-native-paper';
import { getTaskById } from '../api/api';

const TaskDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<any>(null);
  const token = 'seu_token_aqui'; 

  const fetchTaskDetails = async () => {
    try {
      const response = await getTaskById(taskId, token);
      setTask(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  if (!task) {
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
            <Text style={styles.text}>{task.descricao}</Text>
            <Text style={styles.label}>Responsável:</Text>
            <Text style={styles.text}>{task.responsavel}</Text>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.text}>{task.status}</Text>
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
});

export default TaskDetailScreen;
