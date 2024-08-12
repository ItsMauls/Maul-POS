import { cn } from "@/libs/cn";
import { ReactNode } from "react";

interface ModalProps {
  title?: string;
  children: ReactNode;
  isOpen: boolean;
  size?: "sm" | "md" | "lg" | "none";
  onClose: () => void;
}

export default function Modal({
  title,
  children,
  isOpen,
  onClose,
  size = "none",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 max-w-100'>
      <div className={cn("bg-white p-4 rounded-lg shadow-lg", {
        "": size === "none",
        "w-[25%]": size === "sm",
        "w-[50%]": size === "md",
        "w-[90%]": size === "lg",
      })}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold ml-6">{title}</h3>
          <button className="text-black" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="">{children}</div>
        <div className="mt-4 flex justify-end"></div>
      </div>
    </div>
  );
}
