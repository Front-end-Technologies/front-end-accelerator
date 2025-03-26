<script setup lang="ts">
const count = useState('count', () => 0);
</script>

<template>
  <h1>{{ count }}</h1>
  <button @click="count++">Increment</button>
</template>
