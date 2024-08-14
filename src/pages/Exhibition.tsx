import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import defaultImg from "../assets/default-image-mountain.png";
import { useExhibitionStore } from "../utils/store";

export default function Exhibition() {
  const { exhibitionId, paintingIndex } = useParams();
  const navigate = useNavigate();
  const { paintings } = useExhibitionStore();

  // State to handle the opacity transition
  const [fadeOut, setFadeOut] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);

  useEffect(() => {
    if (nextPage) {
      const timer = setTimeout(() => {
        navigate(nextPage);
        setFadeOut(false);
        setNextPage(null);
      }, 500); // Match the duration with your CSS transition time

      return () => clearTimeout(timer);
    }
  }, [nextPage, navigate]);

  const handlePrevious = () => {
    if (!paintingIndex) return;
    setFadeOut(true);
    setNextPage(
      paintingIndex === "0"
        ? `/exhibition/${exhibitionId}/front`
        : `/exhibition/${exhibitionId}/${Number(paintingIndex) - 1}`,
    );
  };

  const handleNext = () => {
    if (!paintingIndex) return;
    setFadeOut(true);
    setNextPage(
      Number(paintingIndex) < paintings.length - 1
        ? `/exhibition/${exhibitionId}/${Number(paintingIndex) + 1}`
        : `/exhibition/${exhibitionId}/guestbook`,
    );
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
      <div
        className={`flex flex-col items-center justify-center gap-8 p-20 transition-opacity duration-300 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={paintings[Number(paintingIndex)]?.imageUrl || defaultImg}
          className="h-[450px] object-cover"
          alt={paintings[Number(paintingIndex)]?.name || "Artwork"}
        />
        <h1 className="text-2xl font-bold">
          {paintings[Number(paintingIndex)]?.name || "Unknown Title"}
        </h1>
        <p className="text-sm text-neutral-600">
          {paintings[Number(paintingIndex)]?.description || "No Description"}
        </p>
        <a className="text-sm text-neutral-400">
          {paintings[Number(paintingIndex)]?.year || "Unknown Year"}
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
