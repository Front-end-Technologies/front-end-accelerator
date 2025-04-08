<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface FetchedData {
  users: User[];
}

const useFetchUsers = await useFetch<FetchedData>(
  'https://dummyjson.com/users'
);

const { data: asyncData } = await useAsyncData<FetchedData>(
  'async-users',
  async () => {
    const response = await fetch('https://dummyjson.com/users');
    return await response.json();
  }
);

const {
  data: tanStackData,
  isLoading,
  suspense,
  isSuccess,
  error,
  refetch,
} = useQuery<FetchedData>({
  queryKey: ['tanstack-users'],
  queryFn: async (): Promise<FetchedData> => {
    const response = await fetch('https://dummyjson.com/users');
    return await response.json();
  },
});

const {
  data: tanStackDataWithUseFetch,
  refetch: refetchTanStackDataWithUseFetch,
} = useQuery<FetchedData>({
  queryKey: ['tanstack-users-with-useFetch'],
  queryFn: async (): Promise<FetchedData> => {
    const { data } = await useFetch<FetchedData>('https://dummyjson.com/users');
    return data.value!;
  },
});

// wait for full page load before showing the data when fetching with tanstack if needed
await suspense();
</script>

<template>
  <h1>useFetch</h1>

  <ul>
    <li>
      <strong>Simple Data Fetching</strong>: Easily fetch data from an API with
      minimal setup.
    </li>
    <li>
      <strong>Integration</strong>: Works seamlessly with Vue's reactivity
      system.
    </li>
    <li>
      <strong>Lightweight</strong>: A lightweight alternative for basic data
      fetching needs.
    </li>
  </ul>

  <ul>
    <li
      v-for="(user, index) in useFetchUsers.data?.value?.users.slice(0, 5)"
      :key="user.id"
    >
      {{ index + 1 }}. {{ user.firstName }} {{ user.lastName }}
    </li>
  </ul>

  <h1>useAsyncData</h1>

  <p>
    built-in data fetching from Vue, similar to tanstack query but more
    lightweight. For complex data fetching scenarios, use Tanstack Query.
  </p>

  <ul>
    <li v-for="(user, index) in asyncData?.users.slice(0, 5)" :key="user.id">
      {{ index + 1 }}. {{ user.firstName }} {{ user.lastName }}
    </li>
  </ul>

  <h1>TanStack Query Example</h1>
  <p>
    Handles all server state, no need load server state into Pinia. Cached
    clientside, allows all components to fetch from cache first Cache acts as
    global state manager.
  </p>

  <ul>
    <li>
      <strong>Caching</strong>: Automatically caches data and keeps it in sync
      with the server.
    </li>
    <li>
      <strong>Background Updates</strong>: Fetches fresh data in the background
      when needed.
    </li>
    <li>
      <strong>Error Handling</strong>: Built-in error handling for failed
      requests.
    </li>
    <li>
      <strong>Loading States</strong>: Provides loading and success states out
      of the box.
    </li>
    <li>
      <strong>Query Invalidation</strong>: Easily invalidate and refetch queries
      to keep data up-to-date.
    </li>
    <li>
      <strong>Devtools</strong>: Includes powerful devtools for debugging and
      monitoring queries.
    </li>
    <li>
      <strong>Server-Side Rendering (SSR)</strong>: Supports SSR for better
      performance and SEO.
    </li>
  </ul>

  <div v-if="error">Error</div>
  <div v-if="isLoading">Loading...</div>
  <ul v-if="isSuccess">
    <li v-for="(user, index) in tanStackData?.users.slice(0, 5)" :key="user.id">
      {{ index + 1 }}. {{ user.firstName }} {{ user.lastName }}
    </li>
  </ul>

  <button @click="() => refetch()">Refetch</button>

  <h1>Tanstack with useFetch combined</h1>

  <p>
    When combining useFetch with Tanstack, we can use the extra features of
    useFetch like serializations, interceptors, etc... and have the best of both
    worlds.
  </p>

  <ul>
    <li
      v-for="(user, index) in tanStackDataWithUseFetch?.users.slice(0, 5)"
      :key="user.id"
    >
      {{ index + 1 }}. {{ user.firstName }} {{ user.lastName }}
    </li>
  </ul>

  <button @click="() => refetchTanStackDataWithUseFetch()">
    Refetch Tanstack with useFetch
  </button>
  <p>open the tanstack query dev tools to play around with the cached data</p>
  <p>Keep in mind: Pinia Colada similar to Vue Query</p>
  <VueQueryDevtools />
</template>
