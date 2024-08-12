'use client'

import { IoMdArrowDropright } from "react-icons/io";
import { useModifiedPathName } from "@/hooks/useModifiedPathName";
import { cn } from "@/lib/cn";

export const BreadCrumbs = ({ className }) => {
    const { firstPath, secondPath } = useModifiedPathName()

    return (
        <div className={cn(`flex items-center`, className)}>
            <h2 className="text-sm text-gray-600 font-medium tracking-wide">Home</h2> 
            <IoMdArrowDropright className="mx-2 text-gray-500 text-2xl"/>
            <h2 className="text-sm text-gray-600 font-medium tracking-wide">{firstPath}</h2> 
            <IoMdArrowDropright className="mx-2 text-gray-500 text-2xl"/>
            <h2 className="text-sm text-blue-500 font-semibold">{secondPath}</h2>
        </div>        
    )
}