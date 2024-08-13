import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { SearchIcon } from "lucide-react";
import { SearchResults } from "../components/SearchResults";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <div className="flex h-full w-full justify-center overflow-auto">
      <div className="flex w-full max-w-screen-lg flex-col p-10">
        <form
          className="relative flex w-fit items-center mb-16 pl-3"
          onSubmit={handleSearch}
        >
          <input
            ref={inputRef}
            type="search"
            placeholder="노래, 채팅방, 사용자 검색"
            className="w-[500px] rounded-lg border bg-neutral-200 py-2.5 pl-12 pr-3 placeholder:text-neutral-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant={"transparent"}
            onClick={() => inputRef.current?.focus()}
            className="absolute left-5 text-neutral-400 hover:bg-transparent hover:text-black"
          >
            <SearchIcon />
          </Button>
        </form>
        <SearchResults />
      </div>
    </div>
  );
}
