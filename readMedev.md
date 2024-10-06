# Desafio FullStack

## 📋 Descrição do Projeto

Este é um projeto fullstack para gerenciamento de tarefas domésticas, desenvolvido como parte de um desafio técnico para a **Obuc Tech**. A aplicação permite designar tarefas a diferentes membros da família, com funcionalidades para criação, edição, visualização, e exclusão de tarefas.

A aplicação é composta por uma API REST desenvolvida em **NestJS**, um front-end web em **Vite** utilizando **ShadcnUI**, e um aplicativo mobile em **React Native** com **React Native Paper**. Todas as interfaces consomem a API criada para gerenciar as tarefas, e estão hospedadas em ambientes na nuvem.

### 🎨 Design

O design do projeto segue a identidade visual da **Obuc Tech**, utilizando suas **cores** e **fontes** oficiais para garantir uma experiência alinhada com a marca.

## 🌐 Links do Projeto

- **Front-end Web**: [Acesse aqui no Netlify](https://desafiofullstackbittencourt.netlify.app/)
- **Back-end API**: [Acesse aqui no Render.com](https://dashboard.render.com/web/srv-cs0oi2btq21c73ehbg4g)
- **Aplicativo Mobile**: Disponível no simulador Expo [Acesse aqui no Expo](#)

## 📂 Estrutura do Projeto

### Back-end (API)

A API foi desenvolvida utilizando **Node.js**, **Typescript**, e **NestJS**. As rotas disponibilizadas são:

- **/register** - [POST]: Cadastra um novo usuário.
- **/login** - [POST]: Autentica um usuário.
- **/tasks** - [POST]: Cadastra uma nova tarefa (requer autenticação).
- **/tasks/{id}** - [PUT]: Edita uma tarefa especificada (não é possível editar tarefas concluídas, requer autenticação).
- **/tasks** - [GET]: Retorna a lista de todas as tarefas, com opção de filtro de status (não iniciada, em andamento, concluída, requer autenticação).
- **/tasks/{id}** - [GET]: Retorna detalhes de uma tarefa especificada (requer autenticação).
- **/tasks/{id}** - [DELETE]: Deleta a tarefa especificada (requer autenticação).

- **Banco de Dados**: Pode ser configurado com qualquer banco relacional ou não-relacional à sua escolha.

#### 🧪 Testes

Foram implementados testes unitários nos **services de User, Auth, e Task** para garantir a estabilidade e confiabilidade das funcionalidades principais da aplicação.

### Front-end Web

A aplicação web foi construída utilizando **Vite** com **ShadcnUI** para estilização, garantindo uma experiência rápida e responsiva. Funcionalidades disponíveis:

- Cadastro e Login do Usuário
- Visualização, Criação, Edição e Exclusão de Tarefas
- Filtro de tarefas por status (não iniciada, em andamento, concluída)

### Mobile

A versão mobile foi desenvolvida em **React Native**, utilizando a biblioteca de estilização **React Native Paper**. O aplicativo é responsivo, suportando dispositivos de diferentes tamanhos, e oferece todas as funcionalidades disponíveis na versão web, incluindo:

- Cadastro e Login do Usuário
- Visualização, Criação, Edição, e Exclusão de Tarefas
- Filtro de tarefas por status

A aplicação mobile também está disponível no **Expo**, facilitando a execução em emuladores Android e dispositivos reais.

## 🚀 Deploy

As diferentes partes do projeto foram hospedadas na nuvem:

- **Web Front-end**: Hospedado no [Netlify](https://app.netlify.com)
- **API Back-end**: Hospedado no [Render.com](https://render.com/)
- **Mobile**: Utilizando o **Expo**, acessível através de emuladores ou dispositivos físicos.

## ✨ Diferenciais Implementados

- **Deploy na Nuvem**: Todas as partes da aplicação foram hospedadas em ambientes acessíveis online, facilitando o acesso e a utilização do sistema.
- **Testes Unitários**: Testes foram criados para os principais serviços do backend, garantindo estabilidade e confiabilidade.
- **Suporte a Emulador Android**: A versão mobile foi configurada para rodar no Expo, sendo testada em emuladores Android.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**
- **Typescript**
- **NestJS**
- **Render.com** para deploy

### Frontend Web
- **Vite**
- **ShadcnUI** para estilização
- **Netlify** para deploy

### Mobile
- **React Native**
- **React Native Paper** para UI
- **Expo** para simulação

### Design
- **Fontes e Cores da Obuc Tech**: Utilizei  as cores e tipografia oficiais da **Obuc Tech** de acordo com a nova identidade visual que consistente em todas as plataformas.

## 📝 Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js e npm/yarn
- Expo CLI para a versão mobile

### Backend

1. Clone o repositório e navegue até a pasta backend:
    ```sh
    git clone https://github.com/bittenks/desafio-fulllstack
    cd api
    ```
2. Instale as dependências:
    ```sh
    npm install
    ```

3. Inicie o servidor:
    ```sh
    npm run start
    ```

### Frontend Web

1. Navegue até a pasta do frontend:
    ```sh
    cd webtaskapp
    ```
2. Instale as dependências:
    ```sh
    npm install
    ```
3. Inicie o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```

### Mobile

1. Navegue até a pasta do mobile:
    ```sh
    cd taskapp
    ```
2. Instale as dependências:
    ```sh
    npm install
    ```
3. Inicie o Expo:
    ```sh
    expo start
    ```

## 📱 Funcionalidades

- **Autenticação**: Cadastro e Login
- **Tarefas**: Visualização, Criação, Edição e Exclusão de tarefas
- **Filtros**: Filtrar tarefas por status


