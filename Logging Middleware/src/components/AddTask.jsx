import React, { useState } from "react";
import { log } from "../logging/logger";

function AddTask({ onAdd }) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim() === "") {
      log("frontend", "warn", "component", "Tried to add empty task");
      return;
    }
    onAdd(input);
    setInput("");
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={handleAdd}>Add Task</button>
    </div>
  );
}

export default AddTask;
