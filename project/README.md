# 🚀 FaceGram - Rede Social Completa

Uma aplicação de rede social moderna desenvolvida com **React + TypeScript** no frontend e **Spring Boot** no backend.

## 📋 Pré-requisitos

- **Java 17+**
- **Node.js 18+**
- **Maven 3.6+**

## 🛠️ Como executar localmente

### 1. **Backend (Spring Boot)**

```bash
# Navegar para o diretório raiz
cd /home/project

# Executar o backend
./mvnw spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

### 2. **Frontend (React)**

```bash
# Em outro terminal, executar o frontend
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 🔐 Credenciais de Teste

A aplicação vem com usuários pré-cadastrados:

| Email | Senha | Nome |
|-------|-------|------|
| `maria@example.com` | `123456` | Maria Silva |
| `joao@example.com` | `123456` | João Santos |
| `ana@example.com` | `123456` | Ana Costa |

## 🎯 Funcionalidades Disponíveis

### ✅ **Autenticação**
- Login e registro de usuários
- JWT para autenticação segura
- Logout

### ✅ **Posts**
- Criar posts com texto e imagens
- Visualizar feed de posts
- Curtir/descurtir posts
- Comentar em posts
- **Excluir posts próprios** ✨
- Denunciar posts de outros usuários

### ✅ **Perfil**
- Visualizar perfil próprio e de outros usuários
- Editar informações do perfil
- Upload de avatar e foto de capa
- Estatísticas (posts, amigos, curtidas)

### ✅ **Amigos**
- Visualizar lista de amigos
- Solicitações de amizade
- Sugestões de amigos
- Buscar usuários

### ✅ **Configurações**
- Configurações de conta
- Configurações de privacidade
- Configurações de notificações

## 🗄️ Banco de Dados

Para desenvolvimento local, a aplicação usa **H2 Database** (em memória):

- **Console H2**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: (vazio)

## 📡 API Endpoints

### **Autenticação**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### **Posts**
- `GET /api/posts` - Listar posts (paginado)
- `POST /api/posts` - Criar post
- `PUT /api/posts/{id}` - Editar post
- `DELETE /api/posts/{id}` - Excluir post

### **Curtidas**
- `POST /api/likes/toggle/{postId}` - Curtir/descurtir

### **Comentários**
- `POST /api/comments` - Criar comentário
- `GET /api/comments/post/{postId}` - Listar comentários

### **Usuários**
- `GET /api/users/me` - Perfil atual
- `GET /api/users/{id}` - Perfil por ID
- `PUT /api/users/{id}` - Atualizar perfil

## 🔧 Tecnologias Utilizadas

### **Frontend**
- React 18 + TypeScript
- Tailwind CSS
- Lucide React (ícones)
- Vite

### **Backend**
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- H2 Database (desenvolvimento)
- ModelMapper
- Bean Validation

## 🚀 Deploy para Produção

Para produção, altere o `application.yml` para usar PostgreSQL:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/facegram_db
    username: postgres
    password: sua_senha
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

E descomente a dependência do PostgreSQL no `pom.xml`.

## 📝 Notas Importantes

- ✅ **Exclusão de posts**: Apenas o autor pode excluir seus próprios posts
- ✅ **Segurança**: Todas as rotas protegidas por JWT
- ✅ **Validação**: Validação completa de dados no backend
- ✅ **CORS**: Configurado para desenvolvimento local
- ✅ **Dados de exemplo**: Criados automaticamente na inicialização

## 🎨 Interface

A interface foi desenvolvida com foco em:
- **Design moderno** e responsivo
- **UX intuitiva** similar ao Instagram/Facebook
- **Animações suaves** e micro-interações
- **Tema consistente** com cores e tipografia harmoniosas

---

**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento**