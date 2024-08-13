import { LucideIcon } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "./Button";

export interface DropdownItem {
  label: string;
  action: () => void;
  Icon?: LucideIcon;
}

interface DropdownProps {
  children: ReactNode;
  items: DropdownItem[];
}

export default function DropdownButton({ children, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 메뉴 닫기
  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // 이벤트리스너 설정 및 해제
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 메뉴 토글
  const handleClick = (): void => {
    setIsOpen(!isOpen);
  };

  // 메뉴가 화면 밖으로 나가지 않도록 조정
  useEffect(() => {
    if (isOpen && menuRef.current && buttonRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // 메뉴가 화면의 오른쪽을 넘는 경우
      if (menuRect.right > viewportWidth) {
        menuRef.current.style.left = `${buttonRect.left - (menuRect.right - viewportWidth)}px`;
      }

      // 메뉴가 화면의 아래쪽을 넘는 경우
      if (menuRect.bottom > viewportHeight) {
        menuRef.current.style.top = `${buttonRect.bottom - (menuRect.bottom - viewportHeight)}px`;
      }
    }
  }, [isOpen]);

  const handleButtonClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex gap-2" onClick={handleClick} ref={buttonRef}>
        {children}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute z-50 flex w-fit min-w-[200px] flex-col rounded-lg border bg-white py-3 shadow-lg"
          style={{
            top: `${buttonRef.current?.getBoundingClientRect().bottom}px`,
            left: `${buttonRef.current?.getBoundingClientRect().left}px`,
          }}
        >
          {items.map((item, index) => (
            <Button
              key={index}
              variant={"ghost"}
              onClick={() => handleButtonClick(item.action)}
              className="flex w-full gap-3 rounded-none px-4"
            >
              {item.Icon && <item.Icon />}
              <p className="w-fit whitespace-nowrap text-left">{item.label}</p>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
