export default defineEventHandler(async (event) => {
  const { method, url } = event.node.req;
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
});
