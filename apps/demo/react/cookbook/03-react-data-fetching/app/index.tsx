import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { useState } from 'react';

import type { User } from './users';

import { fetchUsers, getUsersAxios } from './api';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  );
}

function Users() {
  const [users, setUsers] = useState<null | User[]>();
  const [toggleQuery, setToggleQuery] = useState(false);

  const getUsersWithFetch = async () => {
    const data = await fetchUsers();
    setUsers(data.users);
  };

  const getUsersWithAxios = async () => {
    const data = await getUsersAxios();
    setUsers(data.users);
  };

  const query = useQuery({
    enabled: toggleQuery,
    queryFn: getUsersAxios,
    queryKey: ['users'],
  });

  return (
    <>
      <h1>Fetch data with Axios and Fetch API</h1>
      <p>
        The `Users` component demonstrates how to fetch data using different
        methods in a React application. It provides examples of fetching data
        with the Fetch API, Axios, and React Query. Fetch or Axios should only
        be used in the FE API or as services.
        <strong>
          Wrap your datafetching inside a useQuery hook from React Query.
        </strong>
      </p>

      <h1>Fetch / Axios</h1>
      <div>
        <button onClick={getUsersWithFetch}>Fetch API</button>
        <button onClick={getUsersWithAxios}>Axios.get</button>
        <button onClick={() => setUsers(null)}>Clear</button>
      </div>

      {users?.map((user) => (
        <div key={user.id}>
          <h3>
            {user.firstName} {user.lastName}
          </h3>
        </div>
      ))}
      <hr />
      <h1>With React Query</h1>
      <ul>
        <li>
          <strong>Simplified Data Fetching</strong>: Abstracts complexities of
          data fetching, caching, and synchronization.
        </li>
        <li>
          <strong>Automatic Caching</strong>: Reduces network requests and
          improves performance.
        </li>
        <li>
          <strong>Background Updates</strong>: Automatically refetches data to
          keep UI up-to-date.
        </li>
        <li>
          <strong>Error Handling</strong>: Built-in error management and
          display.
        </li>
        <li>
          <strong>DevTools</strong>: Powerful tools for inspecting and debugging
          queries.
        </li>
        <li>
          <strong>Optimistic Updates</strong>: Immediate UI updates while server
          processes changes.
        </li>
        <li>
          <strong>Polling and Pagination</strong>: Built-in support for these
          features.
        </li>
      </ul>

      <div>
        <button onClick={() => setToggleQuery((prev) => !prev)}>
          Toggle React Query
        </button>
        {toggleQuery && (
          <button onClick={() => query.refetch()}>Refetch</button>
        )}
      </div>

      {query.isFetching && <div>...Loading</div>}
      {query.error && <div>{query.error.message}</div>}

      {toggleQuery &&
        !query.isFetching &&
        query.data?.users?.map((user) => (
          <div key={user.id}>
            <h3>
              {user.firstName} {user.lastName}{' '}
            </h3>
          </div>
        ))}
    </>
  );
}
