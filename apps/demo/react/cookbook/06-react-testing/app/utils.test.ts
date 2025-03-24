import { expect, test } from 'vitest';

import { getActiveTodos } from './utils';

const todos = [
  { completed: false, id: '1', text: 'todo 1' },
  { completed: true, id: '2', text: 'todo 2' },
  { completed: false, id: '3', text: 'todo 3' },
];

test('should return the correct number of active todos', () => {
  expect(getActiveTodos(todos)).toBe(2);
});

test('should return 0 when all todos are completed', () => {
  const allCompletedTodos = [
    { completed: true, id: '1', text: 'todo 1' },
    { completed: true, id: '2', text: 'todo 2' },
  ];
  expect(getActiveTodos(allCompletedTodos)).toBe(0);
});

test('should return the correct number when no todos are completed', () => {
  const noCompletedTodos = [
    { completed: false, id: '1', text: 'todo 1' },
    { completed: false, id: '2', text: 'todo 2' },
  ];
  expect(getActiveTodos(noCompletedTodos)).toBe(2);
});

test('should return 0 when there are no todos', () => {
  expect(getActiveTodos([])).toBe(0);
});
