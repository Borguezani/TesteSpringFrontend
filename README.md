# Sistema de Gerenciamento de Clientes - Frontend

Frontend da aplicação de gerenciamento de clientes desenvolvido com React, TypeScript e Material-UI.

## 🚀 Tecnologias

- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **Material-UI (MUI)** - Biblioteca de componentes React
- **React Router DOM** - Roteamento da aplicação
- **Axios** - Cliente HTTP para requisições
- **Notistack** - Notificações toast

## 📋 Funcionalidades

- ✅ Autenticação de usuários (Login/Registro)
- ✅ Listagem de clientes
- ✅ Cadastro de novos clientes
- ✅ Edição de clientes existentes
- ✅ Exclusão de clientes
- ✅ Busca de endereço por CEP (ViaCEP API)
- ✅ Validação de CPF com dígito verificador
- ✅ Rotas protegidas com autenticação JWT
- ✅ Notificações de sucesso/erro
- ✅ Design responsivo

## 🔧 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend da aplicação rodando em `http://localhost:8080`

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Borguezani/TesteSpringFrontend.git
cd teste-spring-front
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API (se necessário):
   - Edite o arquivo [src/lib/axios.ts](src/lib/axios.ts)
   - Altere a `baseURL` se o backend estiver em outra porta

## 🎯 Como Executar

### Modo Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Recursos estáticos (imagens, ícones)
├── components/      # Componentes reutilizáveis
│   ├── Layout.tsx          # Layout principal com AppBar e navegação
│   └── ProtectedRoute.tsx  # Componente para proteger rotas autenticadas
├── lib/            # Configurações e utilitários
│   ├── api.ts      # Funções de chamadas à API (clientes e CEP)
│   ├── auth.ts     # Funções de autenticação (login, logout, refresh)
│   └── axios.ts    # Configuração do Axios com interceptors
├── pages/          # Páginas da aplicação
│   ├── Clientes.tsx      # Lista de clientes com tabela e ações
│   ├── ClienteForm.tsx   # Formulário de cadastro/edição de cliente
│   ├── Login.tsx         # Tela de login
│   └── Register.tsx      # Tela de registro de usuário
├── types/          # Definições de tipos TypeScript
│   ├── cep.ts      # Tipos para dados de CEP (ViaCEP)
│   ├── cliente.ts  # Tipos para entidade Cliente
│   └── user.ts     # Tipos para usuário e autenticação
├── App.tsx         # Componente principal com rotas
├── App.css         # Estilos globais da aplicação
├── main.tsx        # Ponto de entrada da aplicação
└── index.css       # Reset e estilos base
```

## 🔐 Autenticação

A aplicação utiliza JWT (JSON Web Token) para autenticação:

- **Access Token**: Armazenado no `localStorage` com validade curta
- **Refresh Token**: Usado para renovar o access token automaticamente
- **Interceptors**: O Axios adiciona automaticamente o token nas requisições
- **Rotas Protegidas**: Redirecionam para login se o usuário não estiver autenticado

### Fluxo de Autenticação
1. Usuário faz login → Backend retorna access token e refresh token
2. Tokens são armazenados no `localStorage`
3. Todas as requisições incluem o access token no header `Authorization`
4. Se o token expirar, o interceptor tenta renovar automaticamente
5. Se a renovação falhar, o usuário é redirecionado para login

## 🌐 Rotas

| Rota | Descrição | Protegida |
|------|-----------|-----------|
| `/` | Redireciona para `/clientes` ou `/login` | - |
| `/login` | Página de login | Não |
| `/register` | Página de registro de usuário | Não |
| `/clientes` | Listagem de clientes | Sim |
| `/clientes/new` | Cadastro de novo cliente | Sim |
| `/clientes/edit/:id` | Edição de cliente existente | Sim |

## 🔗 Integração com Backend

A aplicação se comunica com uma API REST Spring Boot em:
```
http://localhost:8080/api
```

### Endpoints utilizados:

**Autenticação**
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário
- `POST /auth/refresh` - Renovar access token
- `POST /auth/logout` - Logout (invalidar tokens)

**Clientes** (requer autenticação)
- `GET /clientes` - Listar todos os clientes
- `GET /clientes/:id` - Buscar cliente por ID
- `POST /clientes` - Criar novo cliente
- `PUT /clientes/:id` - Atualizar cliente
- `DELETE /clientes/:id` - Deletar cliente

**CEP** (proxy para ViaCEP)
- `GET /cep/:cep` - Buscar endereço por CEP

## ✨ Funcionalidades Especiais

### Validação de CPF
O sistema valida o CPF em tempo real no formulário de cliente:
- Formato correto (###.###.###-##)
- Cálculo dos dígitos verificadores
- Rejeita CPFs inválidos conhecidos (111.111.111-11, etc.)

### Busca Automática de CEP
Ao preencher o campo CEP e sair dele (evento blur):
- Busca automática na API ViaCEP através do backend
- Preenchimento automático dos campos:
  - Logradouro
  - Bairro
  - Cidade
  - Estado
- Exibe notificação de erro se o CEP não for encontrado

### Notificações
Utiliza o **Notistack** para exibir notificações:
- ✅ Sucesso (verde) - Operações bem-sucedidas
- ❌ Erro (vermelho) - Erros de validação ou servidor
- ⚠️ Aviso (laranja) - Alertas gerais
- ℹ️ Info (azul) - Informações gerais

## 🎨 UI/UX

### Design System
- **Material-UI (MUI)**: Biblioteca de componentes React
- **Design responsivo**: Adapta-se a diferentes tamanhos de tela
- **Tema**: Utilizando a paleta padrão do MUI com personalizações

### Componentes Principais
- **Layout**: AppBar com título e botão de logout
- **DataGrid**: Tabela interativa para listagem de clientes
- **Forms**: Formulários com validação em tempo real
- **Dialogs**: Confirmação de exclusão de clientes
- **Snackbar**: Notificações toast no canto superior direito

## 🐛 Solução de Problemas

### Frontend não inicia
```bash
# Limpe o cache e reinstale as dependências
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erro de conexão com o backend
- Verifique se o backend está rodando em `http://localhost:8080`
- Verifique a URL base no arquivo [src/lib/axios.ts](src/lib/axios.ts)
- Verifique as configurações de CORS no backend

