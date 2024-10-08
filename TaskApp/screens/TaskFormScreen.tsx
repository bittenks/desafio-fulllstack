import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import { createTask, getUsers } from '../api/api'; // Certifique-se de ter a função getUsers em seu API
import useAuth from '../hooks/useAuth';
import { Picker } from '@react-native-picker/picker';

const TaskFormScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [descricao, setDescricao] = useState('');
  const [title, setTitle] = useState('');

  const [responsavel, setResponsavel] = useState('');
  const [status, setStatus] = useState('Não Iniciada');
  const [usuarios, setUsuarios] = useState<any[]>([]); // Para armazenar a lista de usuários
  const { token } = useAuth();

  // Função para buscar usuários
  const fetchUsers = async () => {
    try {
      if (token) {
        const response = await getUsers(); // Chame sua API para buscar usuários
        setUsuarios(response || []); // Armazene os usuários na state
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar usuários.');
    }
  };

  useEffect(() => {
    fetchUsers(); // Chame a função ao montar o componente
  }, [token]);

  const handleCreateTask = async () => {
    if (!token) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    if (!descricao || !responsavel) {
      Alert.alert('Erro', 'Descrição e responsável são obrigatórios.');
      return;
    }

    try {
      await createTask({ title: title, descricao: descricao, responsavel: responsavel, status }, token);
      setTimeout(() => {
        navigation.navigate('Lista de Tarefas');
      }, 1000);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar tarefa.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>

          <Title style={styles.title}>Nova Tarefa</Title>
          <TextInput
            label="Título"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
            theme={inputTheme}
          />
          <TextInput
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            style={styles.input}
            mode="outlined"
            theme={inputTheme}
          />
          <Title style={styles.labelTitle}>
            Responsável:
          </Title>
          <Picker
            selectedValue={responsavel}
            style={styles.picker}
            onValueChange={(itemValue) => setResponsavel(itemValue)}

          >
            <Picker.Item label="Selecione o responsável" value="" />
            {usuarios?.map((usuario) => (
              <Picker.Item key={usuario.id} label={usuario.username} value={usuario.id} />
            ))}
          </Picker>
          <Title style={styles.labelTitle}>
            Status:
          </Title>
          <Picker
            selectedValue={status}
            style={styles.picker}
            onValueChange={(itemValue) => setStatus(itemValue)}
          >
            <Picker.Item label="Não Iniciada" value="Não Iniciada" />
            <Picker.Item label="Em Andamento" value="Em Andamento" />
            <Picker.Item label="Concluída" value="Concluída" />
          </Picker>
          <Card.Actions
          >
            <Button
              mode="contained"
              onPress={handleCreateTask}
              style={styles.button}
              icon={'plus-box-outline'}
            >
              Criar Tarefa
            </Button>
          </Card.Actions>
        </Card.Content>

      </Card>

    </View>
  );
};

const styles = StyleSheet.create({
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
  labelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    fontFamily: 'Geologica-Bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',

  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
    color: '#044c78',
    fontFamily: 'Geologica-Bold',
  },
  input: {
    backgroundColor: '#fff',

    marginBottom: 12,
    borderColor: "#044c78",
  },
  button: {
    marginBottom: 12,
    backgroundColor: "#04c074",
  },
  picker: {
    height: 50,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 50,
    borderColor: "#044c78",
  },
});

const inputTheme = {
  colors: {
    primary: '#044c78',
    placeholder: '#6200ee',
    text: '#000',
    error: '#B00020',
  },
};

export default TaskFormScreen;
