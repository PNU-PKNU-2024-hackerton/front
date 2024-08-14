import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../utils/formatDateTime";

export interface ExhibitionListProps {
  items: ExhibitionType[] | undefined;
}

export interface ExhibitionType {
  id: number;
  name: string;
  createdAt: string;
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
            className="flex w-full flex-col gap-2 rounded-md border-b px-2 py-4 hover:cursor-pointer hover:bg-neutral-200"
            onClick={() => {
              handleItemClick(item.id);
            }}
          >
            <a className="text-lg">{item.name}</a>
            <a className="text-sm text-neutral-400">
              {formatDateTime(item.createdAt)}
            </a>
          </div>
        ))}
    </div>
  );
}
