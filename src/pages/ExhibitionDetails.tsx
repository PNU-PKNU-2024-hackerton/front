import { useNavigate, useParams } from "react-router-dom";
import defaultImg from "../assets/default-image-mountain.png";
import { useEffect, useState } from "react";
import { formatDateTime } from "../utils/formatDateTime";
import { Button } from "../components/Button";
import { Copy, PlusCircle } from "lucide-react";

export interface ExhibitionDetailsType {
  id: number;
  name: string;
  artist: string;
  createdAt: string;
  paintings: Painting[];
  guestbook: GuestbookItem[];
}

export interface Painting {
  name: string;
  description?: string;
  year?: number;
  imageUrl: string;
}

export interface GuestbookItem {
  author: string;
  content: string;
  createdAt: string;
}

const mockExhibitionDetails: ExhibitionDetailsType = {
  id: 0,
  name: "전시 01",
  artist: "Salvador Dali",
  createdAt: "2024-08-12T10:15:30",
  paintings: [
    {
      name: "그림 1",
      description: "설명입니다.",
      year: 2024,
      imageUrl: defaultImg,
    },
    {
      name: "그림 3",
      description: "설명입니다.",
      year: 2024,
      imageUrl: defaultImg,
    },
    {
      name: "그림 4",
      description: "설명입니다.",
      year: 2024,
      imageUrl: defaultImg,
    },
    {
      name: "그림 5",
      description: "설명입니다.",
      year: 2024,
      imageUrl: defaultImg,
    },
    {
      name: "그림 6",
      description: "설명입니다.",
      year: 2024,
      imageUrl: defaultImg,
    },
    {
      name: "그림 7",
      description: "설명입니다.",
      year: 2024,
      imageUrl: defaultImg,
    },
  ],
  guestbook: [
    {
      author: "친구",
      content: "그림 잘 봤어요~",
      createdAt: "2024-08-12T10:15:30",
    },
    {
      author: "친구",
      content: "그림 잘 봤어요~",
      createdAt: "2024-08-12T10:15:30",
    },
    {
      author: "친구",
      content: "그림 잘 봤어요~",
      createdAt: "2024-08-12T10:15:30",
    },
    {
      author: "친구",
      content: "그림 잘 봤어요~",
      createdAt: "2024-08-12T10:15:30",
    },
  ],
};

export default function ExhibitionDetails() {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const [exhibitionDetails, setExhibitionDetails] =
    useState<ExhibitionDetailsType>();

  useEffect(() => {
    // 전시 디테일 데이터 불러오기
    setExhibitionDetails(mockExhibitionDetails);
  }, []);

  const handleCopy = () => {
    if (!exhibitionId) return;

    navigator.clipboard
      .writeText(`http://localhost:5173/exhibition/${exhibitionId}/front`)
      .then(() => {
        alert("링크가 복사되었습니다!");
      });
  };

  const handleEnter = () => {
    if (!exhibitionId) return;

    navigate(`/exhibition/${exhibitionId}/front`);
  };

  return (
    <>
      {exhibitionDetails && (
        <div className="flex size-full max-w-screen-lg flex-col px-10 py-20 text-neutral-900">
          <h1 className="mb-3 text-2xl font-bold">{exhibitionDetails.name}</h1>
          <a className="mb-3 text-lg text-neutral-600">
            {exhibitionDetails.artist}
          </a>
          <a className="mb-3 text-lg text-neutral-600">
            {formatDateTime(exhibitionDetails.createdAt)}
          </a>
          <div className="mb-10 flex gap-10 text-neutral-500">
            <a>총 방문자 수 178,112 명</a>
            <a>좋아요 117</a>
          </div>
          <div className="flex w-full flex-col">
            <div className="flex w-full items-center justify-between py-4">
              <a className="font-bold">업로드 된 그림</a>
              <Button variant={"ghost"} className="text-sky-600">
                수정하기
              </Button>
            </div>
            <div className="flex gap-4 overflow-x-auto">
              {exhibitionDetails.paintings.map((painting, index) => (
                <div key={index} className="h-full overflow-hidden">
                  <img
                    src={painting.imageUrl}
                    className="h-full object-contain"
                  />
                </div>
              ))}
              <div className="flex h-full items-center p-5">
                <Button variant={"transparent"} className="text-neutral-400">
                  <PlusCircle />
                </Button>
              </div>
            </div>
            <div className="mt-10 flex items-center gap-5">
              <a className="font-bold text-neutral-600">전시회 링크</a>
              <a className="text-neutral-400">
                http://localhost:5173/exhibition/{exhibitionId}/front
              </a>
              <Button
                className="flex w-fit items-center justify-center gap-1 text-sm"
                onClick={handleCopy}
              >
                <Copy />
                <a>복사하기</a>
              </Button>
            </div>
          </div>
          <div className="mt-10 flex w-full items-center justify-start">
            <Button className="rounded-full px-6" onClick={handleEnter}>
              전시회 입장하기
            </Button>
          </div>
          <div className="mt-10 flex w-full flex-col pb-10">
            <div className="flex w-full justify-center">
              <a className="text-xl text-neutral-500">전시 방명록</a>
            </div>
            {exhibitionDetails.guestbook.map((post, index) => (
              <div key={index} className="flex flex-col gap-3 border-b py-5">
                <a className="text-xl font-bold">{post.author}</a>
                <a>{post.content}</a>
                <a className="text-sm text-neutral-500">
                  {formatDateTime(post.createdAt)}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
