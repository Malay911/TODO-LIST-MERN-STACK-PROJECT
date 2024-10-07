import React, { useEffect, useState } from "react";
import './todo.css';

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch('http://127.0.0.1:3001/getTodoList')
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }
                return response.json();
            })
            .then((data) => {
                setTodoList(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        } else {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedDeadline("");
        }
    };
    
    // Function to add task to the database using fetch API
    const addTask = (e) => {
        e.preventDefault();
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        const newTodo = { task: newTask, status: newStatus, deadline: newDeadline };

        fetch('http://127.0.0.1:3001/addTodoList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add task");
                }
                return response.json();
            })
            .then(() => {
                setTodoList([...todoList, newTodo]);
                setNewTask("");
                setNewStatus("");
                setNewDeadline("");
            })
            .catch((err) => console.error(err));
    };
    
    //Function to save edited task to the database using fetch API
    const saveEditedTask = (id) => {
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        fetch(`http://127.0.0.1:3001/updateTodoList/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update task");
                }
                return response.json();
            })
            .then(() => {
                setEditableId(null);
                setEditedTask("");
                setEditedStatus("");
                setEditedDeadline("");
                setTodoList((prevList) =>
                    prevList.map((item) => (item._id === id ? { ...item, ...editedData } : item))
                );
            })
            .catch((err) => console.error(err));
    };
    
    // Function to delete task from the database using fetch API
    const deleteTask = (id) => {
        fetch(`http://127.0.0.1:3001/deleteTodoList/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete task");
                }
                return response.json();
            })
            .then(() => {
                setTodoList(todoList.filter((item) => item._id !== id));
            })
            .catch((err) => console.error(err));
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredTodoList = searchTerm
        ? todoList.filter((task) =>
            task.task.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : todoList;

    return (
        <div className="container mt-5 todo-container">
            {/* <h2 className="text-center header-title mb-4">Todo List</h2> */}

            <h2
                className="text-center header-title mb-4"
                style={{
                    fontSize: '2.5rem',
                    color: '#007bff',
                    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
                    letterSpacing: '1px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #007bff, #00c6ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    position: 'relative',
                    paddingBottom: '10px',
                }}
            >
                Todo List
                <span
                    style={{
                        position: 'absolute',
                        bottom: '0px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60px',
                        height: '4px',
                        backgroundColor: '#007bff',
                        borderRadius: '2px',
                        animation: 'highlight 2s infinite',
                    }}
                ></span>
            </h2>

            <style>
                {`
        @keyframes highlight {
            0%, 100% {
                transform: translateX(-50%) scaleX(1);
            }
            50% {
                transform: translateX(-50%) scaleX(1.5);
            }
        }
    `}
            </style>

            <div className="col-md-6 mx-auto my-3 search-bar">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search tasks"
                        aria-label="Search tasks"
                    />
                    <span className="input-group-text bg-white border-0 rounded-pill search-icon">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </div>


            <div className="row">
                <div className="col-md-7 mb-4">
                    {loading ? (
                        <p>Loading tasks...</p>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <div className="todo-list">
                            {filteredTodoList.map((data) => (
                                <div className="card mb-3" key={data._id}>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {editableId === data._id ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editedTask}
                                                    onChange={(e) => setEditedTask(e.target.value)}
                                                />
                                            ) : (
                                                data.task
                                            )}
                                        </h5>
                                        <p className="card-text">
                                            {editableId === data._id ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editedStatus}
                                                    onChange={(e) => setEditedStatus(e.target.value)}
                                                />
                                            ) : (
                                                <span className={`status-badge ${data.status.toLowerCase()}`}>
                                                    {data.status}
                                                </span>
                                            )}
                                        </p>
                                        <p className="card-text">
                                            Deadline:{" "}
                                            {editableId === data._id ? (
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    value={editedDeadline}
                                                    onChange={(e) => setEditedDeadline(e.target.value)}
                                                />
                                            ) : (
                                                data.deadline ? new Date(data.deadline).toLocaleString() : ''
                                            )}
                                        </p>
                                        <div className="actions">
                                            {editableId === data._id ? (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => saveEditedTask(data._id)}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => toggleEditable(data._id)}
                                                >
                                                    <i className="bi bi-pencil-square"></i> Edit
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-danger btn-sm ml-2"
                                                onClick={() => deleteTask(data._id)}
                                            >
                                                <i className="bi bi-trash-fill"></i> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-md-5 mx-auto">
                    <h3 className="text-center mb-4 text-primary">Add Task</h3>
                    <form className="bg-white p-4 rounded shadow-lg" style={{ border: '1px solid #e3e3e3', background: 'linear-gradient(135deg, #f0f0f0, #ffffff)' }}>
                        <div className="mb-3">
                            <label className="form-label text-secondary">Task</label>
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white">
                                    <i className="bi bi-list-task"></i>
                                </span>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter Task"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-secondary">Status</label>
                            <div className="input-group">
                                <span className="input-group-text bg-info text-white">
                                    <i className="bi bi-flag"></i>
                                </span>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter Status"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-secondary">Deadline</label>
                            <div className="input-group">
                                <span className="input-group-text bg-warning text-white">
                                    <i className="bi bi-calendar"></i>
                                </span>
                                <input
                                    className="form-control"
                                    type="datetime-local"
                                    value={newDeadline}
                                    onChange={(e) => setNewDeadline(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            onClick={addTask}
                            className="btn btn-success btn-block w-100 py-2"
                            style={{ fontWeight: 'bold', letterSpacing: '1px' }}>
                            <i className="bi bi-plus-circle me-2"></i> Add Task
                        </button>
                    </form>
                </div>


            </div>
        </div>
    );
}

export default Todo;
