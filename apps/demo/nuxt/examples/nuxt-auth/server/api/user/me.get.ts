export default defineEventHandler(async (event) => {
  // returns the secure session data to the client
  // authentication middleware
  const { user, secure } = await requireUserSession(event);

  return {
    user,
    secure,
  };
});
