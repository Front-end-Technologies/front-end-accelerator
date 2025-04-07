import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('textbox', { name: 'Add a new task...' }).click();

  const todos = ['todo 1', 'todo 2', 'todo 3'];

  for (const todo of todos) {
    await page.getByRole('textbox', { name: 'Add a new task...' }).fill(todo);
    await page.getByRole('button', { name: 'Add' }).click();
  }
});

test.describe('UI', () => {
  test('emerald header', async ({ page }) => {
    const header = page.getByTestId('header');
    await expect(header).toHaveClass(/.*bg-emerald-500.*/);
  });

  test('app title', async ({ page }) => {
    const title = page.getByText('Nuxt Todo App');
    await expect(title).toHaveClass('text-2xl font-bold text-white');
  });

  test('hover button', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Add' });
    await expect(button).toHaveClass(/.*bg-emerald-500.*/);
    await button.hover();
    await expect(button).toHaveClass(/.*hover:bg-emerald-600.*/);
  });

  test('filter buttons', async ({ page }) => {
    const allLink = page.getByRole('button', { name: 'All' });
    const activeLink = page.getByRole('button', { name: 'Active' });
    const completedLink = page.getByRole('button', { name: 'Completed' });

    await expect(allLink).toHaveClass(/.*text-emerald-500.*/);
    await allLink.hover();
    await expect(allLink).toHaveClass(/.*hover:text-emerald-500.*/);

    await activeLink.hover();
    await expect(activeLink).toHaveClass(/.*hover:text-emerald-500.*/);
    await activeLink.click();
    await expect(activeLink).toHaveClass(/.*text-emerald-500.*/);

    await completedLink.hover();
    await expect(completedLink).toHaveClass(/.*hover:text-emerald-500.*/);
    await completedLink.click();
    await expect(activeLink).toHaveClass(/.*text-emerald-500.*/);
  });

  test('delete button', async ({ page }) => {
    const deleteButton = page.getByTestId('delete todo 1');
    await expect(deleteButton).toHaveClass(/.*text-gray-400.*/);
    await deleteButton.hover();
    await expect(deleteButton).toHaveClass(/.*hover:text-red-500.*/);
  });

  test('clear button', async ({ page }) => {
    const item = page.getByRole('checkbox', { name: 'todo 3' });
    item.check();

    const clearButton = page.getByRole('button', { name: 'Clear' });
    await expect(clearButton).toHaveClass(/.*text-gray-500.*/);
    await clearButton.hover();
    await expect(clearButton).toHaveClass(/.*hover:text-emerald-500.*/);
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

  test('clear completed', async ({ page }) => {
    const item = page.getByRole('checkbox', { name: 'todo 3' });
    item.check();

    const clearButton = page.getByRole('button', { name: 'Clear' });
    await clearButton.click();

    await expect(page.getByText('todo 3')).not.toBeVisible();
  });
});
