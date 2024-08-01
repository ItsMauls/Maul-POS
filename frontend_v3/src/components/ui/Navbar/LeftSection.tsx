'use client'
import { useModifiedPathName } from "@/hooks/useModifiedPathName"



export const LeftSection = ({
    leftSectionWithPath,
    navTitle,
    defaultTitle
}: any) => {
    const { firstPath, secondPath } = useModifiedPathName()

    return (
        <>          
       {
        leftSectionWithPath ? 
            <div className="text-black font-semibold text-2xl tracking-wide px-1 rounded-md">{firstPath} {secondPath}</div> : defaultTitle ? 
            <h1 className="uppercase text-green-500 font-semibold text-xl">pedagang besar farmasi</h1> : navTitle ?
            <h1 className="uppercase text-black font-semibold text-xl">{navTitle}</h1> :
            <h1 className="tracking-wider text-black font-semibold text-xl">{ secondPath }</h1> 
        }   
        </>
    )
}