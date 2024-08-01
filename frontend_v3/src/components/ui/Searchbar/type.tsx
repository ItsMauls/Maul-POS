import { ReactNode } from "react";

export type SearchBarProps = {
    placeholder?: string;
    className?: any;
    rightIcon?: ReactNode;
    leftIcon?: ReactNode;
    inputClassName?: string;
    id?: string;
  }