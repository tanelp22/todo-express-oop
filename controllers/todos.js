import { fileManager } from "../files.js";
import { Todo } from "../models/todo.js";
import { v4 as uuidv4 } from "uuid";

class todoController {
  constructor() {
    this.initTodos();
  }
  async createTodo(req, res) {
    const task = req.body.task;
    const newTodo = new Todo(uuidv4(), task);
    this.TODOS.push(newTodo);
    await fileManager.writeFile("./data/todos.json", this.TODOS);
    res.json({
      message: "created new todo object",
      newTask: newTodo,
    });
  }
  async initTodos() {
    const todosData = await fileManager.readFile("./data/todos.json");
    if (todosData !== null) {
      this.TODOS = todosData;
    } else {
      this.TODOS = [];
    }
  }
  getTodos(req, res) {
    res.json({
      tasks: this.TODOS,
    });
  }
  async updateTodo(req, res) {
    const todoId = req.params.id;
    const updatedTask = req.body.task;

    if (!updatedTask || typeof updatedTask !== "string") {
      return res.status(400).json({
        message: "Invalid or missing task content",
      });
    }

    const todoIndex = this.TODOS.findIndex((todo) => todo.id === todoId);
    if (todoIndex < 0) {
      return res.status(404).json({
        message: "Could not find todo with the specified id",
      });
    }
    this.TODOS[todoIndex] = new Todo(this.TODOS[todoIndex].id, updatedTask);

    try {
      await fileManager.writeFile("./data/todos.json", this.TODOS);
      return res.json({
        message: "Updated todo successfully",
        updatedTask: this.TODOS[todoIndex],
      });
    } catch (error) {
      console.error("Error changing todo:", error);
      return res.status(500).json({
        message: "Failed to change todo",
      });
    }
  }
  async deleteTodo(req, res) {
    const todoId = req.params.id;
    const todoIndex = this.TODOS.findIndex((todo) => todo.id === todoId);
    if (todoIndex < 0) {
      return res.status(404).json({
        message: "Could not find todo with the specified id",
      });
    }
    const [deletedTodo] = this.TODOS.splice(todoIndex, 1);

    try {
      await fileManager.writeFile("./data/todos.json", this.TODOS);
      res.json({
        message: "Deleted todo successfully",
        deletedTodo,
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({
        message: "Failed to delete todo",
      });
    }
  }
}

export const TodoController = new todoController();
