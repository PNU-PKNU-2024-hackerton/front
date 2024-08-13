import { useNavigate } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div>body</div>
    </div>
  );
}
