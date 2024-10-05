// StatusSelect.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu } from 'react-native-paper';

interface StatusSelectProps {
  status: string;
  setStatus: (status: string) => void;
}

const StatusSelect: React.FC<StatusSelectProps> = ({ status, setStatus }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            style={styles.button}
          >
            {status || 'Selecione o Status'}
          </Button>
        }
      >
        {['Não Iniciada', 'Em Andamento', 'Concluída'].map((statusOption) => (
          <Menu.Item
            key={statusOption}
            onPress={() => {
              setStatus(statusOption);
              setVisible(false);
            }}
            title={statusOption}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginVertical: 12,
  },
  button: {
    width: '100%', // O botão ocupa toda a largura disponível
    justifyContent: 'flex-start', // Alinha o texto à esquerda
  },
});

export default StatusSelect;
