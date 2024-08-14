import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useExhibitionStore } from "../utils/store";
import { formatDateTime } from "../utils/formatDateTime";

export default function ExhibitionFront() {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const { name, artist, createdAt } = useExhibitionStore();

  const handlePrevious = () => {
    //navigate(`/exhibition/${exhibitionId}/0`);
  };

  const handleNext = () => {
    // 반드시 한 개 이상 그림 있다 가정
    navigate(`/exhibition/${exhibitionId}/0`);
  };

  return (
    <div className="flex size-full justify-between">
      <Button variant={"transparent"} className="opacity-0" disabled>
        <ChevronLeft size={50} />
      </Button>
      <div className="flex size-full items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-3xl font-extrabold">{name}</h1>
          <a className="text-xl text-neutral-600">{artist}</a>
          <a className="text-neutral-400">{formatDateTime(createdAt)}</a>
        </div>
      </div>
      <Button
        variant={"transparent"}
        className="text-neutral-300"
        onClick={handleNext}
      >
        <ChevronRight size={50} />
      </Button>
    </div>
  );
}
