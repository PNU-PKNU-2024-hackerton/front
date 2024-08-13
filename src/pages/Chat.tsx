import { EllipsisVertical, LogOut, Plus, SearchIcon, X } from "lucide-react";
import { Button } from "../components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChatRoom, leaveChatRoom } from "../utils/apis/serverAPI";
import { useState } from "react";
import defaultChatRoomImage from "../assets/default-image-mountain.png";
import { Modal } from "../components/Modal";
import DropdownButton from "../components/DropdownButton";
import { useNavigate, useParams } from "react-router-dom";
import { ChatRoom } from "../components/ChatRoom";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import { useStompStore } from "../stores/useStompStore";
import { MessageType } from "../utils/types";

export default function Chat() {
  const { chatRoomId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatRoomName, setNewChatRoomName] = useState("");
  const { stompClient } = useStompStore();
  const {
    chatRoomList,
    currentChatRoomId,
    setNewMessage,
  } = useChatRoomStore();

  // 새 채팅방 생성 Mutation
  const { mutate: createChatRoomMutate } = useMutation({
    mutationFn: createChatRoom,
    onSuccess: (data) => {
      // 새 채팅방 구독 -> 모듈화 필요
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return;
      }
      const headers = { Authorization: `Bearer ${accessToken}` };
      const callback = function (message: any) {
        if (message.body) {
          const chatMessage: MessageType = JSON.parse(message.body);
          setNewMessage(chatMessage);
        }
      };

      stompClient?.subscribe(
        `/sub/api/chat/${data.chatRoomId}`,
        callback,
        headers,
      );

      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    },
  });

  // 채팅방 나가기 Mutation
  const { mutate: leaveChatRoomMutate } = useMutation({
    mutationFn: leaveChatRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      navigate("/chat");
    },
  });

  const handleCreateNewChatRoom = () => {
    if (newChatRoomName.trim()) {
      createChatRoomMutate({ name: newChatRoomName });
    } else {
      alert("채팅방 이름을 입력해주세요.");
    }
    setIsModalOpen(false);
  };

  const handleChatRoomClick = (chatRoomId: number) => {
    navigate(`/chat/${chatRoomId}`);
  };

  return (
    <div className="flex h-full w-full">
      {/* 채팅방 생성 모달 */}
      {isModalOpen && (
        <Modal>
          <div className="mb-10 flex items-center justify-between">
            <h1 className="text-2xl font-bold">새 채팅방 생성</h1>
            <Button variant={"ghost"} onClick={() => setIsModalOpen(false)}>
              <X />
            </Button>
          </div>
          <input
            type="text"
            className="mb-10 w-full rounded-md border border-neutral-400 p-2 placeholder:text-neutral-500"
            placeholder="채팅방 이름"
            value={newChatRoomName}
            onChange={(e) => setNewChatRoomName(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleCreateNewChatRoom}
              className="w-full rounded-full px-5"
            >
              만들기
            </Button>
          </div>
        </Modal>
      )}
      <div className="flex h-full w-[300px] flex-none flex-col border-r py-10">
        <div className="mb-10 flex w-full items-center justify-between px-5">
          <h1 className="text-xl font-bold pl-1">채팅방</h1>
          <div className="flex gap-1">
            <Button variant={"transparent"} className="p-0">
              <SearchIcon />
            </Button>
            <Button
              variant={"transparent"}
              className="p-1"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <Plus />
            </Button>
          </div>
        </div>
        {chatRoomList && chatRoomList.length === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-neutral-400">
              아직 참여한 채팅이 없어요
            </p>
          </div>
        )}
        {chatRoomList && chatRoomList.length > 0 && (
          <ul className="flex flex-col">
            {chatRoomList.map((chatRoom) => (
              <li
                key={chatRoom.chatRoomId}
                className={`group flex w-full items-center justify-between px-5 py-4 text-left hover:bg-neutral-100 ${chatRoom.chatRoomId === currentChatRoomId ? "bg-neutral-50" : ""}`}
              >
                <div
                  className="flex items-center gap-3 hover:cursor-pointer"
                  onClick={() => {
                    handleChatRoomClick(chatRoom.chatRoomId);
                  }}
                >
                  <img
                    src={defaultChatRoomImage}
                    className="size-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-neutral-900">{chatRoom.name}</h2>
                  </div>
                </div>
                <DropdownButton
                  items={[
                    {
                      label: "채팅방 나가기",
                      action: () => leaveChatRoomMutate(chatRoom.chatRoomId),
                      Icon: LogOut,
                    },
                  ]}
                >
                  <Button
                    variant={"transparent"}
                    className="opacity-0 group-hover:opacity-100 p-0"
                  >
                    <EllipsisVertical />
                  </Button>
                </DropdownButton>
              </li>
            ))}
          </ul>
        )}
      </div>
      {chatRoomId ? (
        <ChatRoom />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-neutral-900">
            내 음악 채팅
          </h1>
          <p className="mb-6 text-center text-neutral-400">
            새로운 채팅을 만들고 친구를 초대해 음악을 같이 들어보세요.
          </p>
          <Button
            className="rounded-full px-5"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            채팅 만들기 ♫
          </Button>
        </div>
      )}
    </div>
  );
}
