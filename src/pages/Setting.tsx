import spotifyLogo from "../assets/Spotify_Primary_Logo_RGB_Green.png";
import appleMusicLogo from "../assets/Apple_Music_Icon_RGB_lg_073120.svg";
import { Button } from "../components/Button";
import { SPOTIFY_AUTH_URL } from "../utils/config";
import { disconnectSpotify } from "../utils/apis/serverAPI";
import { useUser } from "../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Setting() {
  const { getStreaming, updateStreaming } = useUser();
  const queryClient = useQueryClient();

  const {mutate} = useMutation({
    mutationFn: disconnectSpotify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  })

  const handleDisconnectSpotify = async () => {
    mutate();
  };

  return (
    <div className="flex h-full w-full justify-center text-neutral-900 px-10">
      <div className="flex h-full w-full max-w-screen-md flex-col gap-16 py-20">
        <h1 className="text-4xl font-bold">설정</h1>
        {/* 스트리밍 서비스 */}
        <div>
          <h2 className="mb-3 text-2xl font-bold">스트리밍 서비스</h2>
          <p className="mb-8 text-neutral-700">
            음악 컨텐츠 스트리밍에 사용할 서비스를 선택하고 계정을 연결하세요.
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex w-full justify-between rounded-xl bg-neutral-200 p-3">
              <div className="flex items-center gap-4">
                <img src={spotifyLogo} alt="Spotify" className="w-8" />
                <p className="text-lg font-bold">Spotify</p>
              </div>
              {getStreaming() === "SPOTIFY" ? (
                <Button
                  onClick={handleDisconnectSpotify}
                  className="border border-red-700 bg-transparent text-red-700 hover:bg-red-500/10"
                >
                  연결 해제
                </Button>
              ) : (
                <Button
                  onClick={() => (window.location.href = SPOTIFY_AUTH_URL)}
                >
                  연결
                </Button>
              )}
            </div>
            <div className="flex w-full justify-between rounded-xl bg-neutral-200 p-3">
              <div className="flex items-center gap-4">
                <img src={appleMusicLogo} alt="Spotify" className="w-8" />
                <p className="text-lg font-bold">Apple Music</p>
              </div>
              <Button disabled className="opacity-10">
                미구현
              </Button>
            </div>
          </div>
        </div>
        {/* 계정 관련 */}
        {/* <div>
          <h2 className="mb-3 text-xl font-bold">계정</h2>
        </div>
        <div>
          <h2 className="mb-3 text-2xl font-bold">개인정보 보호</h2>
        </div>
        <div>
          <h2 className="mb-3 text-2xl font-bold">언어</h2>
        </div>
        <div>
          <h2 className="mb-3 text-2xl font-bold">도움말 및 정보</h2>
        </div> */}
      </div>
    </div>
  );
}
