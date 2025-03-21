import React from 'react';
import { useParams } from 'react-router-dom';

import { UserCard } from '~/components/user-card';
import useToggle from '~/hooks/useToggle';
import { mockUsers } from '~/libs/utils';

function UserDetail() {
  const { userId } = useParams();

  const user = userId
    ? mockUsers.find((u) => u.id === parseInt(userId, 10))
    : undefined;

  const { toggle, value } = useToggle(true);

  return (
    <div>
      <h1>User Detail</h1>
      <button onClick={toggle}>{value ? 'Hide' : 'Show'} User Card</button>
      {value && user && <UserCard user={user} />}
    </div>
  );
}

export default UserDetail;
