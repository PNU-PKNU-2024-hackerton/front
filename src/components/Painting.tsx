import { useEffect, useState } from "react";

interface PaintingProps {
  imageUrl: string;
  name: string;
  description?: string;
  year?: number;
}

export default function Painting({
  imageUrl,
  name,
  description,
  year,
}: PaintingProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true); // 컴포넌트가 렌더링될 때 fade-in
    return () => setIsVisible(false); // 컴포넌트가 언마운트될 때 fade-out
  }, [imageUrl]);

  return (
    <div
      className={`transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <img src={imageUrl} alt={name} className="object-contain" />
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-sm text-neutral-600">{description}</p>
      <a className="text-sm text-neutral-400">{year}</a>
    </div>
  );
}
