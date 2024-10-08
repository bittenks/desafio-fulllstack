import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, Button, Card, TextInput, Provider as PaperProvider, Title } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { getTaskById, updateTask, deleteTask, getUsers } from '../api/api';
import useAuth from '../hooks/useAuth';
import { IconButton } from 'react-native-paper';

const TaskDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [responsavel, setResponsavel] = useState<string>('');
  const [criadoPor, setCriadoPor] = useState<string>('');
  const [responsavelName, setResponsavelName] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [titulo, setTitulo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [statusTask, setStatusTask] = useState<string>('');

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const { token } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    if (token && taskId) {
      try {
        const [taskResponse, usersResponse] = await Promise.all([
          getTaskById(taskId, token),
          getUsers(),
        ]);


        if (taskResponse) {
          setTask(taskResponse);
          setResponsavel(taskResponse.responsavel?.id || '');
          setResponsavelName(taskResponse.responsavel?.username || '');
          setCriadoPor(taskResponse.usuario?.username || '');
          setStatusTask(taskResponse.status || '');
          setStatus(taskResponse.status || '');
          setDescricao(taskResponse.descricao || '');
          setTitulo(taskResponse.title || '');
        }

        setUsuarios(usersResponse || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };


  const handleUpdateTask = async () => {
    if (token) {
      try {
        await updateTask(taskId, { title: titulo, descricao, responsavel, status }, token);
        navigation.navigate('Lista de Tarefas');
      } catch (error) {
        console.log(error)
      }
    }
  };

  const confirmDeleteTask = () => {
    Alert.alert(
      "Excluir Tarefa",
      "Tem certeza de que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: handleDeleteTask },
      ]
    );
  };

  const handleDeleteTask = async () => {
    if (token) {
      try {
        await deleteTask(taskId, token);
        navigation.navigate('Lista de Tarefas');
      } catch (error) {
        console.log(error)
      }
    }
  };

  const getCardStyle = (status: string) => {
    return {
      backgroundColor: getBackgroundColor(status),
      borderColor: getBorderColor(status),
      borderRadius: 10,
      width: 150,
      marginTop: 15,
      height: 30,
      fontFamily: 'Geologica',

      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
    };
  };
  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'Não Iniciada':
        return '#fbbf24';
      case 'Em Andamento':
        return '#084c6c';
      case 'Concluída':
        return '#10b981';
      default:
        return '#9ca3af';
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

  useEffect(() => {
    fetchData();
  }, [token, taskId]);

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
              <Text style={styles.title}>Tarefa ID :{taskId}</Text>
              <IconButton
                mode='outlined'
                icon="trash-can"
                iconColor={"#ff0000"}
                size={24}
                onPress={confirmDeleteTask}
                style={{ marginBottom: 20 }}
              />
            </View>
            {statusTask == 'Concluída' ?
              <Title style={styles.labelTitle}>
                {titulo}
              </Title>
              :
              <TextInput
                style={styles.input}
                value={titulo}
                onChangeText={setTitulo}
                mode="outlined"
                label={'Título'}
                theme={inputTheme}
                disabled={status == 'Concluída'}
              />
            }
            {statusTask == 'Concluída' ?
              <Text >
                Descrição:
                {' ' + descricao}
              </Text> :
              <TextInput
                style={styles.input}
                value={descricao}
                onChangeText={setDescricao}
                mode="outlined"
                label={'Descrição'}
                theme={inputTheme}
                disabled={status == 'Concluída'}

              />}
            <Text style={styles.label}>Criado por:</Text>
            <Text>
              {criadoPor}
            </Text>
            <Text style={styles.label}>Responsável:</Text>

            {statusTask == 'Concluída' ?
              <Text>
                {responsavelName}
              </Text>
              :
              <Picker
                selectedValue={responsavel}
                style={styles.picker}
                onValueChange={(itemValue) => setResponsavel(itemValue)}
                mode='dropdown'
              >
                {usuarios.map((usuario) => (
                  <Picker.Item key={usuario.id} label={usuario.username} value={usuario.id}
                  />
                ))}
              </Picker>
            }


            <Text style={styles.label}>Status:</Text>
            {statusTask == 'Concluída' ?
              <Text style={getCardStyle(status)}>
                {status}
              </Text> : <Picker
                selectedValue={status}
                style={styles.picker}
                onValueChange={(itemValue) => setStatus(itemValue)}
                mode='dropdown'
              >
                <Picker.Item label="Não Iniciada" value="Não Iniciada" />
                <Picker.Item label="Em Andamento" value="Em Andamento" />
                <Picker.Item label="Concluída" value="Concluída" />
              </Picker>}
            {statusTask !== 'Concluída' ? <Button mode="contained" icon={'update'}
              onPress={handleUpdateTask} style={styles.updateButton}>
              Atualizar Tarefa
            </Button> : null}

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
    padding: 12,
    backgroundColor: '#f5f5f5',
    fontFamily: 'Geologica',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Geologica',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Geologica-Bold',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Geologica-Bold',
    fontWeight: 'bold',
    marginTop: 12,
  },
  valueText: {
    fontSize: 16,
    fontFamily: 'Geologica',
    marginBottom: 10,
  },
  labelTitle: {
    fontSize: 18,
    fontFamily: 'Geologica-Bold',
    fontWeight: 'bold',
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
    fontFamily: 'Geologica',
  },
  picker: {
    height: 50,
    width: '100%',
    borderRadius: 50,
    marginBottom: 12,
    fontFamily: 'Geologica',
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "#04c074",
  },
});


export default TaskDetailScreen;
