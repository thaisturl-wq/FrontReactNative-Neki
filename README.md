# NEKI Event Manager - React Native App

Aplicativo mobile para gerenciamento de eventos corporativos desenvolvido com React Native, Expo e TypeScript.

## 📱 Sobre o Projeto

Sistema completo de gestão de eventos com autenticação JWT, CRUD de eventos, calendário interativo e agenda personalizada. O aplicativo oferece uma interface moderna, minimalista e intuitiva seguindo os padrões de design preto e branco.

## ✨ Funcionalidades

### Autenticação
- Sistema de login com JWT Bearer Token
- Cadastro de novos usuários com validação completa
- Logout seguro com limpeza de tokens
- "Lembrar senha" com persistência local

### Gestão de Eventos
- **Criar eventos** com título, data, localização e imagem
- **Editar eventos** (apenas data e localização por restrição da API)
- **Excluir eventos** com modal de confirmação
- **Busca em tempo real** por título, descrição ou localização
- Validação de data (impede criação de eventos no passado)

### Visualizações
- **Dashboard**: Grid de cards com eventos
- **Calendário**: Visualização mensal com marcação de eventos
- **Agenda**: Lista cronológica de eventos futuros

### Validações
- **Cadastro**: Nome mínimo 3 caracteres, email válido, senha com 8+ caracteres, maiúscula e caractere especial
- **Login**: Email e senha obrigatórios com formato válido
- **Eventos**: Todos os campos obrigatórios, data no formato DD/MM/YYYY, URL de imagem válida

## 🚀 Tecnologias

- **React Native** 0.81.5
- **Expo** ~54.0.31
- **TypeScript** ~5.9.2
- **React Navigation** (Native Stack)
- **Axios** para integração com API REST
- **AsyncStorage** para persistência local
- **React Native Safe Area Context**

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go instalado no dispositivo móvel (Android/iOS)
- Backend da API rodando em `http://192.168.1.3:8080`

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd FrontReactNative-Neki
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API:
Edite `src/service/api.ts` e altere o `BASE_URL` para o IP da sua rede local:
```typescript
const BASE_URL = 'http://SEU_IP:8080';
```

4. Inicie o servidor Expo:
```bash
npm start
```

5. Escaneie o QR Code com o Expo Go no seu dispositivo móvel

## 📁 Estrutura do Projeto

```
src/
├── assets/              # Imagens e sons
├── components/          # Componentes reutilizáveis
│   ├── agendaview/     # Lista de eventos cronológica
│   ├── calendar/       # Calendário mensal
│   ├── card/           # Card de evento
│   ├── confirmmodal/   # Modal de confirmação
│   ├── eventdetail/    # Detalhes do evento
│   ├── modal/          # Modal de criar/editar evento
│   ├── profilemodal/   # Modal de perfil do usuário
│   └── toast/          # Notificações toast
├── config/             # Configurações e credenciais
├── context/            # Context API (AuthContext)
├── pages/              # Telas principais
│   ├── dashboard/      # Dashboard principal
│   ├── login/          # Tela de login
│   └── register/       # Tela de cadastro
├── routes/             # Configuração de navegação
├── service/            # Serviços de API
│   ├── api.ts          # Configuração Axios
│   └── eventService.ts # CRUD de eventos
└── types/              # Definições TypeScript
```

## 🔐 Autenticação

O app utiliza JWT Bearer Token para autenticação:

1. Login envia credenciais para `POST /users/login`
2. Backend retorna `{ token, user }`
3. Token é armazenado no AsyncStorage
4. Interceptor Axios injeta `Authorization: Bearer <token>` em todas as requisições
5. Logout remove token e limpa storage

## 🌐 Integração com API

### Endpoints utilizados

```
POST   /users          - Cadastro de usuário
POST   /users/login    - Autenticação
GET    /events         - Listar eventos
POST   /events         - Criar evento
PUT    /events/:id     - Atualizar evento (apenas date e location)
DELETE /events/:id     - Deletar evento
```

### Mapeamento de Campos

| Backend  | Frontend  |
|----------|-----------|
| name     | title     |
| image    | imageUrl  |
| date     | date      |
| location | location  |

**Formato de data**: YYYY-MM-DD (ISO 8601)

## 📝 Scripts Disponíveis

```bash
npm start           # Inicia o Expo Dev Server
npm run android     # Roda no emulador Android
npm run ios         # Roda no simulador iOS
npm run web         # Roda no navegador
```

