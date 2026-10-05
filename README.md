# Budd 🍸

**Budd** é um aplicativo mobile desenvolvido para conectar pessoas a bares, restaurantes, casas noturnas e eventos em um único lugar.

A proposta é permitir que o usuário descubra estabelecimentos, consulte informações, faça reservas, compre produtos e ingressos, acompanhe pedidos e interaja com uma comunidade dentro do aplicativo.

## 🚀 Funcionalidades

* 🔐 Cadastro e login de usuários
* 👤 Perfil do usuário
* 📍 Descoberta de estabelecimentos
* 🔎 Busca e exploração de locais
* 🗺️ Mapa de estabelecimentos
* 🍽️ Cardápio de comidas e bebidas
* 🛒 Carrinho de compras
* 💳 Fluxo de checkout
* 📦 Histórico de pedidos
* 📅 Reservas em estabelecimentos
* 🎫 Eventos e compra de ingressos
* 📋 Histórico de reservas e eventos
* 📸 Publicações da comunidade
* 💬 Área de conversas
* 🤖 Assistente Budd
* 🔒 Autenticação e gerenciamento de sessão

## 🛠️ Tecnologias

* React Native
* Expo
* Expo Router
* TypeScript
* React
* Supabase
* Supabase Auth
* Supabase Database
* Supabase Storage
* Git
* GitHub

## 📱 Estrutura do aplicativo

O projeto utiliza **Expo Router** para organização das telas e navegação.

```text
budd/
├── src/
│   ├── app/
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   │   ├── create.tsx
│   │   ├── place.tsx
│   │   ├── cart.tsx
│   │   ├── checkout.tsx
│   │   ├── orders.tsx
│   │   ├── reservations.tsx
│   │   ├── events.tsx
│   │   ├── profile.tsx
│   │   └── ...
│   │
│   ├── components/
│   ├── context/
│   └── lib/
│
├── assets/
├── package.json
├── app.json
├── tsconfig.json
└── README.md
```

## ⚙️ Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/Philiposobjj/budd.git
```

### 2. Entrar na pasta

```bash
cd budd
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_KEY=sua_chave_do_supabase
```

> O arquivo `.env` não é versionado no GitHub.

### 5. Iniciar o Expo

```bash
npx expo start
```

Depois, o aplicativo pode ser executado utilizando o **Expo Go** ou um ambiente de desenvolvimento compatível.

## 🔐 Segurança

Informações sensíveis e credenciais do Supabase não são armazenadas diretamente no código-fonte.

As variáveis de ambiente são mantidas no arquivo `.env`, que está incluído no `.gitignore`.

## 🎨 Interface

O Budd utiliza uma identidade visual baseada em:

* Fundo escuro
* Verde-limão como cor de destaque
* Interface simples e moderna
* Navegação focada na experiência mobile

## 🎯 Objetivo do projeto

O Budd foi desenvolvido como um projeto prático de desenvolvimento mobile, reunindo diferentes conceitos de desenvolvimento de software em uma única aplicação.

Entre os principais conceitos utilizados estão:

* Desenvolvimento mobile
* Componentização
* Navegação entre telas
* Gerenciamento de estado
* Autenticação
* Banco de dados
* Storage de imagens
* Integração com serviços externos
* CRUD
* Carrinho e pedidos
* Reservas
* Upload de arquivos
* Controle de sessão
* Git e GitHub

## 👨‍💻 Desenvolvedor

**Philip Alves Carmichael**

Desenvolvedor em formação com formação em **Turismo** e **Técnico em Desenvolvimento de Sistemas**, com interesse em desenvolvimento de software, suporte técnico e tecnologia.

### Tecnologias e conhecimentos

`JavaScript` · `TypeScript` · `React` · `React Native` · `Node.js` · `Express` · `MySQL` · `Prisma` · `Docker` · `Supabase` · `Git` · `GitHub`

---

⭐ Projeto desenvolvido por **Philip Alves Carmichael**.
