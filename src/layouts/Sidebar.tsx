import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import {
  ChevronDown,
  EllipsisVertical,
  LogOut,
  Menu,
  Plus,
  PlusCircle,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import ExhibitionList, {
  ExhibitionListProps,
} from "../components/ExhibitionList";
import axios from "axios";
import { useUserStore } from "../utils/store";
import defaultImg from "../assets/default-user-image.png";
import DropdownButton from "../components/DropdownButton";
import { ExhibitionType } from "../utils/types";

const mockExhibitions: ExhibitionType[] = [
  {
    id: 1,
    name: "Modern Art Exhibition",
    thumbnailUrl:
      "https://i.pinimg.com/564x/06/50/cf/0650cfc55a5efa2a27bf3024c6184e69.jpg",
    createdAt: "2023-08-01T10:30:00Z",
  },
  {
    id: 2,
    name: "Photography Wonders",
    thumbnailUrl:
      "https://i.pinimg.com/564x/08/26/da/0826da75d4feac9d41ce64754008cda7.jpg",
    createdAt: "2023-07-20T14:45:00Z",
  },
  {
    id: 3,
    name: "Sculpture Masterpieces",
    thumbnailUrl:
      "https://i.pinimg.com/564x/1a/93/7c/1a937c702c1f80c3f73f8188db18ee20.jpg",
    createdAt: "2023-06-15T09:15:00Z",
  },
  {
    id: 4,
    name: "Impressionist Collection",
    thumbnailUrl:
      "https://i.pinimg.com/564x/07/fd/eb/07fdeb7e11043b1186fb7ddadd3c050e.jpg",
    createdAt: "2023-05-30T16:20:00Z",
  },
  {
    id: 5,
    name: "Abstract Art Showcase",
    thumbnailUrl:
      "https://i.pinimg.com/564x/23/7c/ee/237ceed7146eccac189ccedd69d6e3de.jpg",
    createdAt: "2023-05-10T12:00:00Z",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState<ExhibitionType[]>();
  const { isAuthenticated, username, setIsAuthenticated } = useUserStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchExhibitionList = async () => {
      try {
        const response = await axios.get<ExhibitionListProps>("/url");
        setExhibitions(response.data.items);
      } catch (e) {
        console.error("전시회 목록 조회 실패: ", e);
      }
    };

    //fetchExhibitionList();
    setExhibitions(mockExhibitions);
  }, [isAuthenticated]);

  // 로그인 페이지
  const handleLoginClick = () => {
    navigate("/login");
  };

  // 새 전시 생성 페이지
  const handleCreateClick = () => {
    navigate("/exhibition/create");
  };

  // 로그아웃 버튼
  const handleLogout = () => {
    setIsAuthenticated(false);
    //navigate("/");
  };

  return (
    <div className="flex h-full text-neutral-900">
      <div className="absolute p-2 lg:hidden">
        <Button
          variant={"ghost"}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu />
        </Button>
      </div>
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 z-50 flex h-full w-full max-w-[300px] flex-col items-start justify-start border-r border-gray-900 bg-white px-2 pt-2 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
      >
        <div className="mb-5 flex w-full items-center justify-between">
          <Button
            className="lg:hidden"
            variant={"ghost"}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <X />
          </Button>
          <a
            className="p-2 text-2xl hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            MALLERY
          </a>
        </div>
        <div className="flex w-full flex-col">
          {isAuthenticated ? (
            <>
              <div className="mb-10 flex items-center justify-between">
                <DropdownButton
                  items={[
                    { label: "설정", action: () => {}, Icon: Settings },
                    {
                      label: "로그아웃",
                      action: () => {
                        handleLogout();
                      },
                      Icon: LogOut,
                    },
                  ]}
                >
                  <Button
                    variant={"ghost"}
                    className="flex max-w-full items-center justify-between rounded-full border border-neutral-500 px-3 text-neutral-900"
                    onClick={() => {}}
                  >
                    <img
                      src={defaultImg}
                      alt="profile_picture"
                      className="mr-3 size-6 object-contain"
                    />
                    <a className="mr-3 size-fit min-w-0 max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap">
                      username
                    </a>
                    <ChevronDown />
                  </Button>
                </DropdownButton>
              </div>
              <div className="px-2">
                <div className="mb-5 flex items-center justify-between">
                  <a
                    className="font-bold hover:cursor-pointer hover:underline hover:underline-offset-4"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    내 전시 ▸
                  </a>
                  <Button
                    variant={"transparent"}
                    className="flex items-center p-0"
                    onClick={handleCreateClick}
                  >
                    <a className="mr-2">새 전시</a>
                    <Plus />
                  </Button>
                </div>
                <ExhibitionList items={exhibitions} />
              </div>
            </>
          ) : (
            <Button
              variant={"default"}
              className="w-full rounded-full"
              onClick={handleLoginClick}
            >
              로그인
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
