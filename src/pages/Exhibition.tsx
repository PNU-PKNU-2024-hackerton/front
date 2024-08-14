import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import defaultImg from "../assets/default-image-mountain.png";
import { useExhibitionStore } from "../utils/store";

export default function Exhibition() {
  const { exhibitionId, paintingIndex } = useParams();
  const navigate = useNavigate();
  const { paintings } = useExhibitionStore();

  const handlePrevious = () => {
    if (!paintingIndex) return;
    if (paintingIndex === "0") {
      navigate(`/exhibition/${exhibitionId}/front`);
    } else {
      navigate(`/exhibition/${exhibitionId}/${Number(paintingIndex) - 1}`);
    }
  };

  const handleNext = () => {
    if (!paintingIndex) return;
    // 만약 그림이 남았다면 다음 그림으로
    if (Number(paintingIndex) < paintings.length - 1) {
      navigate(`/exhibition/${exhibitionId}/${Number(paintingIndex) + 1}`);
    } else {
      // 만약 마지막 그림이면 방명록으로
      navigate(`/exhibition/${exhibitionId}/guestbook`);
    }
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
        <img
          src={paintings[Number(paintingIndex)].imageUrl}
          className="object-contain"
        />
        <h1 className="text-2xl font-bold">
          {paintings[Number(paintingIndex)].name}
        </h1>
        <p className="text-sm text-neutral-600">
          {paintings[Number(paintingIndex)].description}
        </p>
        <a className="text-sm text-neutral-400">
          {paintings[Number(paintingIndex)].year}
        </a>
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
