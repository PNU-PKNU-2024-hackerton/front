import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Plus, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

type Slide = {
  id: number;
  title: string;
  description: string;
  year: string;
  image: File | null;
};

export default function CreateExhibition() {
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 로드 시 슬라이드 하나는 무조건 추가
    if (slides.length == 0) {
      addSlide();
    }
  }, []);

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: "",
      description: "",
      year: "",
      image: null,
    };
    setSlides([...slides, newSlide]);
    setSelectedSlideId(newSlide.id);
  };

  const updateSlide = (
    id: number,
    field: keyof Slide,
    value: string | File | null,
  ) => {
    setSlides(
      slides.map((slide) =>
        slide.id === id ? { ...slide, [field]: value } : slide,
      ),
    );
  };

  const deleteSlide = (id: number) => {
    setSlides(slides.filter((slide) => slide.id !== id));
    if (selectedSlideId === id) {
      setSelectedSlideId(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
    if (e.target.files && e.target.files[0]) {
      updateSlide(id, "image", e.target.files[0]);
    }
  };

  const handleCreateExhibition = () => {
    const exhibitionData = {
      name,
      artist,
      description,
      slides,
    };
    // 전시 데이터를 서버에 보내는 API 요청 작성 부분
    console.log("Exhibition Data:", exhibitionData);
    //navigate("/");
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedSlides = Array.from(slides);
    const [movedSlide] = reorderedSlides.splice(result.source.index, 1);
    reorderedSlides.splice(result.destination.index, 0, movedSlide);

    setSlides(reorderedSlides);
  };

  const selectedSlide = slides.find((slide) => slide.id === selectedSlideId);

  return (
    <div className="size-full max-w-screen-lg">
      <div className="flex h-full flex-col gap-10 px-10 py-20">
        <h1 className="text-3xl font-bold">새 전시 만들기</h1>
        <div className="flex flex-col gap-3">
          <label className="text-xl font-bold">전시 제목 *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Exhibition"
            className="rounded-xl bg-neutral-100 p-3 placeholder:text-neutral-400"
          ></input>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl font-bold">아티스트 이름</label>
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist"
            className="rounded-xl bg-neutral-100 p-3"
          ></input>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl font-bold">전시 설명</label>
          <textarea
            value={description}
            placeholder="This is my paintings."
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl bg-neutral-100 p-3 h-[200px] resize-none placeholder:text-neutral-400"
            style={{
              maxHeight: "200px", // 최대 높이를 설정
              overflow: "auto", // 최대 높이 초과 시 스크롤이 생기도록 설정
            }}
          ></textarea>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl font-bold">전시 슬라이드 *</label>
          <div className="flex w-full justify-between gap-5">
            {/* 전시 슬라이드 사이드바 */}
            <div className="flex w-full max-w-[200px] flex-col rounded-xl border p-5 shadow-md">
              {/* 헤더 */}
              <div className="mb-3 flex w-full items-center justify-between gap-2">
                <h4 className="whitespace-nowrap text-sm">슬라이드 목록</h4>
                <Button variant={"ghost"} onClick={addSlide}>
                  <Plus />
                </Button>
              </div>
              {/* 슬라이드 목록 아이템 */}
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="slides">
                  {(provided: any) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-col gap-3 text-xs"
                    >
                      {slides.map((slide, index) => (
                        <Draggable
                          key={slide.id}
                          draggableId={slide.id.toString()}
                          index={index}
                        >
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex cursor-pointer flex-col items-center justify-between gap-2 rounded-lg border p-2 shadow-md hover:bg-neutral-100 ${
                                selectedSlideId === slide.id
                                  ? "bg-neutral-100"
                                  : ""
                              }`}
                              onClick={() => setSelectedSlideId(slide.id)}
                            >
                              <div className="flex w-full items-center justify-between gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
                                <span className="text-neutral-500">{index}</span>
                                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                  {slide.title || "새 슬라이드"}
                                </span>
                                <Button
                                  variant={"transparent"}
                                  className="p-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSlide(slide.id);
                                  }}
                                >
                                  <X />
                                </Button>
                              </div>
                              {slide.image ? (
                                <img
                                  src={URL.createObjectURL(slide.image)}
                                  className="h-24 w-full rounded-md object-cover"
                                />
                              ) : (
                                <></>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            {/* 전시 슬라이드 수정/생성 */}
            {selectedSlide && (
              <div className="flex w-full flex-col justify-between gap-5 rounded-xl border p-5 shadow-md">
                <div className="flex aspect-video w-full items-center justify-center rounded-md">
                  <label className="cursor-pointer">
                    {selectedSlide.image ? (
                      <img
                        src={URL.createObjectURL(selectedSlide.image)}
                        alt="Slide"
                        className="max-h-full w-full"
                      />
                    ) : (
                      <div className="transition-colors flex size-full flex-col items-center justify-center gap-4 text-neutral-500 hover:text-black">
                        <Upload />
                        <p className="text-sm">사진을 업로드 하세요.</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, selectedSlide.id)}
                    />
                  </label>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <label>작품명</label>
                    <input
                      value={selectedSlide.title}
                      placeholder="My Painting"
                      onChange={(e) =>
                        updateSlide(selectedSlide.id, "title", e.target.value)
                      }
                      className="rounded-xl bg-neutral-100 p-3 placeholder:text-neutral-400"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>작품 설명</label>
                    <input
                      value={selectedSlide.description}
                      placeholder="A very beautiful painting."
                      onChange={(e) =>
                        updateSlide(
                          selectedSlide.id,
                          "description",
                          e.target.value,
                        )
                      }
                      className="rounded-xl bg-neutral-100 p-3 placeholder:text-neutral-400"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>제작 연도</label>
                    <input
                      value={selectedSlide.year}
                      placeholder="2024-08"
                      onChange={(e) =>
                        updateSlide(selectedSlide.id, "year", e.target.value)
                      }
                      className="rounded-xl bg-neutral-100 p-3 placeholder:text-neutral-400"
                    ></input>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mb-20 mt-5 w-full">
            <Button
              className="rounded-full px-6"
              onClick={handleCreateExhibition}
            >
              전시 만들기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
