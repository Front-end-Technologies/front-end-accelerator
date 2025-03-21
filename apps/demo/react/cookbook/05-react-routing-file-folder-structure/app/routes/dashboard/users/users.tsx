import { Link } from 'react-router';

import { mockUsers } from '~/libs/utils';

function Users() {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {mockUsers.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
