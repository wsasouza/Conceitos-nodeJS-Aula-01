const express = require("express");

const server = express();

server.use(express.json()); //informa ao express que vai retornar o formato json

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required!" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists!" });
  }
  req.user = user;
  return next();
}

//localhost:3000/teste
//Query params = ?teste=1
//Route params = /users/1
//Request body = { "name": "Walter", "email": "wsasouza@hotmail.com"}(POST, PUT)

//CRUD - Create, Read, Update, Delete

const users = ["Walter", "Mônica", "Renato", "Cintia"];

//lista todos os usuários
server.get("/users", (req, res) => {
  return res.json(users);
});

//lista um usuário passado como parâmetro
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

//Cria um novo usuário passado no corpo da requisição
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

//Edita os dados de um usuário passado como parâmetro
server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;

  return res.json(users);
});

//Exclui um usuário passado como parâmetro
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
