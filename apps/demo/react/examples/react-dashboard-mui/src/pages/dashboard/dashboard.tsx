import { useState } from "react";

function Dashboard() {
  const [title] = useState("Dashboard");

  return (
    <>
      <h1>{title}</h1>
      <p>This is the dashboard page.</p>
    </>
  );
}

export default Dashboard;
