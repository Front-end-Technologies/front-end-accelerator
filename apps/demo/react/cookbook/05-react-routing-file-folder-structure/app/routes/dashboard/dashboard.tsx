import { Link, Outlet } from 'react-router';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome to the dashboard! This is the place for your navigation and
        other shared UI.
      </p>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/about">
              About link to a complete new page without shared UI
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default Dashboard;
