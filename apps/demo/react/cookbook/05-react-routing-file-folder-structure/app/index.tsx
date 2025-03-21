import { Route, Routes } from 'react-router';

import About from './routes/about/about';
import Dashboard from './routes/dashboard/dashboard';
import Home from './routes/dashboard/home/home';
import Settings from './routes/dashboard/settings/settings';
import UserDetail from './routes/dashboard/users/user';
import Users from './routes/dashboard/users/users';

export function App() {
  return (
    <Routes>
      <Route element={<Dashboard />} path="/">
        <Route element={<Home />} index />
        <Route element={<Settings />} path="settings" />
        <Route element={<Users />} path="users" />
        <Route element={<UserDetail />} path="users/:userId" />
      </Route>
      <Route element={<About />} path="about" />
    </Routes>
  );
}