### Token expirado constantemente
- Verifique a validade do token no backend
- Confirme que o refresh token está funcionando
- Verifique o console do navegador para erros de interceptor

### Problemas com CEP
- Verifique se o backend está fazendo proxy correto para o ViaCEP
- Tente acessar diretamente: `http://localhost:8080/api/cep/01310100`

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila o TypeScript e faz build para produção |
| `npm run preview` | Preview da build de produção |
| `npm run lint` | Executa o ESLint para verificar problemas no código |

## 🔒 Segurança

- ✅ Tokens JWT para autenticação
- ✅ Rotas protegidas com componente `ProtectedRoute`
- ✅ Interceptors para renovação automática de tokens
- ✅ Validação de dados no frontend e backend
- ✅ Sanitização de inputs
- ✅ Headers de segurança configurados no backend

## 🚀 Deploy

### Vercel / Netlify
1. Conecte seu repositório
2. Configure as variáveis de ambiente (se houver)
3. Build command: `npm run build`
4. Output directory: `dist`

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📚 Recursos Adicionais

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do Material-UI](https://mui.com/)
- [Documentação do React Router](https://reactrouter.com/)
- [Documentação do Axios](https://axios-http.com/)

## 👨‍💻 Autor

**Borguezani**
- GitHub: [@Borguezani](https://github.com/Borguezani)

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

---

**Nota:** Certifique-se de que o backend esteja rodando antes de iniciar o frontend.
```
