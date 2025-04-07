export default defineNuxtRouteMiddleware(() => {
  // Runs on server then on client
  console.log('02. Analytics global middleware is running');
});
