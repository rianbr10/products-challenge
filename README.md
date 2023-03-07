## Instalar Pacotes

No terminal da pasta Produtos, digite o seguinte comando:

`npm install`

Com este comando irá instalar todos os pacotes que foi utilizado no desenvolvimento.

## Configuração da API

Alterar as configurações do banco de dados no arquivo env (MongoDB)
PORT=
BASE=
DATABASE=

## Uso da API

Para executar a api, digite o seguinte comando no terminal da pasta Produtos:

`npm run startdev`
Exemplo de retorno:

[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): _._
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`

- Rodando em: http://localhost:5000

## Endpoints

## Usuários

> POST
> `/user/signin`

- Cadastrar um novo usuário

Exemplo de requisição:

{
"name": "Rian",
"email": "rian@gmail.com",
"password": "12345678",
}

> POST
> `/user/signup`

- Fazer login

Exemplo de requisição:

{
"email": "rian@gmail.com",
"password": "12345678",
}

> GET
> `/user/me`

- Listar meus dados de usuário

> PUT
> `/user/me`

- Editar informações do usuário

* É necessário estar logado
* Você apenas conseguirá editar o seu usuário

Exemplo de requisição:

{
"title": "Rian 2",
"emai": "rian2@gmail.com",
}

## Produtos

> POST
> `/product/add`

- Adicionar um novo produto

* É necessário estar logado

Exemplo de requisição:

{
"title": "HeadSet Gamer",
"price": "R$489,90",
"description": "HeadSet Gamer de última geração",
"images": [Um array com 1 ou mais imagens do produto]
}

> GET
> `/product/list`

- Listar todos os produtos cadastrados

* Na resposta da requisição terá o nome do usuário que adicionou cada produto.

> GET
> `/product/:id`

- Listar um produto pelo id

> POST
> `/product/add`

- Editar um produto

* É necessário estar logado
* Você apenas conseguirá editar produtos que você adicionou

Exemplo de requisição:

{
"title": "HeadSet Gamer 2",
"price": "R$589,90",
"description": "HeadSet Gamer 2 de última geração",
"images": [Você pode manter o mesmo array de imagens, ou adicionar novas]
}

> DELETE
> `/product/:id`

- Deletar um produto

* É necessário estar logado
* Você apenas conseguirá deletar produtos que você adicionou
