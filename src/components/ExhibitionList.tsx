import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../utils/formatDateTime";
import { ExhibitionType } from "../utils/types";

export interface ExhibitionListProps {
  items: ExhibitionType[] | undefined;
}

export default function ExhibitionList({ items }: ExhibitionListProps) {
  const navigate = useNavigate();

  const handleItemClick = (itemId: number) => {
    navigate(`/exhibition/${itemId}/details`);
  };

  return (
    <div className="w-full overflow-auto">
      {items &&
        items.map((item, index) => (
          <div
            key={index}
            className="flex w-full items-center gap-2 rounded-md border-b px-2 py-3 hover:cursor-pointer hover:bg-neutral-200"
            onClick={() => {
              handleItemClick(item.id);
            }}
          >
            <img
              src={item.thumbnailUrl}
              alt={item.name}
              className="h-14 w-10 rounded-md object-cover"
            />
            <div className="flex flex-col gap-2">
              <a className="text-lg">{item.name}</a>
              <a className="text-sm text-neutral-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </a>
            </div>
          </div>
        ))}
    </div>
  );
}
