import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ExhibitionList, {
  ExhibitionListProps,
  ExhibitionType,
} from "../components/ExhibitionList";
import axios from "axios";
import { useUserStore } from "../utils/store";

const mockExhibitionList: ExhibitionType[] = [
  {
    id: 0,
    name: "전시 01",
    createdAt: "2024-08-12T10:15:30",
  },
  {
    id: 1,
    name: "전시 02",
    createdAt: "2024-07-25T14:23:45",
  },
  {
    id: 2,
    name: "전시 03",
    createdAt: "2024-08-01T09:00:00",
  },
  {
    id: 3,
    name: "전시 04",
    createdAt: "2024-06-18T17:30:55",
  },
  {
    id: 4,
    name: "전시 05",
    createdAt: "2024-08-10T13:45:20",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [exhibitionList, setExhibitionList] = useState<ExhibitionType[]>();
  const { isAuthenticated, username } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchExhibitionList = async () => {
      try {
        const response = await axios.get<ExhibitionListProps>("/url");
        setExhibitionList(response.data.items);
      } catch (e) {
        console.error("전시회 목록 조회 실패: ", e);
      }
    };

    fetchExhibitionList();
  }, [isAuthenticated]);

  // 로그인 페이지
  const handleLoginClick = () => {
    navigate("/login");
  };

  // 새 전시 생성 페이지
  const handleCreateClick = () => {
    navigate("/exhibition/create");
  };

  return (
    <div className="flex h-full w-full max-w-[300px] flex-col items-start justify-start gap-y-10 border-r border-gray-900 px-5 pt-8">
      <a
        className="text-2xl hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        MY LITTLE GALLERY
      </a>
      <div className="w-full">
        {isAuthenticated ? (
          <div className="flex items-center justify-between">
            <a className="font-bold text-neutral-900">IamArtist</a>
            <Button variant={"ghost"} className="px-1 text-red-600">
              로그아웃
            </Button>
          </div>
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
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between">
          <a className="font-bold">내 전시</a>
          <Button
            variant={"transparent"}
            className="p-0"
            onClick={handleCreateClick}
          >
            <PlusCircle />
          </Button>
        </div>
      </div>
      {isAuthenticated ? (
        <ExhibitionList items={mockExhibitionList} />
      ) : (
        <div className="flex size-full items-center justify-center">
          <a className="text-neutral-400">로그인이 필요합니다</a>
        </div>
      )}
    </div>
  );
}
