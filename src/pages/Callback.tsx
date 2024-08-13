import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { connectSpotify } from "../utils/apis/serverAPI";

export function Callback() {
  const location = useLocation();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    setCode(code);
  });

  useEffect(() => {
    if (code) {
      try {
        connectSpotify(code).then((res) => {
          localStorage.setItem("spotifyAccessToken", res.spotifyAccessToken);
          window.location.replace("/setting");
        });
      } catch (e) {
        console.log("스포티파이 연결 에러: ", e);
        window.location.replace("/setting");
      }
    }
  }, [code]);

  return <></>;
}
