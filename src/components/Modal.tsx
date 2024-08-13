import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

export function Modal({ children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-20 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-neutral-950/50"></div>
        <div className="relative w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
