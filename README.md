# Documentação do TechChallange: Sistema de Gerenciamento de Pedidos para Lanchonete

  

## Introdução

  

Bem-vindo à documentação do projeto para o sistema de gerenciamento de pedidos de uma lanchonete. Este guia fornece instruções detalhadas sobre como configurar, executar e interagir com a API backend.

  

## Pré-requisitos

  

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

  

- Node.js

- npm (Node Package Manager)

- Docker

  

## Configuração do Projeto

  

1.  **Clone o Repositório:**
	```bash 
	git clone git@github.com:techChallenge-SOAT/backend-fast-food.git 
	cd backend-fast-food
	```


2. **Instale as Dependências:**

	```bash
	npm install
	```

## Docker

-  **Subir projeto**

	```bash
	docker-compose -d up
	```
- **Desligar Projeto**
	```bash 
	docker-compose down
	```

# Rotas da API

**Acesso à API:**
- A API estará disponível em `http://localhost:3000` por padrão.

## Items
	
 1. **Criar Item**
	 - **Método:** `POST`
	 - **Endpoint:** `/itens`
	 - **Exemplo Requisição:**

```json
{
	"categoria":"Lanche",
	"nome":"Hambúrguer com Queijo",
	"descricao":"Delicioso hambúrguer grelhado com queijo derretido",
	"preco_unitario":39.99
}
```
2. **Consultar item específico**
	- **Método:** `GET`
	- **Endpoint:** `/itens/{uuid}`
	- **Exemplo Requisição:**

		```bash
		GET localhost:3000/itens/670d7b97-e82e-47f4-bb4a-cd3f05865c90
		```

4. **Consultar todos os itens** 
	- **Método:** `GET`
	- **Endpoint:** `/itens`
	- **Exemplo Requisição:**

		```bash
		localhost:3000/itens
		```

##  Pedidos
	
 1. **Criar Pedido**
	 - **Método:** `POST`
	 - **Endpoint:** `/pedidos`
	 - **Exemplo Requisição:**

		```json
		{
		    "cliente_cpf": "12345678900",
		    "itens": [
		      {
		        "item_id":"670d7b97-e82e-47f4-bb4a-cd3f05865c90",
		        "quantidade": 2
		      }
		    ]
		  }
		```
2. **Consultar pedido específico**
	- **Método:** `GET`
	- **Endpoint:** `/pedidos/{id}`
	- **Exemplo Requisição:**

		```bash
		GET localhost:3000/pedidos/1
		```
3. **Atualizar `status` pedido** 
	- **Método:** `PATCH`
	- **Endpoint:** `/pedidos/{id}`
	- **Exemplo Requisição:**
	
		```json
		{
		"status":"pronto"
		}
		```
4. **Consultar todos os pedidos** 
	- **Método:** `GET`
	- **Endpoint:** `/pedidos`
	- **Exemplo Requisição:**
	
		```bash
		localhost:3000/pedidos
		```

##  Pagamento
	
 1. **Gerar pagamento pedido**
	 - **Método:** `POST`
	 - **Endpoint:** `/webhooks/mercadopago`
	 - **Exemplo Requisição:**
		```json
		{
		"id_pedido":"371a1359-37fe-468c-9f36-b2509fed34e7",
		"status":"Pago"
		}
		```

##  Clientes
	
 1. **Criar cliente**
	 - **Método:** `POST`
	 - **Endpoint:** `/clientes`
	 - **Exemplo Requisição:**

		```json
		{
		"cpf":  "12355677900",
		"nome":  "Antonio da Silva",
		"email":  "antonio@example.com",
		"senha":  "senha123"
		}
		```
2. **Consultar cliente específico por ID**
	- **Método:** `GET`
	- **Endpoint:** `/clientes/{id}`
	- **Exemplo Requisição:**

		```bash
		GET localhost:3000/clientes/1
		```
3. **Consultar cliente específico por CPF**
	- **Método:** `GET`
	- **Endpoint:** `/clientes/cpf/{cpf}`
	- **Exemplo Requisição:**

		```bash
		GET localhost:3000/clientes/cpf/11122233300
		```

6. **Consultar todos os clientes** 
	- **Método:** `GET`
	- **Endpoint:** `/clientes`
	- **Exemplo Requisição:**
	
		```bash
		localhost:3000/clientes
		```

# Caminho feliz para teste

### Funcionalidade: `Pedido`

**Contexto:** 
*Dado* que eu tenha um item cadastrado
*E* que eu tenha um cliente cadastrado

**Cenário:** `Realizar Pedido`

*Dado* que crie um pedido com pelo menos 1 item
*E* realize o pagamento do pedido
*Então* deve-se conseguir atualizar o status do pedido até finalizado

>[!NOTE]
> 
>A seguir a ordem que deve ser chamado as APIs para realizar o cenário acima
>1. Criar Item
>2. Criar Cliente
>3. Criar Pedido
>4. Gerar pagamento pedido
>5. Atualizar status Pedido para `em preparação`
>6. Atualizar status Pedido para `pronto`
>7. Atualizar status Pedido para `finalizado`
