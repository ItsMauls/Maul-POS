import { ReactNode } from "react";

export type SearchBarProps = {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: any;
    rightIcon?: ReactNode;
    leftIcon?: ReactNode;
    inputClassName?: string;
    id?: string;
  }