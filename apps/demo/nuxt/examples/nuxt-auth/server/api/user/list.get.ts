export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export default defineEventHandler(async (event) => {
  // requireUserSession is a middleware that checks if the user is authenticated
  const { secure } = await requireUserSession(event);

  // intercept and add the token to the request
  // use axios interceptors or fetch interceptors
  // accessToken never leaves the server
  const response = await fetch('https://dummyjson.com/users', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secure?.accessToken}`,
    },
  });
  const data = await response.json();
  const users = data.users as User[];

  return users;
});
