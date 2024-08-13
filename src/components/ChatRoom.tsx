import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  MessageType,
  PlayerDetailsDto,
  PlayerResponseDto,
  SpotifyTrack,
} from "../utils/types";
import {
  getChatRoomMessages,
  getPlayer,
  joinPlayer,
  leavePlayer,
} from "../utils/apis/serverAPI";
import defaultChatRoomImage from "../assets/default-image-mountain.png";
import defaultUserImage from "../assets/default-user-image.png";
import { Button } from "./Button";
import {
  AudioLines,
  EllipsisVertical,
  Headphones,
  Menu,
  Pause,
  Play,
  Repeat,
  SendHorizonal,
  Shuffle,
  SkipBack,
  SkipForward,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import Loading from "../pages/Loading";
import DropdownButton from "./DropdownButton";
import React, { useEffect, useRef, useState } from "react";
import { useStompStore } from "../stores/useStompStore";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import { formatDateTime } from "../utils/formatDateTime";
import { formatDuation } from "../utils/formatDuration";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePlayer } from "../hooks/usePlayer";
import { playTrack } from "../utils/apis/spotifyAPI";

export function ChatRoom() {
  const { chatRoomId } = useParams(); // 현재 주소 파라미터에서. "/chat/:chatRoomId".
  const [message, setMessage] = useState(""); // 입력창 메시지
  const [chatRoomPosition, setChatRoomPosition] = useState<number>(0);
  const [chatRoomPaused, setChatRoomPaused] = useState<boolean>(true);
  const [chatRoomRepeat, setChatRoomRepeat] = useState<boolean>(false);
  const [chatRoomCurrentPlaylist, setChatRoomCurrentPlaylist] = useState<
    SpotifyTrack[]
  >([]);
  const [chatRoomCurrentPlaylistIndex, setChatRoomCurrentPlaylistIndex] =
    useState<number>(-1);
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>();

  const { stompClient } = useStompStore();
  const {
    getChatRoomById,
    currentChatRoomMessages,
    setCurrentChatRoomId,
    setCurrentChatRoomMessages,
    newMessage,
    addToCurrentChatRoomMessages,
  } = useChatRoomStore();
  const {
    isListenTogetherConnected,
    listenTogetherId,
    listenTogetherSubscription,
    player,
    paused,
    deviceId,
    currentPlaylist,
    currentPlaylistIndex,
    setRepeat,
    setDuration,
    setIsListenTogetherConnected,
    setListenTogetherId,
    setListenTogetherSubscription,
    setCurrentPlaylist,
    setCurrentPlaylistIndex,
    setPaused,
    setPosition,
    setPlayerResponseMessage,
  } = usePlayerStore();
  const { removeFromCurrentPlaylist, justPlayTrack, playAtIndex } = usePlayer();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>();

  // 현재 채팅방 정보를 가져옴
  const chatRoomDetails = getChatRoomById(Number(chatRoomId));

  // 현재 채팅방 아이디 업데이트
  useEffect(() => {
    if (chatRoomId) {
      setCurrentChatRoomId(Number(chatRoomId));
    } else {
      setCurrentChatRoomId(-1);
    }

    return () => {
      setCurrentChatRoomId(-1);
    };
  }, [chatRoomId]);

  // 새 메시지가 현재 채팅방 메시지이면 추가
  useEffect(() => {
    if (
      newMessage &&
      chatRoomId &&
      newMessage.chatRoomId == Number(chatRoomId)
    ) {
      addToCurrentChatRoomMessages(newMessage);
    }
  }, [newMessage]);

  // 채팅방 메시지 불러오기
  const { isLoading: isMessagesLoading } = useQuery<{
    data: MessageType[];
  }>({
    queryKey: ["messages", chatRoomId],
    queryFn: () =>
      getChatRoomMessages(chatRoomId as string).then((data) => {
        setCurrentChatRoomMessages(data.data);
        return data;
      }),
    enabled: !!chatRoomId,
  });

  // 채팅방 플레이어 정보 불러오기
  useQuery<PlayerDetailsDto>({
    queryKey: ["player", chatRoomId],
    queryFn: () =>
      getPlayer(chatRoomId as string).then((data) => {
        setChatRoomCurrentPlaylistIndex(data.currentPlaylistIndex);
        setChatRoomCurrentPlaylist(data.currentPlaylist);
        setChatRoomPaused(data.paused);
        setChatRoomRepeat(data.repeat);
        setChatRoomPosition(data.position);
        return data;
      }),
    enabled: !!chatRoomId,
  });

  // 채팅방 현재 시간 업데이트
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (!chatRoomPaused) {
      timerRef.current = setInterval(() => {
        setChatRoomPosition((prevPosition) => prevPosition + 500);
      }, 500);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [chatRoomPaused, chatRoomPosition, chatRoomId]);

  // 채팅방 플레이어 상태 STOMP 구독 -> 컴포넌트 언마운트시 구독 해제
  useEffect(() => {
    if (!stompClient) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    // STOMP 커스텀 헤더
    const headers = { Authorization: `Bearer ${accessToken}` };

    // 메시지 수신 Callback 함수
    const callback = function (message: any) {
      if (message.body) {
        const playerMessage: PlayerDetailsDto = JSON.parse(message.body);
        setChatRoomCurrentPlaylistIndex(playerMessage.currentPlaylistIndex);
        setChatRoomCurrentPlaylist(playerMessage.currentPlaylist);
        setChatRoomPaused(playerMessage.paused);
        setChatRoomRepeat(playerMessage.repeat);
        setChatRoomPosition(playerMessage.position);
      }
    };

    const subscription = stompClient.subscribe(
      `/sub/api/chatrooms/${chatRoomId}/player`,
      callback,
      headers,
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, chatRoomId]);

  // 같이 듣기 연결
  const connectListenTogether = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !stompClient || !player || !chatRoomId) {
      return;
    }

    // 기존에 구독한 같이 듣기가 있다면 구독 해제 & 같이 듣기 연결 상태 해제
    if (listenTogetherId != Number(chatRoomId) && listenTogetherSubscription) {
      listenTogetherSubscription.unsubscribe();
      setIsListenTogetherConnected(false);
    }

    // 채팅방 참가 및 초기화
    joinPlayer(chatRoomId).then(async (data) => {
      console.log(data);
      setCurrentPlaylist(data.currentPlaylist);
      setCurrentPlaylistIndex(data.currentPlaylistIndex);
      setPaused(data.paused);

      if (
        data.currentPlaylist.length > 0 &&
        typeof data.currentPlaylistIndex === "number"
      ) {
        console.log("play start");
        setDuration(
          data.currentPlaylist[data.currentPlaylistIndex].duration_ms,
        );
        setPosition(data.position);
        await justPlayTrack(
          data.currentPlaylist[data.currentPlaylistIndex],
          data.position,
        );
      }
      // 일정 시간 후에 플레이어를 정지시키기 위해 setTimeout 사용
      setTimeout(() => {
        if (data.paused) {
          player.pause();
        } else {
          player.resume();
        }
      }, 1000); // 잠시 후 메뉴얼 정지
    });

    // STOMP 커스텀 헤더
    const headers = { Authorization: `Bearer ${accessToken}` };

    // 같이 듣기 콜백 함수
    const callback = async function (message: any) {
      if (message.body) {
        const playerMessage: PlayerResponseDto = JSON.parse(message.body);
        // playerStore의 전역 변수에 저장하고 Player 컴포넌트에서 비교
        setPlayerResponseMessage(playerMessage);
      }
    };

    // STOMP 토픽 구독
    const subscription = stompClient.subscribe(
      `/sub/api/chatrooms/${chatRoomId}/player/listen-together`,
      callback,
      headers,
    );

    // 같이 듣기 변수 설정
    setListenTogetherSubscription(subscription);
    setIsListenTogetherConnected(true);
    setListenTogetherId(Number(chatRoomId));
  };

  // 같이 듣기 연결 해제
  const disconnectListenTogether = async () => {
    if (!(player instanceof Spotify.Player)) return;

    leavePlayer(chatRoomId!);
    if (chatRoomId) {
      listenTogetherSubscription?.unsubscribe();
      setIsListenTogetherConnected(false);
    }

    player.pause();
  };

  // 메시지 보내기
  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (stompClient && accessToken) {
      const messageDto = {
        content: message,
        type: "CHAT",
      };
      stompClient.publish({
        destination: `/pub/api/chat/${chatRoomId}`,
        body: JSON.stringify(messageDto),
        headers: { access: accessToken },
      });
    }
    setMessage("");
  };

  // 채팅방 들어가면 아래로 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  // 새 메시지 생기면 아래로 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentChatRoomMessages]);

  if (isMessagesLoading) {
    return <Loading />;
  }

  return (
    <>
      {!chatRoomDetails ? (
        <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
          잘못된 접근입니다.
        </div>
      ) : (
        <div className="flex h-full w-full">
          <div className="flex w-full flex-col border-r">
            <div className="flex h-[100px] items-center justify-between border-b px-8">
              <div className="flex items-center gap-5">
                <img
                  src={defaultChatRoomImage}
                  className="size-14 rounded-full"
                ></img>
                <h1>{chatRoomDetails?.name}</h1>
              </div>
              <div className="flex">
                <Button variant={"ghost"}>
                  <UserPlus />
                </Button>
                <DropdownButton
                  items={[{ label: "채팅방 나가기", action: () => {} }]}
                >
                  <Button variant={"ghost"}>
                    <Menu />
                  </Button>
                </DropdownButton>
              </div>
            </div>
            <div
              className="flex h-full flex-col gap-5 overflow-auto bg-neutral-100 px-5 py-5"
              ref={chatContainerRef}
            >
              {currentChatRoomMessages &&
                currentChatRoomMessages.map((message) => (
                  <div key={message.messageId} className="flex gap-3">
                    <img src={defaultUserImage} className="size-10" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p>{message.username}</p>
                        <p className="text-sm text-neutral-400">
                          {formatDateTime(message.createdAt)}
                        </p>
                      </div>
                      <p className="flex w-fit justify-start rounded-lg bg-white px-3 py-2 shadow-lg">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex h-[100px] items-center justify-between border-t px-4">
              <form
                className="flex w-full justify-between gap-2"
                onSubmit={sendMessage}
              >
                <input
                  className="w-full flex-grow rounded-lg p-2 placeholder:text-neutral-400 focus:outline-none"
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button variant="ghost">
                  <SendHorizonal />
                </Button>
              </form>
            </div>
          </div>
          <div className="flex size-full max-w-[500px] flex-col">
            <div className="flex size-full flex-1 flex-col items-center border-b p-5">
              <div className="mb-5 flex w-full justify-between">
                {/* 같이 듣기 중인 채팅방의 경우 같이 듣기 연결 해제 표시 */}
                {isListenTogetherConnected &&
                listenTogetherId === Number(chatRoomId) ? (
                  <Button
                    variant={"transparent"}
                    onClick={disconnectListenTogether}
                    className="flex items-center gap-2 text-neutral-900 hover:text-neutral-500"
                  >
                    <X />
                  </Button>
                ) : (
                  <Button
                    variant={"transparent"}
                    onClick={connectListenTogether}
                    className="flex items-center gap-2 text-neutral-900 hover:text-neutral-500"
                  >
                    <Headphones />
                  </Button>
                )}
                <Button
                  variant={"transparent"}
                  className="text-neutral-900 hover:text-neutral-500"
                >
                  <EllipsisVertical />
                </Button>
              </div>
              {chatRoomCurrentPlaylist &&
              chatRoomCurrentPlaylist[chatRoomCurrentPlaylistIndex] ? (
                <>
                  <div className="flex max-w-[300px] flex-none flex-col gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
                    <img
                      src={
                        chatRoomCurrentPlaylist[chatRoomCurrentPlaylistIndex]
                          ?.album.images[0].url
                      }
                      className="w-full rounded-lg"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="overflow-hidden text-ellipsis text-2xl font-semibold text-neutral-900">
                        {
                          chatRoomCurrentPlaylist[chatRoomCurrentPlaylistIndex]
                            .name
                        }
                      </p>
                      <p className="text-lg text-neutral-500">
                        {
                          chatRoomCurrentPlaylist[chatRoomCurrentPlaylistIndex]
                            .artists[0].name
                        }
                      </p>
                    </div>
                    <div className="relative flex items-center justify-between gap-3">
                      <p className="text-sm text-neutral-400">
                        {formatDuation(chatRoomPosition)}
                      </p>
                      <input
                        className="h-0.5 w-full cursor-pointer appearance-none bg-neutral-200 accent-[#FF6735] outline-none disabled:accent-gray-200"
                        type="range"
                        min="0"
                        max={
                          chatRoomCurrentPlaylist[chatRoomCurrentPlaylistIndex]
                            .duration_ms
                        }
                        value={chatRoomPosition}
                        onChange={() => {}}
                        style={{
                          background: `linear-gradient(to right, #FF6735 ${(chatRoomPosition / chatRoomCurrentPlaylist[chatRoomCurrentPlaylistIndex].duration_ms) * 100}%, #E5E7EB ${(chatRoomPosition / chatRoomCurrentPlaylist[chatRoomCurrentPlaylistIndex].duration_ms) * 100}%)`,
                        }}
                      />
                      <p className="text-sm text-neutral-400">
                        {formatDuation(
                          chatRoomCurrentPlaylist[chatRoomCurrentPlaylistIndex]
                            .duration_ms,
                        )}
                      </p>
                    </div>
                    <div className="flex w-full justify-between">
                      <Button variant={"transparent"}>
                        <Repeat size={18} />
                      </Button>
                      <Button
                        variant={"transparent"}
                        className="text-neutral-600"
                      >
                        <SkipBack />
                      </Button>
                      {chatRoomPaused ? (
                        <Button className="rounded-full p-3" onClick={() => {}}>
                          <Play size={30} />
                        </Button>
                      ) : (
                        <Button className="rounded-full p-3" onClick={() => {}}>
                          <Pause size={30} />
                        </Button>
                      )}
                      <Button
                        variant={"transparent"}
                        className="text-neutral-600"
                      >
                        <SkipForward />
                      </Button>
                      <Button variant={"transparent"}>
                        <Shuffle size={18} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex size-full items-center justify-center">
                    <p className="text-sm text-neutral-400">
                      재생 중인 곡이 없습니다
                    </p>
                  </div>
                </>
              )}
            </div>
            {/*현재 플레이리스트*/}
            <div className="flex size-full flex-1 flex-col">
              {chatRoomCurrentPlaylist &&
                chatRoomCurrentPlaylist.map((track, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 h-fit w-full overflow-x-hidden items-center justify-between border-b px-4 py-2 hover:bg-neutral-100 ${index === chatRoomCurrentPlaylistIndex ? "bg-neutral-100" : ""}`}
                    onMouseEnter={() => setHoveredTrackIndex(index)}
                    onMouseLeave={() => setHoveredTrackIndex(null)}
                  >
                    <div className="flex w-full gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
                      <div
                        className="relative flex size-14 flex-none rounded-sm hover:cursor-pointer"
                        onClick={() => {
                          playAtIndex(index);
                        }}
                      >
                        <img
                          src={track.album.images[0].url}
                          className="h-full rounded-sm object-cover"
                          alt="Album Art"
                        />
                        {index === chatRoomCurrentPlaylistIndex && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-black bg-opacity-50">
                            <AudioLines className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex w-full flex-col gap-0.5">
                        <p
                          className="w-fit overflow-hidden text-ellipsis whitespace-nowrap text-neutral-900 hover:cursor-pointer"
                          onClick={() => {
                            playAtIndex(index);
                          }}
                        >
                          {track.name}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {track.artists[0].name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 w-10">
                      {index === hoveredTrackIndex ? (
                        <DropdownButton
                          items={[
                            {
                              label: "현재 재생목록에서 제거",
                              action: () => {
                                removeFromCurrentPlaylist(index);
                              },
                              Icon: Trash2,
                            },
                          ]}
                        >
                          <Button variant={"ghost"} className="p-3 hover:bg-neutral-300 rounded-full">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
