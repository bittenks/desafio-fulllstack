// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskFormScreen from '../screens/TaskFormScreen';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
        <Stack.Screen name="Lista de Tarefas" component={TaskListScreen} />
        <Stack.Screen name="Detalhes da tarefa" component={TaskDetailScreen} />
        <Stack.Screen name="Criar Tarefa" component={TaskFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
