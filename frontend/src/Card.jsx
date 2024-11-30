import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

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
        const result = await response.json();
        const createdTask = result.newTask;
        setTasks((prevTasks) => [...prevTasks, createdTask]);
        setNewTask("");
      } else {
        console.error("Error adding task:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3009/todos/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Deleted task:", data.deletedTodo);

        // Update the UI by filtering out the deleted task
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } else {
        const errorData = await response.json();
        console.error("Error deleting task:", errorData.message);
        alert("Failed to delete task: " + errorData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("A network error occurred. Please try again later.");
    }
  };

  const handleEditTask = async (taskId) => {
    const newTaskContent = prompt("Enter the updated task:");
    if (!newTaskContent) {
      alert("Task content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3009/todos/${taskId}`, {
        method: "PATCH", // HTTP method for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: newTaskContent }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Handle non-JSON errors
        throw new Error(`Failed to update task: ${errorText}`);
      }

      const data = await response.json(); // Parse JSON response
      console.log("Updated task:", data.updatedTask);

      // Update the UI with the new task
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, task: newTaskContent } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error.message);
      alert(error.message);
    }
  };

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header>
        <h1>ToDo's</h1>
      </Card.Header>
      <ListGroup variant="flush">
        {tasks.map((task) => (
          <ListGroup.Item
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{task.task}</span>
            <div>
              <FaEdit
                style={{ marginRight: "0.5rem", cursor: "pointer" }}
                onClick={() => handleEditTask(task.id)}
              />
              <FaTrash
                style={{ cursor: "pointer" }}
                onClick={() => handleDeleteTask(task.id)}
              />
            </div>
          </ListGroup.Item>
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
