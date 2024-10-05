import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Alert } from 'react-native';
import { getTasks, updateTask } from '../api/api';
import useAuth from '../hooks/useAuth'; // Importando o hook de autenticação
import { Button, Divider } from 'react-native-paper'; // Usando o componente Button do react-native-paper
import { Picker } from '@react-native-picker/picker'; // Picker para seleção de status
import { AlertCircle, CheckCircle, Clock, EditIcon, PlusSquare, User } from 'lucide-react-native';

const TaskListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
  const { token } = useAuth(); // Obtendo o token do hook

  const fetchTasks = async () => {
    try {
      if (token) {
        const response = await getTasks(token);
        setTasks(response.data);
      }
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
      Alert.alert('Erro', 'Falha ao atualizar status da tarefa.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#044c78" />
        <Text>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={fetchTasks}
        style={styles.refreshButton}
        icon="refresh" 
      >
        Atualizar
      </Button>
      {tasks.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma tarefa ainda. Crie uma!</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.itemContainer}>
                {renderStatusIcon(item.status)}
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>{item.descricao}</Text>
                  <Text style={styles.descriptionText}><User color={'black'} size={2}/>{` ${item.responsavel}`}</Text>
                </View>
                <Button
                  mode="text" // Definindo o modo do botão
                  onPress={() => navigation.navigate('Detalhes da tarefa', { taskId: item.id })}
                  disabled={item.status === 'Concluída'}
                  style={styles.editButton}
                >
                  <EditIcon size={20} color="#044c78" /> {/* Definindo o tamanho e a cor do ícone */}
                </Button>
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
    backgroundColor: '#f5f5f5', // Cor de fundo suave
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#ffffff', // Fundo branco para cada item
    borderRadius: 4,
    marginBottom: 8,
    padding: 10,
    elevation: 1, // Sombra leve
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Espaçamento entre o picker e o botão
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Espalhar os itens para ocupar o espaço disponível
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
  },
  editButton: {
    width: 70, // Definindo uma largura fixa para o botão
    marginLeft: 10, // Espaçamento entre o texto e o botão
  },
  refreshButton: {
    backgroundColor: "#044c78",
    marginBottom: 14,
    marginLeft:12,
    marginRight:12,

    width:"auto"
  },
  createTaskButton: {
    backgroundColor: "#00be78",
    marginTop: 16,
  },
});

export default TaskListScreen;
