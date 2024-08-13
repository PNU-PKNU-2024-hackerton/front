import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { spotifySearch } from "../utils/apis/spotifyAPI";
import { formatDuation } from "../utils/formatDuration";
import { Button } from "./Button";
import { EllipsisVertical, ListPlus, UserPlus } from "lucide-react";
import {
  joinChatRoom,
  searchChatRooms,
  searchUsers,
} from "../utils/apis/serverAPI";
import defaultUserImage from "../assets/default-user-image.png";
import defaultChatRoomImage from "../assets/default-image-mountain.png";
import DropdownButton from "./DropdownButton";
import { usePlayer } from "../hooks/usePlayer";

export function SearchResults() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [query, setQuery] = useState<string | null>(null);
  const navigate = useNavigate();
  const { playNewTrack, justPlayTrack, addToCurrentPlaylist } = usePlayer();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get("query");
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [location.search]);

  // 트랙 검색
  const {
    data: spotifyData,
    error: spotifyError,
    isLoading: spotifyLoading,
  } = useQuery({
    queryKey: ["spotifyData", query],
    queryFn: () => spotifySearch(query || ""),
    enabled: !!query,
  });

  // 유저 검색
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: () => searchUsers(query || ""),
    enabled: !!query,
  });

  // 채팅방 검색
  const {
    data: chatRoomData,
    error: chatRoomError,
    isLoading: chatRoomLoading,
  } = useQuery({
    queryKey: ["searchChatRooms", query],
    queryFn: () => searchChatRooms(query || ""),
    enabled: !!query,
  });

  // 채팅방 참가 요청
  const { mutate } = useMutation({
    mutationFn: joinChatRoom,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      navigate(`/chat/${variables}`);
    },
  });

  // 채팅방 클릭 시
  const handleChatRoomClick = (chatRoomId: number) => {
    mutate(chatRoomId);
  };

  if (!query) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-neutral-500">
          검색어를 입력하여 원하는 컨텐츠를 찾아보세요
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col">
        <h1 className="mb-4 px-3 text-2xl font-bold text-neutral-900">노래</h1>
        <div className="flex flex-col">
          {spotifyData?.tracks.items && spotifyData.tracks.items.length > 0 ? (
            spotifyData.tracks.items.map((track) => (
              <div
                key={track.id}
                className="group flex w-full items-center justify-between rounded-md px-3 py-3 text-left hover:bg-neutral-100"
              >
                <div
                  className="flex items-center gap-3 hover:cursor-pointer"
                  onClick={() => playNewTrack(track)}
                >
                  <img
                    src={track.album.images[0].url}
                    className="size-12 rounded-sm"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-medium">{track.name}</h2>
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-neutral-500">
                        {track.artists[0].name}
                      </p>
                      <p>·</p>
                      <p className="text-sm text-neutral-500">
                        {track.album.name}
                      </p>
                      <p>·</p>
                      <p className="text-sm text-neutral-500">
                        {formatDuation(track.duration_ms)}
                      </p>
                    </div>
                  </div>
                </div>
                <DropdownButton
                  items={[
                    {
                      label: "현재 재생목록에 추가",
                      action: () => {addToCurrentPlaylist(track)},
                      Icon: ListPlus,
                    },
                  ]}
                >
                  <Button
                    variant={"ghost"}
                    className="text-neutral-500 opacity-0 hover:text-neutral-900 group-hover:opacity-100"
                  >
                    <EllipsisVertical />
                  </Button>
                </DropdownButton>
              </div>
            ))
          ) : (
            <p className="px-3 text-neutral-500">
              "{query}"로 검색한 노래 결과가 없습니다
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="mb-4 px-3 text-2xl font-bold text-neutral-900">
          채팅방
        </h1>
        <div className="flex flex-col">
          {chatRoomData?.chatRooms && chatRoomData.chatRooms.length > 0 ? (
            chatRoomData.chatRooms.map((chatRoom) => (
              <div
                key={chatRoom.chatRoomId}
                className="group flex w-full items-center justify-between rounded-md px-3 py-3 text-left hover:cursor-pointer hover:bg-neutral-100"
                onClick={() => handleChatRoomClick(chatRoom.chatRoomId)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={defaultChatRoomImage}
                    className="size-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-medium">{chatRoom.name}</h2>
                  </div>
                </div>
                <Button
                  variant={"ghost"}
                  className="text-neutral-500 opacity-0 hover:text-neutral-900 group-hover:opacity-100"
                >
                  <EllipsisVertical />
                </Button>
              </div>
            ))
          ) : (
            <p className="px-3 text-neutral-500">
              "{query}"로 검색한 채팅방이 없습니다
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="mb-4 px-3 text-2xl font-bold text-neutral-900">
          사용자
        </h1>
        <div className="flex flex-col">
          {userData?.users && userData.users.length > 0 ? (
            userData.users.map((user) => (
              <div
                key={user.id}
                className="group flex w-full items-center justify-between rounded-md px-3 py-3 text-left hover:bg-neutral-100"
              >
                <div
                  className="flex items-center gap-3 hover:cursor-pointer"
                  onClick={() => {
                    navigate(`/user/${user.username}`);
                  }}
                >
                  <img src={defaultUserImage} className="size-12 rounded-md" />
                  <div className="flex flex-col">
                    <h2 className="font-medium">{user.username}</h2>
                  </div>
                </div>
                <DropdownButton
                  items={[
                    {
                      label: "채팅방에 초대",
                      action: () => {},
                      Icon: UserPlus,
                    },
                  ]}
                >
                  <Button
                    variant={"transparent"}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <EllipsisVertical />
                  </Button>
                </DropdownButton>
              </div>
            ))
          ) : (
            <p className="px-3 text-neutral-500">
              "{query}"로 검색한 사용자가 없습니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
