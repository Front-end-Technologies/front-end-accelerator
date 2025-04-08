export const getActiveCount = (todos: { completed: boolean }[]) => {
  return todos.filter((todo) => !todo.completed).length;
};

export const getCompletedCount = (todos: { completed: boolean }[]) => {
  return todos.filter((todo) => todo.completed).length;
};
