import { ChangeEvent, useState } from "react";
import { Button } from "../components/Button";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateExhibition() {
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [showImages, setShowImages] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleAddImages = (event: ChangeEvent<HTMLInputElement>): void => {
    const imageLists = event.target.files;
    if (!imageLists) return;
    console.log(imageLists);
    let imageUrlLists = [...showImages];

    for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      imageUrlLists.push(currentImageUrl);
    }

    if (imageUrlLists.length > 10) {
      imageUrlLists = imageUrlLists.slice(0, 10);
    }

    setShowImages(imageUrlLists);
  };

  // Handles deleting an image from the state
  const handleDeleteImage = (id: number): void => {
    setShowImages(showImages.filter((_, index) => index !== id));
  };

  return (
    <div className="size-full">
      <div className="flex h-full max-w-screen-lg flex-col gap-10 px-10 py-20">
        <h1 className="text-3xl font-bold">전시 만들기</h1>
        <a className="text-xl font-bold">전시 제목</a>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-b text-xl"
        ></input>
        <a className="text-xl font-bold">아티스트 이름</a>
        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="border-b text-xl"
        ></input>
        <a className="text-xl font-bold">그림 업로드</a>
        <div className="flex flex-col gap-5">
          <input
            type="file"
            id="input-file"
            multiple
            onChange={handleAddImages}
          />
          <div className="flex gap-10">
            {showImages.map((image, id) => (
              <div key={id} className="flex h-48 overflow-hidden">
                <img src={image} alt={`image-${id}`} className="object-cover" />
                <Button
                  variant={"ghost"}
                  onClick={() => handleDeleteImage(id)}
                  className="size-fit"
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
          <div className="mb-20 mt-10 w-full">
            <Button
              className="rounded-full px-6"
              onClick={() => {
                navigate("/");
              }}
            >
              전시 만들기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
