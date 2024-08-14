import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "../utils/store";

interface LoginResponse {
  userId: number;
  username: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserId, setUsername } = useUserStore();

  // 로그인 폼 제출
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const body = {};

      const response = await axios.post<LoginResponse>(
        "http://localhost:8080/login",
        body,
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUserId(response.data.userId);
        setUsername(response.data.username);
      }
    } catch (e) {
      console.error("로그인 에러: ", e);
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-[400px] flex-col gap-y-14 rounded-xl border border-gray-300 p-10">
          <h1 className="text-3xl font-bold">로그인</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
    </div>
  );
}
