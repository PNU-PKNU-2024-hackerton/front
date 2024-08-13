import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "../components/Button";
import { useEffect, useRef, useState } from "react";
import { formatDuation } from "../utils/formatDuration";
import { usePlayer } from "../hooks/usePlayer";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import { getSpotifyToken } from "../utils/apis/serverAPI";
import { playTrack } from "../utils/apis/spotifyAPI";

export default function Player() {
  const {
    resumePlayer,
    pausePlayer,
    seek,
    previousTrack,
    nextTrack,
    trackEnded,
  } = usePlayer();
  const {
    player,
    deviceId,
    paused,
    position,
    duration,
    loading,
    playerResponseMessage,
    isListenTogetherConnected,
    setPosition,
    setPaused,
    setDuration,
    setLoading,
    setPlayer,
    setDeviceId,
    currentPlaylist,
    currentPlaylistIndex,
    listenTogetherId,
    setCurrentPlaylist,
    setCurrentPlaylistIndex,
  } = usePlayerStore();
  const navigate = useNavigate();
  const { streaming } = useUserStore();
  const { isCurrentChatRoomOpen, toggleCurrentChatRoomOpen } =
    useChatRoomStore();
  const [newPosition, setNewPosition] = useState<number>();
  const timerRef = useRef<number>(0); // 플레이어 상태 불러오는 타이머
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string>();
  const { justPlayTrack } = usePlayer();

  // 유저 플레이백 큐 불러오기
  // const { data: userQueueData } = useQuery({
  //   queryKey: ["userQueue"],
  //   queryFn: getUserQueue,
  // });

  // 스트리밍 서비스 확인 -> 새 토큰 불러오기 -> 플레이어 연결
  useEffect(() => {
    const updateSpotifyToken = async () => {
      try {
        const data = await getSpotifyToken();
        localStorage.setItem("spotifyAccessToken", data.spotifyAccessToken);
        setSpotifyAccessToken(data.spotifyAccessToken);
        // initializePlayer();
      } catch (e) {
        console.error("스포티파이 토큰 받기 에러", e);
      }
    };

    if (streaming === "SPOTIFY") {
      updateSpotifyToken();
    }
  }, [streaming]);

  // 스포티파이 플레이어 초기화
  useEffect(() => {
    if (!spotifyAccessToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = localStorage.getItem("spotifyAccessToken");
      if (!token) return;

      const player = new window.Spotify.Player({
        name: "Spotify Web Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setPaused(state.paused);
        setPosition(state.position);
        setDuration(state.duration);
        setLoading(state.loading);
      });

      player.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [spotifyAccessToken]);

  // 트랙 종료 판단 -> 다음 곡 재생 호출
  // useEffect(() => {
  //   if (position === 0 && paused && !loading && currentPlaylist.length > 0) {
  //     console.log("nextTrack");

  //     if (isListenTogetherConnected && listenTogetherId) {
  //       trackEnded();
  //     } else {
  //       nextTrack();
  //     }
  //   }
  // }, [position, paused, loading]);

  // 트랙 현재 시간 업데이트
  useEffect(() => {
    if (!paused && !loading) {
      timerRef.current = setInterval(() => {
        const newPosition = position + 100;
        setPosition(newPosition);

        if (position >= duration - 1000) {
          console.log("position: ", position);
          console.log("duration: ", duration);
          console.log("트랙 종료!");
          setPosition(0);
          if (isListenTogetherConnected && listenTogetherId) {
            trackEnded();
          } else {
            nextTrack();
          }
        }
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [
    currentPlaylist,
    paused,
    timerRef,
    currentPlaylistIndex,
    position,
    duration,
    loading,
  ]);

  // 트랙 위치 변경
  const handleSeek = () => {
    if (!newPosition) return;
    seek(newPosition);
  };

  // 새 플레이어 메시지 수신 시 현재 상태와 비교해서 업데이트
  useEffect(() => {
    if (!playerResponseMessage) return;

    console.log(playerResponseMessage);

    const { action, track, position, currentPlaylist, index } =
      playerResponseMessage;

    // action 이 정해져 있는 경우 그에 따라 플레이어 조작
    if (action) {
      switch (action) {
        case "PLAY_TRACK":
          if (track) {
            justPlayTrack(track, position);
            setDuration(track.duration_ms);
          }
          if (typeof index === "number") {
            setCurrentPlaylistIndex(index);
          }
          break;
        case "PAUSE":
          if (position === undefined || !player) return;
          player.seek(position).then(() => {
            player.pause();
          });
          break;
        case "RESUME":
          if (position === undefined || !player) return;
          player.seek(position).then(() => {
            player.resume();
          });
          break;
        case "SEEK":
          if (position === undefined || !player) return;
          player.seek(position);
          break;
        case "UPDATE":
          setCurrentPlaylist(currentPlaylist!);
          setCurrentPlaylistIndex(index!);
      }
    }
  }, [playerResponseMessage]);

  return (
    <div className="flex h-[80px] w-full justify-between border-t">
      {streaming === "NONE" && (
        <div className="flex h-full w-full items-center justify-center">
          <a
            className="text-sm text-neutral-400 hover:cursor-pointer hover:underline"
            onClick={() => {
              navigate("/setting");
            }}
          >
            음악을 듣기 위해 스트리밍 서비스를 연결해주세요.
          </a>
        </div>
      )}
      {streaming === "SPOTIFY" && (
        <>
          {currentPlaylist[currentPlaylistIndex] ? (
            <input
              className="absolute z-10 h-1 w-full cursor-pointer appearance-none bg-neutral-200 accent-[#FF6735] outline-none disabled:accent-gray-200"
              type="range"
              min="0"
              max={duration}
              value={position}
              onChange={(e) => {
                e.preventDefault();
                setNewPosition(Number(e.target.value));
                setPosition(Number(e.target.value));
              }}
              onMouseUp={handleSeek}
              style={{
                background: `linear-gradient(to right, #FF6735 ${(position / duration) * 100}%, #E5E7EB ${(position / duration) * 100}%)`,
              }}
            />
          ) : (
            <input
              className="absolute z-10 h-1 w-full cursor-pointer appearance-none bg-neutral-200 accent-[#FF6735] outline-none disabled:accent-gray-200"
              type="range"
              min="0"
              max="100"
              value={0}
              disabled
            />
          )}
          <div className="ml-6 flex items-center gap-1">
            <Button
              variant={"transparent"}
              className="text-neutral-600"
              onClick={() => previousTrack()}
            >
              <SkipBack />
            </Button>
            {paused ? (
              <Button
                variant={"transparent"}
                className="text-neutral-600"
                onClick={() => resumePlayer()}
              >
                <Play />
              </Button>
            ) : (
              <Button
                variant={"transparent"}
                className="text-neutral-600"
                onClick={() => pausePlayer()}
              >
                <Pause />
              </Button>
            )}
            <Button
              variant={"transparent"}
              className="text-neutral-600"
              onClick={() => nextTrack()}
            >
              <SkipForward />
            </Button>
            <div className="ml-2 flex items-center gap-1 text-sm text-neutral-400">
              <p>{formatDuation(position)}</p>
              <p>/</p>
              <p>{formatDuation(duration)}</p>
            </div>
          </div>
          <div className="flex items-center">
            {currentPlaylist.length > 0 && typeof currentPlaylistIndex === "number" ? (
              <div className="flex items-center">
                <img
                  src={
                    currentPlaylist[currentPlaylistIndex].album.images[0].url
                  }
                  className="mr-3 size-12 rounded-sm"
                />
                <div className="flex flex-col">
                  <p className="text-neutral-900">
                    {currentPlaylist[currentPlaylistIndex].name}
                  </p>
                  <p className="text-neutral-500">
                    {currentPlaylist[currentPlaylistIndex].artists[0].name} •{" "}
                    {currentPlaylist[currentPlaylistIndex].album.name} •{" "}
                    {
                      currentPlaylist[
                        currentPlaylistIndex
                      ].album.release_date.split("-")[0]
                    }
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-400">
                재생 중인 곡이 없습니다
              </p>
            )}
          </div>
          <div className="mr-6 flex items-center">
            {isCurrentChatRoomOpen ? (
              <Button
                variant={"transparent"}
                onClick={toggleCurrentChatRoomOpen}
              >
                <ChevronDown />
              </Button>
            ) : (
              <Button
                variant={"transparent"}
                onClick={toggleCurrentChatRoomOpen}
              >
                <ChevronUp />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
