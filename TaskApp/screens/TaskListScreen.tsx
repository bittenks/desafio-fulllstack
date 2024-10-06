import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { getTasks, updateTask } from '../api/api';
import useAuth from '../hooks/useAuth';
import { Button, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react-native';
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
        setFilteredTasks(response.data); // Initially show all tasks
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
      case 'Não Iniciada':
      case 'Não iniciada':
        return <AlertCircle size={24} color="orange" />;
      case 'Em Andamento':
        return <Clock size={24} color="#044c78" />;
      case 'Concluída':
        return <CheckCircle size={24} color="green" />;
      default:
        return null;
    }
  };

  const handleUpdateStatus = async (itemId: number, newStatus: string) => {
    try {
      await updateTask(itemId, { status: newStatus }, token);
      fetchTasks(); // Refetch tasks after updating
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
        <Text style={styles.filterLabel}>
          Filtrar por Status:
        </Text>
        <Picker
          selectedValue={selectedStatus}
          style={styles.pickerFiltro}
          onValueChange={(itemValue) => setSelectedStatus(itemValue)}
          mode='dropdown' 
        >
          <Picker.Item label="Todas" value="Todas" />
          <Picker.Item label="Não Iniciada" value="Não Iniciada" />
          <Picker.Item label="Em Andamento" value="Em Andamento" />
          <Picker.Item label="Concluída" value="Concluída" />
        </Picker>
      </View>

      {filteredTasks.length === 0 ? (
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchTasks} />
        }>
          <Text style={styles.emptyMessage}>
            Nenhuma tarefa encontrada para o status selecionado.
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.itemContainer}>
                <View style={styles.textContainer}>
                  <View style={styles.header}>
                    <View style={styles.iconAndTextContainer}>
                      {renderStatusIcon(item.status)}
                      <Text style={styles.titleText} numberOfLines={2}>{item.descricao}</Text>
                    </View>
                    <IconButton
                      onPress={() => navigation.navigate('Detalhes da tarefa', { taskId: item.id })}
                      disabled={item.status === 'Concluída'}
                      icon={'square-edit-outline'}
                      iconColor='#044c78'
                      style={styles.editButton}
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
                {item.status !== 'Concluída' ?
                  <Picker
                    selectedValue={item.status}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleUpdateStatus(item.id, itemValue)}
                    mode='dropdown'
                  >
                    <Picker.Item label="Não Iniciada" value="Não Iniciada" />
                    <Picker.Item label="Em Andamento" value="Em Andamento" />
                    <Picker.Item label="Concluída" value="Concluída" />
                  </Picker> : <Text>   {item.status}</Text>}
              </View>
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

// Styles
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

  iconAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },

  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
    maxWidth: '80%',
  },

  editButton: {
    alignSelf: 'flex-end',
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
    width: '80%',
    height: 50,
    alignSelf: 'center'
  },
  pickerFiltro: {
    width: '60%',
    height: 50,
    alignSelf: 'center'
  },
  emptyMessage: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,

    color: '#888',
  },
  listItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 8,
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

  responsavelButton: {
    alignSelf: 'flex-start',
    paddingVertical: 0,
    width: 'auto',
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
