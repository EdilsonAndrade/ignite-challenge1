const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {name} = request.body;

  let username = request.body.username;
  
  const userExist = users.some(u=>u.username === (username));

  if(userExist){
    return response.status(400).json({error: "User already exists"});
  }
  request.name = name;
  request.username = username || request.headers.username;

  return next();
}

app.post('/users', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = {
    id:uuidv4(),
    username: request.username,
    name: request.name,
    todos:[]
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  
  // Complete aqui
  const user = users.find(user=>user.username === request.username);

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = users.find(user=>user.username === request.username);
  const { title, deadline } = request.body;
  
  const todo = {
    id: uuidv4(),
    title, 
    deadline: new Date(deadline), 
    done: false,
    created_at: new Date()
    
  };

  user.todos.push(todo);
  
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = users.find(user=>user.username === request.username);

  const { id } = request.params;
  const {title, deadline} = request.body;

  const index = user.todos.findIndex(t=>t.id===id);
  if(index <0){
    return response.status(404).json({error:"Todo not found"});
  }

  user.todos[index] = {
    ...user.todos[index],
    title,
    deadline: new Date(deadline)
  }

  return response.json(user.todos[index]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = users.find(user=>user.username === request.username);

  const { id } = request.params;
  const {title, deadline} = request.body;

  const index = user.todos.findIndex(t=>t.id===id);
  if(index <0){
    return response.status(404).json({error:"Todo not found"});
  }

  user.todos[index] = {
    ...user.todos[index],
    done:true
  }

  return response.json(user.todos[index]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  // Complete aqui
  const user = users.find(user=>user.username === request.username);

  const { id } = request.params;
  const {title, deadline} = request.body;

  const index = user.todos.findIndex(t=>t.id===id);
  if(index <0){
    return response.status(404).json({error:"Todo not found"});
  }


  user.todos.splice(index,1);
  
  return response.status(204).json(user.todos);
});

module.exports = app;