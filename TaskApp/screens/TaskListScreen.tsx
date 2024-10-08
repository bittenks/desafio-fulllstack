import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { getTasks, updateTask } from '../api/api';
import useAuth from '../hooks/useAuth';
import { Button, IconButton, Card, Title, Paragraph } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

const TaskListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('Todas');
  const { token } = useAuth();

  const fetchTasks = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getTasks(token);
      const taskList = response || [];
      setTasks(taskList);
      setFilteredTasks(taskList);
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

  // Função para definir o estilo do Card com base no status
  const getCardStyle = (status: string) => {
    return {
      backgroundColor: getBackgroundColor(status) || '',
      borderColor: getBorderColor(status) || '',
      borderRadius: 10,
      width: 150,
      marginTop: 15,
      height: 30,
      padding: 4,
      justifyContent: 'center',  // Centraliza verticalmente
      alignItems: 'center',  // Centraliza horizontalmente
      color: '#fff', // Texto branco para contraste
      fontWeight: 800,
      fontSize: 14, // Tamanho do texto ajustado para caber no card
      textAlign: 'center',
    };
  };

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'Não Iniciada':
        return '#fbbf24'; // amarelo
      case 'Em Andamento':
        return '#084c6c'; // azul escuro
      case 'Concluída':
        return '#10b981'; // verde
      default:
        return '#9ca3af'; // cinza para status desconhecido
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'Não Iniciada':
        return '#f59e0b';
      case 'Em Andamento':
        return '#083c5b';
      case 'Concluída':
        return '#0e9e72';
      default:
        return '#6b7280';
    }
  };


  const filterTasks = (status: string) => {
    const filtered = status === 'Todas' ? tasks : tasks.filter(task => task.status === status);
    setFilteredTasks(filtered);
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
        <Text style={styles.filterLabel}> Status:</Text>
        <Picker
          selectedValue={selectedStatus}
          style={styles.pickerFiltro}
          onValueChange={itemValue => setSelectedStatus(itemValue)}
          mode='dropdown'
        >
          <Picker.Item label="Todas" value="Todas" />
          <Picker.Item label="Não Iniciada" value="Não Iniciada" />
          <Picker.Item label="Em Andamento" value="Em Andamento" />
          <Picker.Item label="Concluída" value="Concluída" />
        </Picker>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <View style={styles.iconAndTextContainer}>
                  <Title style={styles.titleText}>{item.title}</Title>
                  <Text style={styles.detailsText}>
                    Descrição: {item.descricao}</Text>

                </View>
                <IconButton
                  onPress={() => navigation.navigate('Detalhes da tarefa', { taskId: item.id })}

                  icon={'arrow-top-right-thin-circle-outline'}
                  iconColor='#044c78'
                  style={styles.editButton}
                />
              </View>
              {/* <Paragraph style={styles.detailsText}>Criado por: {item.usuario.username}</Paragraph> */}
              <Paragraph style={styles.detailsText}>Responsável: {item.responsavel.username}</Paragraph>
            </Card.Content>
            <Card.Actions>

              <Text style={getCardStyle(item.status)}>
                {item.status}
              </Text>

            </Card.Actions>
          </Card >
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={< RefreshControl refreshing={refreshing} onRefresh={fetchTasks} />}
      />
      {tasks.length == 0 ?
        < Button
          mode="contained"
          onPress={() => navigation.navigate('Criar Tarefa')}
          disabled={loading}
          style={styles.createTaskButton}
          icon={'plus-box-outline'}
        >
          {loading ? <ActivityIndicator color="#ffffff" /> : 'Criar Tarefa'}
        </Button > :
        <IconButton
          onPress={() => navigation.navigate('Criar Tarefa')}
          icon={'plus-box-outline'}
          iconColor='#fff'
          style={styles.createTaskIconButton}
        />

      }
    </View >
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    fontFamily: 'Geologica', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    fontFamily: 'Geologica', 
  },
  iconAndTextContainer: {
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 0,
    flex: 1,
    color: '#333',
    fontFamily: 'Geologica', 
  },
  detailsText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#777',
    fontFamily: 'Geologica', 
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
    justifyContent: 'space-between',
    fontFamily: 'Geologica', 

    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    marginLeft: 10,
    fontFamily: 'Geologica', 

    color: '#333',
  },
  picker: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    fontFamily: 'Geologica', 
  },
  pickerFiltro: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    fontFamily: 'Geologica', 
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    fontFamily: 'Geologica', 
  },
  completedText: {
    color: '#28a745',
    fontWeight: 'bold',
    fontFamily: 'Geologica', 
  },
  createTaskButton: {
    backgroundColor: "#28a745",
    position: 'absolute',
    bottom: 16,
    fontWeight: 'bold',
    right: 16,
    borderRadius: 50,
    padding: 10,
    elevation: 3,
    fontFamily: 'Geologica', 
  },
  createTaskIconButton: {
    backgroundColor: "#28a745",
    position: 'absolute',
    bottom: 16,
    fontWeight: 'bold',
    right: 16,
    borderRadius: 50,
    fontFamily: 'Geologica-Bold', 
    elevation: 3,
  },
});

export default TaskListScreen;
