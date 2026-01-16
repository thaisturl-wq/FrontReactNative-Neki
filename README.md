# Sistema de Gestão de Eventos - Versão Local

## 📱 Sobre o Projeto

Aplicativo React Native para gerenciamento de eventos corporativos, funcionando **100% offline** sem necessidade de backend.

## 🔑 Credenciais de Acesso

Para acessar o sistema, use as seguintes credenciais:

**Email:** `admin@eventos.com`  
**Senha:** `Admin@2026`

## ✨ Funcionalidades

- ✅ **Autenticação Local**: Login seguro com validação de credenciais
- ✅ **Gerenciamento de Eventos**: Criar, editar, visualizar e excluir eventos
- ✅ **10 Eventos Pré-populados**: Sistema já vem com eventos de exemplo
- ✅ **Armazenamento Local**: Todos os dados salvos no dispositivo usando AsyncStorage
- ✅ **Perfil de Usuário**: Visualização e edição de perfil
- ✅ **Alteração de Senha**: Mudança de senha com validação
- ✅ **Agenda Visual**: Visualização de eventos em formato de agenda
- ✅ **Calendário**: Visualização de eventos no calendário
- ✅ **Modo Offline Completo**: Funciona sem conexão com internet

## 🎯 Eventos Pré-populados

O sistema já vem com 10 eventos corporativos:

1. **Reunião Executiva Q1 2026** - São Paulo, SP (15/01/2026)
2. **Workshop de Inovação Tecnológica** - Rio de Janeiro, RJ (22/01/2026)
3. **Lançamento Produto Alpha** - Belo Horizonte, MG (28/01/2026)
4. **Treinamento Técnico - Equipe** - Curitiba, PR (05/02/2026)
5. **Evento de Networking Executivo** - Florianópolis, SC (12/02/2026)
6. **Revisão Estratégica Anual** - Porto Alegre, RS (19/02/2026)
7. **Conferência de Vendas 2026** - São Paulo, SP (26/02/2026)
8. **Summit de Transformação Digital** - Brasília, DF (05/03/2026)
9. **Encontro de Desenvolvedores** - Recife, PE (12/03/2026)
10. **Apresentação de Resultados Q1** - São Paulo, SP (25/03/2026)

## 🚀 Como Usar

### 1. Instalação

```bash
# Instalar dependências
npm install

# Iniciar o app
npm start
```

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
