import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Button, Alert } from 'react-native';
import { getTasks } from '../api/api';
import useAuth from '../hooks/useAuth'; // Importando o hook de autenticação
import { List } from 'react-native-paper'; // Usando o componente List do react-native-paper
import Icon from 'react-native-vector-icons/Ionicons'; // Importando ícones

const TaskListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
  const { token } = useAuth(); // Obtendo o token do hook

  const fetchTasks = async () => {
    try {
      const response = await getTasks(token || '');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Desativando o loading após a requisição
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'Não Iniciada':
        return <Icon name="hourglass-outline" size={24} color="orange" />;
      case 'Em Andamento':
        return <Icon name="play-outline" size={24} color="blue" />;
      case 'Concluída':
        return <Icon name="checkmark-circle-outline" size={24} color="green" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma tarefa ainda. Crie uma!</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <List.Item
              title={item.descricao}
              description={
                <Text style={styles.descriptionText}>
                  {`Responsável: ${item.responsavel}`}
                </Text>
              }
              onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })} // Navegar para a tela de detalhes da tarefa
              style={styles.listItem}
              right={() => (
                <View style={styles.statusContainer}>
                  {renderStatusIcon(item.status)}
                  <Text style={styles.statusText}>{item.status}</Text>
                  <Button
                    title="Editar"
                    onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })} // Navegar para a tela de detalhes da tarefa ao clicar em Editar
                    disabled={item.status === 'Concluída'} // Desabilitar se o status for concluído
                  />
                </View>
              )}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Button title="Criar Tarefa" onPress={() => navigation.navigate('TaskForm')} />
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Cor de fundo suave
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    color: '#888',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
  },
  listItem: {
    marginBottom: 8,
    backgroundColor: '#ffffff', // Fundo branco para cada item
    borderRadius: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginHorizontal: 8,
  },
});

export default TaskListScreen;
