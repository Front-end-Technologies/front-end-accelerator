import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Add a new task...' }).click();

  const todos = ['todo 1', 'todo 2', 'todo 3'];

  for (const todo of todos) {
    await page.getByRole('textbox', { name: 'Add a new task...' }).fill(todo);
    await page.getByRole('button', { name: 'Add todo' }).click();
  }
});

test.describe('UI', () => {
  test('blue header', async ({ page }) => {
    const header = page.getByTestId('blue-header');
    await expect(header).toHaveClass(/.*bg-blue-600.*/);
  });

  test('app title', async ({ page }) => {
    const title = page.getByText('Todo App');
    await expect(title).toHaveClass('text-2xl font-bold text-white');
  });
});

test.describe('Actions', () => {
  test('add todo', async ({ page }) => {
    await expect(page.getByText('todo 1')).toBeVisible();
  });

  test('toggle todo', async ({ page }) => {
    const item = page.getByRole('checkbox', { name: 'todo 1' });

    item.check();
    await expect(item).toBeChecked();
    await expect(page.getByText('todo 1')).toHaveClass(/.*line-through.*/);
  });

  test('delete todo', async ({ page }) => {
    const currentDeleteButton = page.getByTestId('delete todo 3');

    await currentDeleteButton.hover();
    await currentDeleteButton.click();

    await expect(page.getByText('todo 3')).not.toBeVisible();
  });

  test('active and completed items', async ({ page }) => {
    const item = page.getByRole('checkbox', { name: 'todo 3' });
    item.check();

    await expect(item).toBeChecked();

    const activeButton = page.getByRole('button', { name: 'Active' });
    await activeButton.click();

    await expect(page.getByText('todo 1')).toBeVisible();
    await expect(page.getByText('todo 2')).toBeVisible();
    await expect(page.getByText('todo 3')).not.toBeVisible();

    const completeButton = page.getByRole('button', { name: 'Completed' });
    await completeButton.click();

    await expect(page.getByText('todo 1')).not.toBeVisible();
    await expect(page.getByText('todo 2')).not.toBeVisible();
    await expect(page.getByText('todo 3')).toBeVisible();
  });
});
