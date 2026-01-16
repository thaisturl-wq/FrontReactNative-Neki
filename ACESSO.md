# 🔐 Acesso ao Aplicativo

## Credenciais Padrão

Para acessar o aplicativo pelo celular, use as seguintes credenciais:

```
Email: admin@demo.com
Senha: 123456
```

## Como Usar

### Primeiro Acesso
1. Abra o aplicativo no seu celular
2. Na tela de Login, as credenciais padrão já estarão preenchidas
3. Clique em **"Entrar"**
4. Você será direcionado ao Dashboard

### Criar Nova Conta
1. Na tela de Login, clique em **"Criar Nova Conta"**
2. Preencha os dados:
   - Nome Completo
   - E-mail
   - Senha
   - Confirmar Senha
3. Clique em **"Finalizar Cadastro"**
4. Após o sucesso, você será redirecionado ao Login
5. Use o email e senha que você criou para fazer login

### Trocar de Usuário
1. No Dashboard, clique no botão de logout (⎋)
2. Você será deslogado e retornará à tela de Login
3. Faça login com outras credenciais

## Funcionalidades

- ✅ Login com validação de credenciais
- ✅ Registro de novos usuários
- ✅ Persistência de dados (AsyncStorage)
- ✅ Proteção de rotas (apenas usuários logados acessam o Dashboard)
- ✅ Logout seguro
- ✅ Credenciais padrão pré-configuradas

## Tecnologias

- React Native
- AsyncStorage (armazenamento local)
- React Navigation (navegação entre telas)
- TypeScript

## Observações

- As credenciais são salvas localmente no dispositivo
- Ao instalar o app pela primeira vez, as credenciais padrão são automaticamente configuradas
- Você pode criar quantas contas quiser
- Apenas um usuário pode estar logado por vez
