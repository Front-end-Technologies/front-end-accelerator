<script setup>
// State
const todos = useState('todos', () => []);
const newTodo = useState('newTodo', () => '');
const filter = useState('filter', () => 'all');

// Computed properties
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter((todo) => !todo.completed);
    case 'completed':
      return todos.value.filter((todo) => todo.completed);
    default:
      return todos.value;
  }
});

const activeCount = computed(() => {
  return getActiveCount(todos.value);
});

const completedCount = computed(() => {
  return getCompletedCount(todos.value);
});

// Methods
function addTodo() {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value.trim(),
      completed: false,
    });
    newTodo.value = '';
  }
}

function toggleTodo(id) {
  const todo = todos.value.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
}

function removeTodo(id) {
  todos.value = todos.value.filter((todo) => todo.id !== id);
}

function clearCompleted() {
  todos.value = todos.value.filter((todo) => !todo.completed);
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div data-testid="header" class="px-6 py-4 bg-emerald-500">
        <h1 class="text-2xl font-bold text-white">Nuxt Todo App</h1>
      </div>

      <!-- Add Todo Form -->
      <div class="p-6 border-b">
        <form class="flex" @submit.prevent="addTodo">
          <input
            v-model="newTodo"
            type="text"
            placeholder="Add a new task..."
            class="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
          <button
            type="submit"
            class="bg-emerald-500 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-600 transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      <!-- Filters -->
      <div class="px-6 py-3 bg-gray-50 flex justify-center space-x-4">
        <button
          :class="{ 'text-emerald-500 font-medium': filter === 'all' }"
          class="hover:text-emerald-500 transition-colors"
          @click="filter = 'all'"
        >
          All
        </button>
        <button
          :class="{ 'text-emerald-500 font-medium': filter === 'active' }"
          class="hover:text-emerald-500 transition-colors"
          @click="filter = 'active'"
        >
          Active
        </button>
        <button
          :class="{ 'text-emerald-500 font-medium': filter === 'completed' }"
          class="hover:text-emerald-500 transition-colors"
          @click="filter = 'completed'"
        >
          Completed
        </button>
      </div>

      <!-- Todo List -->
      <div class="p-6">
        <div
          v-if="filteredTodos.length === 0"
          class="text-center text-gray-500 py-4"
        >
          No tasks to display
        </div>

        <ul v-else class="space-y-3">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="flex items-center p-3 border rounded-lg group hover:bg-gray-50 transition-colors"
          >
            <label class="flex items-center grow">
              <input
                type="checkbox"
                :checked="todo.completed"
                class="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500 mr-3"
                @change="toggleTodo(todo.id)"
              >
              <span
                :class="{ 'line-through text-gray-400': todo.completed }"
                class="flex-1"
              >
                {{ todo.text }}
              </span>
            </label>
            <button
              :data-testid="`delete ${todo.text}`"
              class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              @click="removeTodo(todo.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18" />
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                />
              </svg>
            </button>
          </li>
        </ul>

        <!-- Summary -->
        <div
          v-if="todos.length > 0"
          class="mt-6 text-sm text-gray-500 flex justify-between items-center"
        >
          <span>{{ activeCount }} items left</span>
          <button
            v-if="completedCount > 0"
            class="text-gray-500 hover:text-emerald-500 transition-colors"
            @click="clearCompleted"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
