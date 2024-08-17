import { Button } from "./Button";
import mainpic from "../assets/mainpic.jpg";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../utils/store";
import MyExhibitions from "./MyExhibitions";

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
        <MyExhibitions />
      ) : (
        <div className="flex h-full w-full flex-col justify-start gap-5 p-10">
          <div className="flex flex-col gap-0 text-[4rem] font-extrabold text-neutral-900">
            <p>전시를 만들고</p>
            <p>사람들에게 공유하세요</p>
          </div>
          <p className="text-xl text-neutral-500">
            그림을 업로드 하고 링크를 공유해 간단하게 전시회에 초대할 수
            있습니다
          </p>
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
