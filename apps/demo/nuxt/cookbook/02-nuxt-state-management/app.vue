<script setup lang="ts">
// useState
const count = useState('count', () => 0);

// Fetch initial state from api server-side
const initialUserState = useState('initialUserState');

await callOnce(async () => {
  initialUserState.value = await $fetch('https://dummyjson.com/users');
});

// pinia
const appStore = useAppStore();

// composables e.g. a toggle function
const toggle = useToggle();
</script>

<template>
  <!-- Wrap the component in a ClientOnly component to prevent server-side rendering
  only needed to run in webcontainers, not in the browser -->
  <ClientOnly>
    <h1>useState</h1>
    <p>useState count: {{ count }}</p>
    <p>
      useState is an SSR-friendly ref replacement. Its value will be preserved
      after server-side rendering (during client-side hydration) and shared
      across all components using a unique key.
    </p>
    <p>Count is set on the server, but is reactive on the client</p>
    <button @click="count++">Increment</button>

    <h1>Initial state from api fetch server-side</h1>
    <ul>
      <li v-for="user in initialUserState.users.slice(0, 5)" :key="user.id">
        {{ user.firstName }} {{ user.lastName }}
      </li>
    </ul>

    <h1>Pinia Global App store for shared state</h1>
    <p>
      Do not use Pinia for server state, use useState instead. Pinia is for
      client-side state that needs to be shared across components.
    </p>
    <p>
      for server-state use <strong>Tanstack Query</strong>, or Pinia Collada
    </p>
    <p>
      Pinia count from global store with increment store action:
      {{ appStore.count }}
    </p>
    <button @click="appStore.increment">Increment</button>

    <h1>Composables</h1>
    <p>
      Composables are a way to share logic across components. They are
      server-side friendly and can be used in any component.
    </p>
    <p>Toggle state: {{ toggle.isVisible }}</p>
    <button @click="toggle.toggle">Toggle</button>
  </ClientOnly>
</template>
