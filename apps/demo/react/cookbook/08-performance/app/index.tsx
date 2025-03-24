import { useState } from 'react';

export function App() {
  const [title] = useState('Hello World');

  return <h1>{title}</h1>;
}
