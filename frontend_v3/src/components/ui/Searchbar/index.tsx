import { cn } from "@/lib/cn"
import { CiSearch } from "react-icons/ci";
import { SearchBarProps } from "./type";

export const SearchBar = ({
    value,
    onChange,
    placeholder,
    className,
    rightIcon,
    leftIcon,
    inputClassName,
    id
} : SearchBarProps) => {
    return (
        <div className={cn('flex items-center bg-white rounded-lg', className)}>
            {leftIcon && (
                <span className="pl-2 cursor-pointer">
                    {leftIcon}
                </span>
            )}
            <input
                className={cn('flex-1 w-full p-2 outline-none rounded-md', 
                             leftIcon ? 'pl-8' : 'pl-2', 
                             rightIcon ? 'pr-8' : 'pr-2',
                            inputClassName)}
                type="search"
                placeholder={placeholder}
                id={id}
                value={value}
                onChange={onChange}
            />
            {rightIcon ? (
                <span className="pr-2 cursor-pointer">
                    {rightIcon}
                </span>
            ): <CiSearch className="text-[20px] cursor-pointer font-bold text-gray-500"/>}
        </div>
    )
}
