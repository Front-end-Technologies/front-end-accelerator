export default defineNuxtRouteMiddleware(() => {
  // isAuthenticated() is an example method verifying if a user is authenticated

  // Example of checking authentication status
  const isAuthenticated = () => {
    // Replace with your actual authentication logic
    return true;
  };

  // authenticate with nuxt-auth and use the session
  // const { loggedIn } = useUserSession();

  if (isAuthenticated() === false) {
    return navigateTo('/login');
  }
});
