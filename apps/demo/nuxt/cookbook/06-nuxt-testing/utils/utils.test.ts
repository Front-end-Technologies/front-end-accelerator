import { describe, it, expect } from 'vitest';
import { getActiveCount, getCompletedCount } from './utils';

describe('getActiveCount', () => {
  it('should return 0 when there are no todos', () => {
    const todos: { completed: boolean }[] = [];
    expect(getActiveCount(todos)).toBe(0);
  });

  it('should return the correct count of active todos', () => {
    const todos = [
      { completed: false },
      { completed: true },
      { completed: false },
    ];
    expect(getActiveCount(todos)).toBe(2);
  });

  it('should return 0 when all todos are completed', () => {
    const todos = [
      { completed: true },
      { completed: true },
      { completed: true },
    ];
    expect(getActiveCount(todos)).toBe(0);
  });
});

describe('getCompletedCount', () => {
  it('should return 0 when there are no todos', () => {
    const todos: { completed: boolean }[] = [];
    expect(getCompletedCount(todos)).toBe(0);
  });

  it('should return the correct count of completed todos', () => {
    const todos = [
      { completed: false },
      { completed: true },
      { completed: true },
    ];
    expect(getCompletedCount(todos)).toBe(2);
  });

  it('should return 0 when all todos are active', () => {
    const todos = [
      { completed: false },
      { completed: false },
      { completed: false },
    ];
    expect(getCompletedCount(todos)).toBe(0);
  });
});
