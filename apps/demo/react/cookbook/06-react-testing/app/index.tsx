'use client';

import type React from 'react';

import { useState } from 'react';

export type Todo = {
  completed: boolean;
  id: string;
  text: string;
};

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'active' | 'all' | 'completed'>('all');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    const todo: Todo = {
      completed: false,
      id: crypto.randomUUID(),
      text: newTodo,
    };

    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6" data-testid="blue-header">
          <h1 className="text-2xl font-bold text-white">Todo App</h1>
        </div>

        <form className="p-6 flex gap-2" onSubmit={addTodo}>
          <input
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            type="text"
            value={newTodo}
          />
          <button
            aria-label="Add todo"
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="submit"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" x2="12" y1="8" y2="16"></line>
              <line x1="8" x2="16" y1="12" y2="12"></line>
            </svg>
          </button>
        </form>

        <div className="px-6 pb-2 flex gap-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <ul className="divide-y divide-gray-200 px-6 py-4">
          {filteredTodos.length === 0 ? (
            <li className="py-4 text-center text-gray-500">
              {filter === 'all'
                ? 'Add your first todo!'
                : filter === 'active'
                  ? 'No active todos'
                  : 'No completed todos'}
            </li>
          ) : (
            filteredTodos.map((todo) => (
              <li
                className="py-3 flex items-center justify-between group"
                key={todo.id}
              >
                <label className="flex items-center gap-3">
                  <input
                    checked={todo.completed}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={() => toggleTodo(todo.id)}
                    placeholder={todo.text}
                    type="checkbox"
                  />
                  <span
                    className={`text-sm transition-all ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                  >
                    {todo.text}
                  </span>
                </label>
                <button
                  className="p-1 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  data-testid={`delete ${todo.text}`}
                  onClick={() => deleteTodo(todo.id)}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                  </svg>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="px-6 py-4 bg-gray-50 text-sm text-gray-500">
          {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
        </div>
      </div>
    </div>
  );
}
