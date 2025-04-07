export default defineNuxtRouteMiddleware(() => {
  // Runs on server then on client
  console.log('01. Global middleware is running');
});
