import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";
import { useEffect, useState } from "react";
import { useUserStore } from "../utils/store";
import Landing from "../components/Landing";
import { Button } from "../components/Button";

export default function Main() {
  const { isAuthenticated } = useUserStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex w-full justify-center overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
