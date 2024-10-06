import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import Tasks from './components/Tasks';
import NavBar from './components/Navbar';

// Importando as telas

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/tarefas" element={<Tasks />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
