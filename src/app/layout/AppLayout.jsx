import { Outlet } from "react-router-dom";
import Nav from "./Nav";

export default function AppLayout() {
  return (
    <>
      <Nav />
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </>
  );
}
