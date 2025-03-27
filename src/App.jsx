import './App.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask, deleteTask } from "./store/taskSlice";
import { login, logout } from './store/authSlice';
function App() {
  const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasks);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [sortedTasks, setSortedTasks] = useState([]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    setSortedTasks([...tasks]);
    console.log(tasks);
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task = { id: Date.now(), title: newTask, priority };
      dispatch(addTask(task));
      setNewTask("");
      setPriority("Medium");
    }
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handlePriorityChange = (id, newPriority) => {
    setSortedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, priority: newPriority } : task
      )
    );
  };

  const handleSort = () => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    setSortedTasks((prevTasks) =>
      [...prevTasks].sort((a, b) => priorityOrder[a?.priority || "Medium"] - priorityOrder[b?.priority || "Medium"])
    );
  };
  return (
    <div className="p-6 max-w-xl mx-auto">
      {isAuthenticated ?
        <>
          <div className='flex items-center justify-between mb-4'>
            <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>
            <button onClick={() => dispatch(logout())} className="bg-red-500 text-white p-2 mb-4 rounded cursor-pointer">
              Logout
            </button>
          </div>
          <div className="flex gap-2 mb-4 justify-evenly md:flex-row flex-col">
            <input
              type="text"
              placeholder="Enter task..."
              className="border-2 p-2.5 rounded-lg"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <select
              className="border-2 p-2 rounded-lg"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button onClick={handleAddTask} className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-black">
              Add Task
            </button>
            <button onClick={handleSort} className="bg-green-500 text-white p-2 rounded cursor-pointer hover:bg-black">
              Sort by Priority
            </button>
          </div>
          {status === "loading" ? (
            <p>Loading tasks...</p>
          ) : (
            <ul className="space-y-2">
              {sortedTasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center p-2 border rounded">
                  <span>{task.title}</span>
                  <div className='flex gap-2 items-center'>
                    <select
                      className="border p-1 rounded-lg"
                      value={task?.priority || "Medium"}
                      onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </> : (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl font-bold mb-4 text-center">Please login to view your tasks</h1>
            </div>
            <button onClick={() => dispatch(login())} className="bg-blue-500 text-white p-2 rounded cursor-pointer align-center">
              Login
            </button>
          </div>
        )}

    </div>
  );
}

export default App
