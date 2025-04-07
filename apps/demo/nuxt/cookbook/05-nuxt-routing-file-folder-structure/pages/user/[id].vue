<script setup lang="ts">
import type { User } from '~/interfaces/user';

definePageMeta({
  middleware: 'auth',
});

const {
  params: { id },
} = useRoute();

const { data } = await useFetch<User>(`https://dummyjson.com/users/${id}`);
</script>
<template>
  <div>
    <h1>User</h1>
    <div>
      <p><strong>ID:</strong> {{ data?.id }}</p>
      <p><strong>Name:</strong> {{ data?.firstName }} {{ data?.lastName }}</p>
      <p><strong>Email:</strong> {{ data?.email }}</p>
      <p><strong>Phone:</strong> {{ data?.phone }}</p>
    </div>
  </div>
</template>
