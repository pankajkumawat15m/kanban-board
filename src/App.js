import React, { useState, useEffect } from "react";
import "./App.css";

const users = ["Alice", "Bob", "Charlie", "David", "Emma"];
const taskStages = ["New", "In Progress", "Development", "Testing", "Due"];

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ heading: "", username: users[0], description: "", stage: taskStages[0], dueDate: "" });
  const [searchQuery, setSearchQuery] = useState("");

  
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (!formData.heading || !formData.username || !formData.description || !formData.dueDate) {
      alert("Please fill in all fields.");
      return;
    }
    setTasks((prevTasks) => [...prevTasks, { ...formData, id: prevTasks.length + 1 }]);
    setFormData({ heading: "", username: users[0], description: "", stage: taskStages[0], dueDate: "" });
    setTimeout(() => setShowForm(false), 100);
  };

  const updateTaskStage = (id, newStage) => {
    setTasks((prevTasks) => prevTasks.map(task => task.id === id ? { ...task, stage: newStage } : task));
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setFormData(taskToEdit);
    setShowForm(true);
    deleteTask(id); 
  };

  const calculateTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;

    if (diff <= 0) return "Overdue";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m remaining`;
  };

  const filteredTasks = tasks.filter(task =>
    task.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Task Stages</h2>
        {taskStages.map((stage) => (
          <div key={stage} className="task-section">
            <h3 className="task-section-title">{stage}</h3>
            <div className="task-list">
              {filteredTasks.filter(task => task.stage === stage).length === 0 ? (
                <p className="no-task-message">No tasks</p>
              ) : (
                filteredTasks.filter(task => task.stage === stage).map(task => (
                  <div key={task.id} className="task-box">
                    <h4 className="task-title">{task.heading}</h4>
                    <p className="task-username">Assigned to: {task.username}</p>
                    <p className="task-description">{task.description}</p>
                    <p className="task-due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    <p className="task-time-remaining">{calculateTimeRemaining(task.dueDate)}</p>
                    <select className="stage-select" value={task.stage} onChange={(e) => updateTaskStage(task.id, e.target.value)}>
                      {taskStages.map((s, index) => (
                        <option key={index} value={s}>{s}</option>
                      ))}
                    </select>
                    <button className="edit-task-button" onClick={() => editTask(task.id)}>Edit</button>
                    <button className="delete-task-button" onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </aside>
      <main className="main-content">
        <div className="header">
          <button className="add-task-button" onClick={() => setShowForm(true)}>Add Task</button>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {showForm && (
          <div className="task-form-overlay">
            <div className="task-form">
              <h2 className="form-title">New Task</h2>
              <div className="form-group">
                <input type="text" name="heading" placeholder="Task Heading" value={formData.heading} onChange={handleChange} className="form-input" />
                <select name="username" value={formData.username} onChange={handleChange} className="form-input">
                  {users.map((user, index) => (
                    <option key={index} value={user}>{user}</option>
                  ))}
                </select>
                <select name="stage" value={formData.stage} onChange={handleChange} className="form-input">
                  {taskStages.map((stage, index) => (
                    <option key={index} value={stage}>{stage}</option>
                  ))}
                </select>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="form-input" />
                <textarea name="description" placeholder="Task Description" value={formData.description} onChange={handleChange} className="form-textarea"></textarea>
                <button className="submit-task-button" onClick={addTask}>Submit Task</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ToDoList;
