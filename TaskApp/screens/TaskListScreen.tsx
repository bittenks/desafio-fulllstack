import React, { useEffect, useState } from 'react';
import { View, Button, FlatList, Text } from 'react-native';
import { getTasks } from '../api/api';

const TaskListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const token = 'seu_token_aqui';

  const fetchTasks = async () => {
    try {
      const response = await getTasks(token);
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View>
            <Text>{item.descricao}</Text>
            <Button title="Detalhes" onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Criar Tarefa" onPress={() => navigation.navigate('TaskForm')} />
    </View>
  );
};

export default TaskListScreen;
