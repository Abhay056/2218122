import React, { useState } from "react";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import { log } from "./logging/logger";

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (taskText) => {
    const newTask = { id: Date.now(), text: taskText };
    setTasks([...tasks, newTask]);
    log("frontend", "info", "state", `Task added: ${taskText}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📝 Task Tracker</h1>
      <AddTask onAdd={addTask} />
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;
