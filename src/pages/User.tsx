import { EllipsisVertical, UserPlus } from "lucide-react";
import defaultUserImage from "../assets/default-user-image.png";
import { Button } from "../components/Button";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserDetailsByUsername } from "../utils/apis/serverAPI";
import { UserDetailsType } from "../utils/types";
import { useUser } from "../hooks/useUser";
import Loading from "./Loading";
import DropdownButton from "../components/DropdownButton";

export default function User() {
  const { getUserId } = useUser();
  const { username } = useParams();

  // username으로 프로필 검색 -> 없으면 없는 유저 화면
  const {
    data: userDetails,
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
  } = useQuery<UserDetailsType>({
    queryKey: ["userDetails", username],
    queryFn: () => getUserDetailsByUsername(username as string),
    enabled: !!username,
  });

  if (isUserDetailsLoading) {
    return <Loading />;
  }

  // 유저네임이 현재 로그인한 유저네임과 같은지 확인 -> 내 프로필 화면 | 타 유저 프로필 화면 결정

  return (
    <div className="flex h-full w-full justify-center px-10 text-neutral-900">
      <div className="flex w-full max-w-screen-md flex-col gap-10 py-20">
        <div className="flex items-center gap-8">
          <img
            src={defaultUserImage}
            className="size-28 rounded-full hover:cursor-pointer"
          />
          <div className="flex flex-col gap-2 py-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-neutral-900">
                {userDetails?.username}
              </h1>
              <p className="text-lg text-neutral-500">
                @{userDetails?.username}
              </p>
            </div>
            <div className="flex gap-5 text-neutral-500">
              <Button
                variant={"transparent"}
                className="flex gap-2"
              >
                <p>팔로워</p>
                <p>12</p>
              </Button>
              <Button
                variant={"transparent"}
                className="flex gap-2"
              >
                <p>팔로잉</p>
                <p>18</p>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-5">
          {userDetails && userDetails.id === getUserId() ? (
            <>
              <Button className="w-full border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-200">
                프로필 수정
              </Button>
            </>
          ) : (
            <>
              <Button className="w-full">팔로우</Button>
              <Button className="w-full border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-200">
                채팅 시작
              </Button>
              <DropdownButton
                items={[
                  { label: "채팅방에 초대", action: () => {}, Icon: UserPlus },
                ]}
              >
                <Button variant={"transparent"}>
                  <EllipsisVertical />
                </Button>
              </DropdownButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