## 🎨 Design System

- **Cores principais**: Preto (#000) e Branco (#fff)
- **Tons de cinza**: #f9f9f9 (background), #e5e5e5 (borda), #737373 (texto secundário)
- **Tipografia**: Sans-serif com pesos 300, 400, 600, bold
- **Bordas**: Border radius 16px (inputs e botões), 40px (modais)
- **Espaçamento**: Sistema de padding/margin múltiplo de 4px

## ⚠️ Restrições Conhecidas

1. **Edição de eventos**: Por limitação da API, apenas `date` e `location` podem ser alterados
2. **Datas no passado**: Sistema bloqueia criação de eventos com data anterior ao dia atual
3. **Timeout de API**: Requisições têm timeout de 10 segundos
4. **Token expiration**: Não há refresh token, usuário precisa fazer login novamente

## 🐛 Troubleshooting

### Erro de conexão com API
- Verifique se o backend está rodando
- Confirme que está na mesma rede Wi-Fi
- Atualize o IP em `src/service/api.ts`

### Expo não conecta
- Limpe o cache: `expo start -c`
- Reinstale node_modules: `rm -rf node_modules && npm install`

### Problemas de autenticação
- Limpe o AsyncStorage: Settings > Apps > Expo Go > Clear Storage
- Verifique logs do backend para erros de token

## 📄 Licença

Este projeto é parte do programa NEKI e destina-se a fins educacionais.

## 👥 Contribuidores

Desenvolvido durante o programa de capacitação NEKI SERRATEC 2026.


### 2. Primeiro Acesso

1. Abra o aplicativo
2. Use as credenciais fornecidas acima
3. Pronto! Você terá acesso aos eventos pré-populados

### 3. Criar Novo Usuário (Opcional)

1. Na tela de login, clique em "Criar Nova Conta"
2. Preencha os dados
3. Após o cadastro, faça login com suas credenciais

## 📋 Estrutura de Dados

### Event (Evento)
```typescript
{
  id: number;
  title: string;
  description?: string;
  date: string;
  location?: string;
  imageUrl?: string;
  startTime?: string;
  endTime?: string;
  adminId?: number;
}
```

## 🔧 Tecnologias Utilizadas

- **React Native** - Framework mobile
- **TypeScript** - Tipagem estática
- **Expo** - Plataforma de desenvolvimento
- **AsyncStorage** - Armazenamento local
- **React Navigation** - Navegação entre telas

## 📁 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
│   ├── modal/         # Modal de criação/edição de eventos
│   ├── card/          # Card de evento
│   ├── agendaview/    # Visualização em agenda
│   ├── calendar/      # Calendário
│   └── profilemodal/  # Modal de perfil
├── pages/             # Telas principais
│   ├── login/         # Tela de login
│   ├── register/      # Tela de cadastro
│   └── dashboard/     # Dashboard principal
├── service/           # Serviços
│   └── eventService.ts # Serviço de gerenciamento de eventos
├── config/            # Configurações
│   └── credentials.ts # Credenciais padrão
└── types/             # Tipos TypeScript
```

## 🔐 Segurança

- Validação de email e senha
- Senha com requisitos mínimos (8 caracteres, 1 maiúscula, 1 caractere especial)
- Armazenamento seguro com AsyncStorage
- Validação de credenciais no login

## 🎨 Recursos Visuais

- Interface moderna e limpa
- Feedback visual em todas as ações
- Mensagens toast para confirmações
- Modal de confirmação para exclusões
- Animações suaves

## 📱 Compatibilidade

- ✅ Android
- ✅ iOS
- ✅ Web (com limitações)

## 🛠️ Desenvolvimento

### Adicionar Novos Eventos Iniciais

Edite o arquivo `src/service/eventService.ts` e adicione novos eventos no array `INITIAL_EVENTS`.

### Alterar Credenciais Padrão

Edite o arquivo `src/config/credentials.ts` e modifique as credenciais em `DEFAULT_CREDENTIALS`.

### Resetar Eventos

O serviço possui um método `resetEvents()` que pode ser usado para restaurar os eventos iniciais.

## 📝 Notas

- Todos os dados são armazenados localmente no dispositivo
- Limpar os dados do app resultará na perda dos eventos criados
- Os eventos pré-populados serão restaurados ao reiniciar o app após limpar dados
- Sem necessidade de conexão com internet

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT.

---

**Desenvolvido com ❤️ usando React Native**
