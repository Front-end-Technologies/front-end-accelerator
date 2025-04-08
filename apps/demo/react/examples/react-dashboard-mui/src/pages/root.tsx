import { Route, Routes } from "react-router";

import About from "./about/about";
import Dashboard from "./dashboard/dashboard";
import Examples from "./examples/examples";

function Root() {
  return (
    <Routes>
      <Route element={<Dashboard />} index path="/" />
      <Route element={<About />} path="/about" />
      <Route element={<Examples />} path="/examples" />
    </Routes>
  );
}

export default Root;
