import { Button } from "./Button";
import mainpic from "../assets/mainpic.jpg";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../utils/store";

export default function Landing() {
  const { isAuthenticated } = useUserStore();
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  // 새 전시 생성 페이지
  const handleCreateClick = () => {
    navigate("/exhibition/create");
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="flex size-full flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-5">
            <a className="text-xl text-neutral-600">
              새로운 전시를 만들어 보세요
            </a>
            <Button
              className="w-fit rounded-full px-6"
              onClick={handleCreateClick}
            >
              전시 만들기
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col justify-start gap-5 p-10">
          <div className="flex flex-col gap-0 text-[4rem] font-extrabold text-neutral-900">
            <a>전시를 만들고</a>
            <a>사람들에게 공유하세요</a>
          </div>
          <a className="text-xl text-neutral-500">
            그림을 업로드 하고 링크를 공유해 간단하게 전시회에 초대할 수
            있습니다
          </a>
          <Button
            onClick={handleSignUpClick}
            className="w-fit rounded-full px-5 py-3"
          >
            가입하기
          </Button>
          <div className="flex size-full justify-center overflow-hidden">
            <img src={mainpic} className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
