import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f8] text-slate-950">
      <Outlet />
    </main>
  );
}
