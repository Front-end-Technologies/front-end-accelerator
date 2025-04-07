<template>
  <header>
    <nav>
      <ul>
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/about">About</NuxtLink></li>
        <li><NuxtLink to="/users">Users</NuxtLink></li>
      </ul>

      <ul>
        <li><NuxtLink to="/user/1">User 1</NuxtLink></li>
        <li><NuxtLink to="/user/2">User 2</NuxtLink></li>
      </ul>
    </nav>
  </header>

  <NuxtLoadingIndicator />
  <NuxtPage />
</template>
