import type { User } from '~/interfaces/user';

interface Props {
  user: User;
}

export function UserCard({ user }: Props) {
  return (
    <div>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
}
