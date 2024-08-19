import React, { useState, useEffect } from 'react';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            return JSON.parse(savedTodos);
        }
        return [];
    });
    const [inputText, setInputText] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = () => {
        if (inputText.trim() !== '') {
            const newTodo: Todo = {
                id: Date.now(),
                text: inputText.trim(),
                completed: false,
            };
            setTodos([...todos, newTodo]);
            setInputText('');
        }
    };

    const handleToggleTodo = (id: number) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleDeleteTodo = (id: number) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const handleEditTodo = (id: number) => {
        const todoToEdit = todos.find((todo) => todo.id === id);
        if (todoToEdit) {
            setEditingId(id);
            setEditText(todoToEdit.text);
        }
    };

    const handleSaveEdit = () => {
        if (editingId !== null) {
            setTodos(
                todos.map((todo) =>
                    todo.id === editingId ? { ...todo, text: editText } : todo
                )
            );
            setEditingId(null);
            setEditText('');
        }
    };

    const filteredTodos = todos.filter((todo) => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    return (
        <div className="App">
            <h1>Todo List</h1>
            <div>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Add a new todo"
                />
                <button onClick={handleAddTodo}>Add Todo</button>
            </div>
            <div>
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('active')}>Active</button>
                <button onClick={() => setFilter('completed')}>Completed</button>
            </div>
            <ul>
                {filteredTodos.map((todo) => (
                    <li key={todo.id}>
                        {editingId === todo.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <button onClick={handleSaveEdit}>Save</button>
                            </>
                        ) : (
                            <>
                <span
                    style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                    onClick={() => handleToggleTodo(todo.id)}
                >
                  {todo.text}
                </span>
                                <button onClick={() => handleEditTodo(todo.id)}>Edit</button>
                                <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;