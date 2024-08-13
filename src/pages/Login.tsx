import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/apis/serverAPI";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 토큰 유효성 확인 성공시 메인으로 리디렉트
  useEffect(() => {
    // 토큰 유효성 검사 API
  }, []);

  // 로그인 폼 제출
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await login({username: username, password: password});
      localStorage.setItem("accessToken", response.headers['authorization'].replace("Bearer ", ""));
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-[400px] flex-col gap-y-14 rounded-xl border border-gray-300 p-10">
          <h1 className="text-3xl font-bold">Groovith에 로그인하기</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="username">사용자이름</label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            <Button className="w-full">로그인</Button>
          </form>
          <div className="flex items-center gap-4">
            <p>아직 계정이 없으신가요?</p>
            <Button
              variant={"ghost"}
              className="font-bold text-sky-600"
              onClick={() => navigate("/signup")}
            >
              가입하기
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
