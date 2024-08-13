import {
  AudioLines,
  CirclePlus,
  EllipsisVertical,
  Headphones,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { Button } from "./Button";
import { usePlayer } from "../hooks/usePlayer";
import { formatDuation } from "../utils/formatDuration";
import { useState } from "react";
import DropdownButton from "./DropdownButton";

export default function CurrentChatRoom() {
  const { isCurrentChatRoomOpen } = useChatRoomStore();
  const {
    seek,
    resumePlayer,
    pausePlayer,
    playAtIndex,
    removeFromCurrentPlaylist,
  } = usePlayer();
  const {
    duration,
    position,
    paused,
    setPosition,
    currentPlaylist,
    currentPlaylistIndex,
  } = usePlayerStore();
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>(
    null,
  );
  const [newPosition, setNewPosition] = useState<number>();

  // 트랙 위치 변경
  const handleSeek = () => {
    if (!newPosition) return;
    seek(newPosition);
  };

  return (
    <div
      className={`absolute z-10 flex h-full w-full items-center justify-center bg-white transition-transform duration-300 ${
        isCurrentChatRoomOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex size-full flex-col border-r">
        <div className="flex size-full items-center justify-center">
          <p className="text-sm text-neutral-400">
            현재 같이 듣기 중인 채팅방이 없습니다
          </p>
        </div>
      </div>
      <div className="flex size-full max-w-[500px] flex-col">
        <div className="flex size-full flex-1 flex-col items-center border-b p-5">
          {currentPlaylist[currentPlaylistIndex] ? (
            <>
              <div className="mb-5 flex w-full justify-between">
                <Button
                  variant={"transparent"}
                  className="text-neutral-900 hover:text-neutral-500"
                >
                  <Headphones />
                </Button>
                <Button
                  variant={"transparent"}
                  className="text-neutral-900 hover:text-neutral-500"
                >
                  <EllipsisVertical />
                </Button>
              </div>
              <div className="flex max-w-[300px] flex-none flex-col gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
                <img
                  src={
                    currentPlaylist[currentPlaylistIndex].album.images[0].url
                  }
                  className="w-full rounded-lg"
                />
                <div className="flex flex-col gap-1">
                  <p className="overflow-hidden text-ellipsis text-2xl font-semibold text-neutral-900">
                    {currentPlaylist[currentPlaylistIndex].name}
                  </p>
                  <p className="text-lg text-neutral-500">
                    {currentPlaylist[currentPlaylistIndex].artists[0].name}
                  </p>
                </div>
                <div className="relative flex items-center justify-between gap-3">
                  <p className="text-sm text-neutral-400">
                    {formatDuation(position)}
                  </p>
                  <input
                    className="h-0.5 w-full cursor-pointer appearance-none bg-neutral-200 accent-[#FF6735] outline-none disabled:accent-gray-200"
                    type="range"
                    min="0"
                    max={duration}
                    value={position}
                    onChange={(e) => {
                      e.preventDefault();
                      setNewPosition(Number(e.target.value));
                      setPosition(Number(e.target.value));
                    }}
                    onMouseUp={handleSeek}
                    style={{
                      background: `linear-gradient(to right, #FF6735 ${(position / duration) * 100}%, #E5E7EB ${(position / duration) * 100}%)`,
                    }}
                  />
                  <p className="text-sm text-neutral-400">
                    {formatDuation(duration)}
                  </p>
                </div>
                <div className="flex w-full justify-between">
                  <Button variant={"transparent"}>
                    <Repeat size={18} />
                  </Button>
                  <Button variant={"transparent"} className="text-neutral-600">
                    <SkipBack />
                  </Button>
                  {paused ? (
                    <Button
                      className="rounded-full p-3"
                      onClick={() => resumePlayer()}
                    >
                      <Play size={30} />
                    </Button>
                  ) : (
                    <Button
                      className="rounded-full p-3"
                      onClick={() => pausePlayer()}
                    >
                      <Pause size={30} />
                    </Button>
                  )}
                  <Button variant={"transparent"} className="text-neutral-600">
                    <SkipForward />
                  </Button>
                  <Button variant={"transparent"}>
                    <Shuffle size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex size-full items-center justify-center">
              <p className="text-sm text-neutral-400">
                재생 중인 곡이 없습니다
              </p>
            </div>
          )}
        </div>
        {/*현재 플레이리스트*/}
        <div className="flex size-full flex-1 flex-col overflow-y-auto">
          {currentPlaylist &&
            currentPlaylist.map((track, index) => (
              <div
                key={index}
                className={`flex h-[65px] w-full flex-none items-center justify-between border-b px-4 py-2 hover:bg-neutral-100 ${index === currentPlaylistIndex ? "bg-neutral-100" : ""}`}
                onMouseEnter={() => setHoveredTrackIndex(index)}
                onMouseLeave={() => setHoveredTrackIndex(null)}
              >
                <div className="flex w-full gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
                  <div
                    className="relative flex size-14 flex-none rounded-sm hover:cursor-pointer"
                    onClick={() => playAtIndex(index)}
                  >
                    <img
                      src={track.album.images[0].url}
                      className="h-full rounded-sm object-cover"
                      alt="Album Art"
                    />
                    {index === -1 && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-black bg-opacity-50">
                        <AudioLines className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    <p
                      className="w-fit overflow-hidden text-ellipsis whitespace-nowrap text-neutral-900 hover:cursor-pointer"
                      onClick={() => playAtIndex(index)}
                    >
                      {track.name}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {track.artists[0].name}
                    </p>
                  </div>
                </div>
                <div className="flex w-10 items-center justify-center gap-1">
                  {index === hoveredTrackIndex ? (
                    <DropdownButton
                      items={[
                        {
                          label: "현재 재생목록에서 삭제",
                          action: () => {
                            removeFromCurrentPlaylist(index);
                          },
                        },
                      ]}
                    >
                      <Button
                        variant={"ghost"}
                        className="rounded-full p-3 hover:bg-neutral-300"
                      >
                        <EllipsisVertical />
                      </Button>
                    </DropdownButton>
                  ) : (
                    <p className="text-neutral-500">
                      {formatDuation(track.duration_ms)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          <div className="flex h-fit w-full items-center justify-center py-10">
            <Button variant={"transparent"}>
              <CirclePlus />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
