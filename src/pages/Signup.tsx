import { useState } from "react";
import { api, signup } from "../utils/apis/serverAPI";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useMutation } from "@tanstack/react-query";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ["signup"],
    mutationFn: () => signup({ username: username, password: password }),
    onSuccess: () => {
      navigate("/login");
    },
    onError: (e) => {
      console.log("회원가입 에러: ", e);
    },
  });

  // 회원가입 폼 제출
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-[400px] flex-col gap-y-14 rounded-xl border border-gray-300 p-10">
          <h1 className="text-3xl font-bold">가입하고 같이 들어요!</h1>
          <form onSubmit={handleSubmit}>
            {/* <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
            </div> */}
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="username">사용자 이름</label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@"
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="password-verify">비밀번호 확인</label>
              <input
                id="password-verify"
                type="password"
                required
                value={passwordVerify}
                onChange={(e) => setPasswordVerify(e.target.value)}
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
            </div>
            <Button className="w-full">가입하기</Button>
          </form>
          <div className="flex items-center gap-4">
            <p>사실 계정이 있으신가요?</p>
            <Button
              variant={"ghost"}
              className="font-bold text-sky-600"
              onClick={() => navigate("/login")}
            >
              로그인
            </Button>
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 flex w-full justify-center space-x-4 text-sm text-gray-500">
        <a>© 2024 Groovith</a>
        <a>소개</a>
        <a>약관</a>
        <a>개인정보처리방침</a>
        <a>쿠키 정책</a>
        <a>문제 신고</a>
      </div>
    </div>
  );
}
