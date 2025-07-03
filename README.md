# Boardcamp API

![Status](https://img.shields.io/badge/status-concluído-brightgreen)

API RESTful desenvolvida como solução para o desafio do projeto Boardcamp, parte do bootcamp de Desenvolvimento Web Full Stack da [Driven - Escola de Programação](https://www.driven.com.br/).

## 📝 Descrição do Projeto

O objetivo do projeto foi construir o backend completo para um sistema de gestão de uma locadora de jogos de tabuleiro. A API é responsável por gerenciar o catálogo de jogos, o cadastro de clientes e o ciclo de vida dos aluguéis, incluindo a criação, listagem, devolução e exclusão de registros.

Foram implementadas todas as validações e regras de negócio de requisitos necessários para o projeto, utilizando uma arquitetura em camadas para organizar o código de forma limpa e escalável.

## 🚀 Funcionalidades (Endpoints)

| Método | Endpoint                    | Descrição                                         |
| :----- | :-------------------------- | :------------------------------------------------ |
| `POST` | `/games`                    | Cadastra um novo jogo.                            |
| `GET`  | `/games`                    | Lista todos os jogos cadastrados.                 |
| `POST` | `/customers`                | Cadastra um novo cliente.                         |
| `GET`  | `/customers`                | Lista todos os clientes.                          |
| `GET`  | `/customers/:id`            | Busca um cliente específico por seu ID.           |
| `POST` | `/rentals`                  | Registra um novo aluguel.                         |
| `GET`  | `/rentals`                  | Lista todos os aluguéis.                          |
| `POST` | `/rentals/:id/return`       | Finaliza um aluguel (devolução).                  |
| `DELETE`| `/rentals/:id`              | Exclui o registro de um aluguel.                  |

## 🛠️ Tecnologias Utilizadas

-   **Backend:** Node.js, Express.js
-   **Banco de Dados:** PostgreSQL
-   **Driver do Banco:** `pg`
-   **Validação de Dados:** Joi
-   **Variáveis de Ambiente:** `dotenv`
-   **Manipulação de Datas:** `dayjs`
-   **Desenvolvimento:** Nodemon

## ⚙️ Como Rodar o Projeto Localmente

Siga os passos abaixo para executar a API em seu ambiente local.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
-   [PostgreSQL](https://www.postgresql.org/download/)

### 1. Clone o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO_NO_GITHUB>
cd boardcamp
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto, copiando o conteúdo abaixo e substituindo com suas credenciais do PostgreSQL.

```env
DATABASE_URL=postgres://SEU_USUARIO:SUA_SENHA@localhost:5432/boardcamp
PORT=5000
```

### 4. Configure o Banco de Dados

1.  Crie um banco de dados no PostgreSQL com o nome `boardcamp`.
2.  Abra a ferramenta de query para esse banco e execute o script SQL abaixo para criar todas as tabelas necessárias.

<details>
<summary>Clique para ver o script SQL</summary>

```sql
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  "stockTotal" INTEGER NOT NULL,
  "pricePerDay" INTEGER NOT NULL
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  cpf VARCHAR(11) NOT NULL
);

CREATE TABLE rentals (
  id SERIAL PRIMARY KEY,
  "customerId" INTEGER NOT NULL,
  "gameId" INTEGER NOT NULL,
  "rentDate" DATE NOT NULL,
  "daysRented" INTEGER NOT NULL,
  "returnDate" DATE,
  "originalPrice" INTEGER NOT NULL,
  "delayFee" INTEGER
);
```
</details>

### 5. Inicie a Aplicação

Para rodar o servidor em modo de desenvolvimento (com reinicialização automática):

```bash
npm run dev
```

Para rodar em modo de produção:

```bash
npm start
```

O servidor estará rodando em `http://localhost:5000`. Você pode usar uma ferramenta como o [Postman](https://www.postman.com/) ou `curl` para interagir com a API. 