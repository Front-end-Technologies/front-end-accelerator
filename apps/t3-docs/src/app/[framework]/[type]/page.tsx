'use client';

import { useParams } from 'next/navigation';

export default function Overview() {
  const { framework, type } = useParams();

  return (
    <h1>
      {framework} {type} overview page
    </h1>
  );
}
