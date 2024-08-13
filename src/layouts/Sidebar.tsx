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
import { logout } from "../utils/apis/serverAPI";
import { useUser } from "../hooks/useUser";
import { useChatRoomStore } from "../stores/useChatRoomStore";

export default function Sidebar() {
  const navigate = useNavigate();
  const { getUsername } = useUser();
  const { setCurrentChatRoomId } = useChatRoomStore();

  // 더보기 버튼
  const moreButtonItems = [
    {
      label: "설정",
      action: () => {
        navigate("/setting");
      },
      Icon: Settings,
    },
    {
      label: "로그아웃",
      action: async () => {
        // 로그아웃 로직 (로그아웃 API 호출 -> localStorage에서 토큰 삭제)
        try {
          await logout();
        } catch (e) {
          console.log("로그아웃 에러: ", e);
        } finally {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      },
      Icon: LogOut,
    },
  ];

  const handleUserClick = async () => {
    navigate(`/user/${getUsername()}`);
  };

  return (
    <div className="flex h-full w-[80px] flex-none flex-col items-center justify-start gap-y-10 border-r border-gray-200 pt-8">
      {/* 로고 버튼 */}
      <div>
        <Button variant={"ghost"}>
          <img src={logo} alt="Logo" className="w-10" />
        </Button>
      </div>
      {/* 그 외 버튼 */}
      <div className="flex flex-col items-center gap-3">
        <Button
          variant={"ghost"}
          onClick={() => {
            navigate("/");
          }}
        >
          <Home />
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            navigate("/search");
          }}
        >
          <Search />
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            navigate("/chat");
            setCurrentChatRoomId(-1);
          }}
        >
          <Send />
        </Button>
        <Button variant={"ghost"} onClick={handleUserClick}>
          <UserRound />
        </Button>
        <DropdownButton items={moreButtonItems}>
          <Button variant={"ghost"}>
            <Menu />
          </Button>
        </DropdownButton>
      </div>
    </div>
  );
}
