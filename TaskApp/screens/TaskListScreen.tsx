import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { getTasks, updateTask } from '../api/api';
import useAuth from '../hooks/useAuth';
import { Button, Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const TaskListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('Todas');
  const { token } = useAuth();

  const fetchTasks = async () => {
    try {
      if (token) {
        setLoading(true);
        const response = await getTasks(token);
        setTasks(response.data);
        setFilteredTasks(response.data); // Inicialmente, mostrar todas as tarefas
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao carregar tarefas.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  useEffect(() => {
    filterTasks(selectedStatus);
  }, [tasks, selectedStatus]);

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'Não Iniciada' || 'Não iniciada':
        return <AlertCircle size={24} color="orange" />;
      case 'Em Andamento':
        return <Clock size={24} color="blue" />;
      case 'Concluída':
        return <CheckCircle size={24} color="green" />;
      default:
        return null;
    }
  };

  const handleUpdateStatus = async (itemId: number, newStatus: string) => {
    try {
      await updateTask(itemId, { status: newStatus }, token);
      fetchTasks(); // Atualiza a lista após a edição
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao atualizar status da tarefa.',
      });
    }
  };

  const filterTasks = (status: string) => {
    if (status === 'Todas') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.status === status);
      setFilteredTasks(filtered);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#044c78" />
        <Text>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por Status:</Text>
        <Picker
          selectedValue={selectedStatus}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSelectedStatus(itemValue);
          }}
        >
          <Picker.Item label="Todas" value="Todas" />
          <Picker.Item label="Não Iniciada" value="Não Iniciada" />
          <Picker.Item label="Em Andamento" value="Em Andamento" />
          <Picker.Item label="Concluída" value="Concluída" />
        </Picker>
      </View>
      {filteredTasks.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma tarefa encontrada para o status selecionado.</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.itemContainer}>
                <View style={styles.textContainer}>
                  {/* Ícone ao lado da descrição */}
                  <View style={styles.header}>

                    <View style={styles.iconAndTextContainer}>
                      {renderStatusIcon(item.status)}
                      <Text style={styles.titleText}>{item.descricao}</Text>
                    </View>
                    <Button
                      mode="text"
                      onPress={() => navigation.navigate('Detalhes da tarefa', { taskId: item.id })}
                      disabled={item.status === 'Concluída'}
                      icon={'square-edit-outline'}
                      textColor='#044c78'
                      style={styles.editButton}
                      children
                    />
                  </View>

                  <Button
                    mode="text"
                    icon={'account'}
                    textColor='#044c78'
                    style={styles.responsavelButton}
                  >
                    {item.responsavel}
                  </Button>
                </View>

              </View>
              <View style={styles.statusContainer}>
                <Picker
                  selectedValue={item.status}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleUpdateStatus(item.id, itemValue)}
                >
                  <Picker.Item label="Não Iniciada" value="Não Iniciada" />
                  <Picker.Item label="Em Andamento" value="Em Andamento" />
                  <Picker.Item label="Concluída" value="Concluída" />
                </Picker>
              </View>
              <Divider />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchTasks} />
          }
        />
      )}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Criar Tarefa')}
        disabled={loading}
        style={styles.createTaskButton}
        icon={'plus-box-outline'}
      >
        {loading ? <ActivityIndicator color="#ffffff" /> : 'Criar Tarefa'}
      </Button>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',           
    justifyContent: 'space-between',
    alignItems: 'center',           
    marginBottom: 10,               
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  picker: {
    flex: 1,
  },
  emptyMessage: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    color: '#888',
  },
  listItem: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    marginBottom: 8,
    padding: 10,
    elevation: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  iconAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8, // Adicionando espaço entre ícone e texto
  },
  responsavelButton: {
    alignSelf: 'flex-start', // Alinhando à esquerda
    paddingVertical: 0, // Reduzindo padding vertical
    width: 24
  },
  editButton: {


  },
  createTaskButton: {
    backgroundColor: "#00be78",
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 50,
  },
});

export default TaskListScreen;
