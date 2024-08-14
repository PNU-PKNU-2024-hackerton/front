import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useExhibitionStore } from "../utils/store";
import { Painting } from "./ExhibitionDetails";
import defaultImg from "../assets/default-image-mountain.png";

export const mockPaintings: Painting[] = [
  {
    name: "Starry Night",
    description:
      "A famous painting by Vincent van Gogh depicting a night sky filled with swirling clouds and a bright crescent moon.",
    year: 1889,
    imageUrl: defaultImg,
  },
  {
    name: "Mona Lisa",
    description:
      "Leonardo da Vinci's masterpiece, known for its enigmatic smile and detailed background.",
    year: 1503,
    imageUrl: defaultImg,
  },
  {
    name: "The Persistence of Memory",
    description:
      "Salvador Dalí's iconic surrealist painting featuring melting clocks in a desert landscape.",
    year: 1931,
    imageUrl: defaultImg,
  },
  {
    name: "The Scream",
    description:
      "Edvard Munch's expressionist work, capturing a figure with an agonized expression against a tumultuous sky.",
    year: 1893,
    imageUrl: defaultImg,
  },
  {
    name: "Girl with a Pearl Earring",
    description:
      "Johannes Vermeer's famous portrait of a girl wearing an exotic dress, a large pearl earring, and a turban.",
    year: 1665,
    imageUrl: defaultImg,
  },
];

export default function ExhibitionHolder() {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const { setId, setName, setArtist, setCreatedAt, setPaintings } =
    useExhibitionStore();

  useEffect(() => {
    // 전시회 정보 불러오기
    setId(0);
    setName("Salvador Dali's Exhibition");
    setArtist("Salvador Dali");
    setCreatedAt("2024-08-12T10:15:30");
    setPaintings(mockPaintings);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <div className="flex w-full items-center justify-start px-5">
        <Button
          variant={"transparent"}
          className="items-center justify-center text-lg"
          onClick={() => navigate("/")}
        >
          MY LITTLE GALLERY
        </Button>
        <Button
          variant={"transparent"}
          className="items-center justify-center text-lg"
          onClick={() => navigate(`/exhibition/${exhibitionId}/front`)}
        >
          처음으로
        </Button>
      </div>
      <Outlet />
    </div>
  );
}
