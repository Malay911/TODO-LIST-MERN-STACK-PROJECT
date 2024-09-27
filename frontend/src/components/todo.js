/*import React, { useEffect, useState } from "react";

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


    // Fetch tasks from the database using fetch API
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

    // Function to toggle the editable state for a specific row
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

    // Function to save edited task to the database using fetch API
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

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-7">
                    <h2 className="text-center">Todo List</h2>
                    <div className="table-responsive">
                        {loading ? (
                            <p>Loading tasks...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <table className="table table-bordered">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Task</th>
                                        <th>Status</th>
                                        <th>Deadline</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todoList.map((data) => (
                                        <tr key={data._id}>
                                            <td>
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
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editedStatus}
                                                        onChange={(e) => setEditedStatus(e.target.value)}
                                                    />
                                                ) : (
                                                    data.status
                                                )}
                                            </td>
                                            <td>
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
                                            </td>
                                            <td>
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
                                                        <i class="bi bi-pencil-square"></i>
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-danger btn-sm ml-1"
                                                    onClick={() => deleteTask(data._id)}
                                                >
                                                    <i class="bi bi-trash-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div className="col-md-5">
                    <h2 className="text-center">Add Task</h2>
                    <form className="bg-light p-4">
                        <div className="mb-3">
                            <label>Task</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Task"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Status</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Deadline</label>
                            <input
                                className="form-control"
                                type="datetime-local"
                                value={newDeadline}
                                onChange={(e) => setNewDeadline(e.target.value)}
                            />
                        </div>
                        <button onClick={addTask} className="btn btn-success btn-sm">
                            Add Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Todo;*/

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

    return (
        <div className="container mt-5 todo-container">
            <h2 className="text-center header-title mb-4">Todo List</h2>

            <div className="row">
                <div className="col-md-7 mb-4">
                    {loading ? (
                        <p>Loading tasks...</p>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <div className="todo-list">
                            {todoList.map((data) => (
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

                <div className="col-md-5">
                    <h3 className="text-center mb-4">Add Task</h3>
                    <form className="bg-light p-4 rounded shadow-sm">
                        <div className="mb-3">
                            <label>Task</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Task"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Status</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Deadline</label>
                            <input
                                className="form-control"
                                type="datetime-local"
                                value={newDeadline}
                                onChange={(e) => setNewDeadline(e.target.value)}
                            />
                        </div>
                        <button onClick={addTask} className="btn btn-success btn-block">
                            Add Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Todo;