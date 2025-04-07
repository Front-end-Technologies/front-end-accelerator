<script setup lang="ts">
import type { UserResponse } from '~/interfaces/user';

definePageMeta({
  middleware: 'auth',
});

const { data } = await useFetch<UserResponse>('https://dummyjson.com/users', {
  params: {
    limit: 5,
  },
  // fake interceptor
  onRequest({ options }) {
    options.headers.set('Authorization', 'fake-bearer-token');
  },
});
</script>
<template>
  <div>
    <h1>Users</h1>
    <div>
      <ul>
        <li v-for="user in data?.users" :key="user.id">
          <NuxtLink :to="`/user/${user.id}`">
            {{ user.firstName }} {{ user.lastName }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
