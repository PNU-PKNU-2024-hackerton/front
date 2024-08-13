import {
  Home,
  Menu,
  Search,
  Send,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../assets/Logo-Full-BW.png";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import DropdownButton from "../components/DropdownButton";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-[80px] flex-none flex-col items-center justify-start gap-y-10 border-r border-gray-200 pt-8"></div>
  );
}
