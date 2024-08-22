import Image from "next/image"

export const BranchInfo = () => {
    return (
        <section className="flex justify-center w-5/6 mr-20 mt-4 items-center mx-auto">   
            <div className="mx-4">
                <Image 
                    alt="branch"
                    className="rounded-full w-[34px] h-[34px]"
                    src={'/apotek_rox.webp'}
                    width={500}
                    height={500}
                    quality={100}
                />
            </div>
            <div className="text-white">
                <h1 className="font-semibold text-[14px]">Pedagang Besar Farmasi</h1>
            </div>
        </section>
    )
}