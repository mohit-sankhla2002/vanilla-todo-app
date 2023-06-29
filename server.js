const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const port = 3000;

let todos = [];
let currentId = 1;

app.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

app.get("/todos/:id", (req, res) => {
  const id = +req.params.id;

  let todo = null;

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todo = todos[i];
      break;
    }
  }

  if (!todo) {
    res.status(404).json({ message: "Id entered does not match any todo" });
  }

  res.status(200).json(todo);
});

app.post("/todos", (req, res) => {
  let { title, description, completed } = req.body;
  console.log(title, description);
  if (!completed) {
    completed = false;
  }
  const todo = {
    id: currentId,
    title,
    completed,
    description,
  };
  currentId++;
  todos.push(todo);

  res.status(201).json(todo);
});

app.put("/todos/:id", (req, res) => {
  // this updates the todo with given id
  const id = req.params.id;

  let todo = null;

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === +id) {
      todo = todos[i];
      break;
    }
  }

  console.log(todo);

  if (todo === null) {
    res
      .status(404)
      .json({ message: "The Item you want to update does not exist" });
    return;
  }

  let { title, description, completed } = req.body;
  if (title) {
    todo.title = title;
  }

  if (description) {
    todo.description = description;
  }

  if (completed) {
    todo.completed = completed;
  }

  let newList = [];

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id !== +id) {
      newList.push(todos[i]);
    }
  }

  todos = [...newList, todo];

  res.status(200).json({ message: "The item was found and updated!" });
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;

  let todo = null;

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === +id) {
      todo = todos[i];
      break;
    }
  }

  if (todo === null) {
    res
      .status(404)
      .json({ message: "The todo you wanted to delete does not exist!" });
  }

  let filteredList = todos.filter((todo) => {
    if (todo.id !== +id) {
      return todo;
    }
  });

  todos = [...filteredList];

  res.status(200).json({ message: "Todo was deleted successfully!" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// module.exports = app;
