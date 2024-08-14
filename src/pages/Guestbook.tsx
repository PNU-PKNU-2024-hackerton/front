import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { Button } from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useExhibitionStore } from "../utils/store";
import axios from "axios";
import { useState } from "react";

export default function Guestbook() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const { exhibitionId } = useParams();
  const { paintings } = useExhibitionStore();
  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate(`/exhibition/${exhibitionId}/${paintings.length - 1}`);
  };

  const handleNext = () => {
    // if (!paintingIndex) return;
    // // 만약 그림이 남았다면 다음 그림으로
    // if (Number(paintingIndex) < paintings.length - 1) {
    //   navigate(`/exhibition/${exhibitionId}/${Number(paintingIndex) + 1}`);
    // } else {
    //   // 만약 마지막 그림이면 방명록으로
    //   navigate(`/exhibition/${exhibitionId}/guestbook`);
    // }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    // try {
    //   const body = {};

    //   const response = await axios.post("http://localhost:8080/", body);

    //   if (response.status === 200) {
    //     setSubmitted(true);
    //   }
    // } catch (e) {
    //   console.error("로그인 에러: ", e);
    //   navigate("/");
    // }
  };

  const handleCopy = () => {
    if (!exhibitionId) return;

    navigator.clipboard
      .writeText(`http://localhost:5173/exhibition/${exhibitionId}/front`)
      .then(() => {
        alert("링크가 복사되었습니다!");
      });
  };

  return (
    <div className="flex size-full justify-between">
      <Button
        variant={"transparent"}
        className="text-neutral-300"
        onClick={handlePrevious}
      >
        <ChevronLeft size={50} />
      </Button>
      <div className="flex size-full flex-col items-center justify-center gap-8 p-20">
        {submitted ? (
          <>
            <h1 className="text-3xl text-neutral-900">
              관람해주셔서 감사합니다.
            </h1>
            <a className="text-md text-neutral-400">
              링크로 다른 사람에게 이 전시회를 공유하세요
            </a>
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
          </>
        ) : (
          <div className="flex w-[500px] flex-col">
            <div className="mb-5 flex w-full justify-center text-2xl font-bold text-neutral-900">
              <a>방명록</a>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6 flex items-center justify-between gap-3">
                <a className="flex-none">성함</a>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 w-full rounded-lg border px-3 py-5"
                />
              </div>
              <div className="mb-6 flex items-center justify-between gap-3">
                <label className="flex-none">내용</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="h-32 w-full rounded-lg border px-3 py-5"
                  style={{ resize: "none" }}
                />
              </div>
              <Button className="w-full">방명록 쓰기</Button>
            </form>
          </div>
        )}
      </div>
      <Button
        variant={"transparent"}
        className="text-neutral-300 opacity-0"
        onClick={handleNext}
        disabled
      >
        <ChevronRight size={50} />
      </Button>
    </div>
  );
}
