import { ChevronDown, Plus } from "lucide-react";
import { ExhibitionType } from "../utils/types";
import { useEffect, useState } from "react";
import { Button } from "./Button";

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

export default function MyExhibitions() {
  const [exhibitions, setExhibitions] = useState<ExhibitionType[]>([]);

  useEffect(() => {
    // 내 전시 목록 불러오기
    setExhibitions(mockExhibitions);
  }, []);

  return (
    <div className="flex size-full max-w-screen-lg flex-col px-10 py-20 text-neutral-900">
      <div className="mb-5 flex w-full items-center justify-between">
        <p className="text-2xl font-bold">내 모든 전시</p>
        <div className="flex gap-2">
          <p>정렬</p>
          <ChevronDown />
        </div>
      </div>
      <div className="mb-5 h-0 w-full border-t" />
      {/* 전시 목록 */}
      <div className="grid grid-cols-1 gap-6 pb-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {exhibitions.map((exhibition) => (
          <div
            key={exhibition.id}
            className="rounded-lg border p-4 shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:cursor-pointer"
          >
            <img
              src={exhibition.thumbnailUrl}
              alt={exhibition.name}
              className="mb-4 h-40 w-full rounded-md object-cover"
            />
            <h3 className="text-lg font-semibold">{exhibition.name}</h3>
            <p className="text-sm text-neutral-500">
              {new Date(exhibition.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {/* 오른쪽 아래 고정된 버튼 */}
      <Button
        variant={"default"}
        className="fixed bottom-10 right-10 rounded-full p-4 shadow-xl hover:bg-neutral-500"
        onClick={() => console.log("Floating Button Clicked")}
      >
        <Plus />
      </Button>
    </div>
  );
}
