import type { Todo } from '.';

export const getActiveTodos = (todos: Todo[]) =>
  todos.filter((todo) => !todo.completed).length;
