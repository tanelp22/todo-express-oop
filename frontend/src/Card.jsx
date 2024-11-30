import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import "./Card.css";

function ListGroupWithHeaderExample() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3009/todos");
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTodo = async () => {
    if (!newTask.trim()) {
      alert("Task cannot be empty");
      return;
    }

    try {
      const response = await fetch("http://localhost:3009/todos/new-todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: newTask }),
      });

      if (response.ok) {
        const result = await response.json(); // Fetch the result from the backend
        const createdTask = result.newTask; // Get the actual new todo object
        setTasks((prevTasks) => [...prevTasks, createdTask]); // Add the new task to the list
        setNewTask(""); // Clear the input field after adding
      } else {
        console.error("Error adding task:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header>
        <h1>ToDo's</h1>
      </Card.Header>
      <ListGroup variant="flush">
        {tasks.map((task) => (
          <ListGroup.Item key={task.id}>{task.task}</ListGroup.Item>
        ))}
      </ListGroup>
      <div style={{ padding: "1rem" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.25rem" }}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
    </Card>
  );
}

export default ListGroupWithHeaderExample;
