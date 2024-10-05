import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getTaskById } from '../api/api';

const TaskDetailScreen: React.FC<{ route: any }> = ({ route }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<any>(null);
  const token = 'seu_token_aqui'; 

  const fetchTaskDetails = async () => {
    try {
      const response = await getTaskById(taskId, token);
      setTask(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  if (!task) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View>
      <Text>Descrição: {task.descricao}</Text>
      <Text>Responsável: {task.responsavel}</Text>
      <Text>Status: {task.status}</Text>
    </View>
  );
};

export default TaskDetailScreen;
