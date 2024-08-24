'use client'
import { useState, useRef, useEffect } from "react"
import useSession from "@/hooks/useSession"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FaCaretDown, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa"

export const UserProfile = () => {  
    const router = useRouter()
    const { user, logout, fetchCurrentUser } = useSession()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!user) {
            fetchCurrentUser().catch(error => {
                console.error("Failed to fetch user:", error)
                // Handle error (e.g., redirect to login)
            })
        }
    }, [user, fetchCurrentUser])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/login')
        } catch (error) {
            console.error("Logout failed:", error)
            // Handle logout error (e.g., show an error message to the user)
        }
    }

    return (
        <div className="relative">
            <section 
                onClick={() => setIsModalOpen(!isModalOpen)} 
                className="flex items-center border-l-2 border-gray focus:outline-none cursor-pointer"
            >   
                <div className="mx-4">
                    <Image
                        alt="user avatar"
                        className="rounded-full w-[38px] h-[38px]"
                        src={'/apotek_rox.webp'} // Use user's avatar if available
                        width={500}
                        height={500}
                        quality={100}
                    />
                </div>
                <div>
                    <h1 className="font-semibold text-black tracking-wider text-[14px]">{user?.username}</h1>
                    <h2 className="text-sm text-gray-600 font-medium">{user?.role || 'User'}</h2>
                </div>
                <FaCaretDown
                    className={`m-3 text-gray-500 transition-transform duration-300 ${isModalOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                />
            </section>

            {isModalOpen && (
                <div ref={modalRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                            <p className="font-semibold">{user?.username}</p>
                            <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
                        </div>
                        <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <FaUser className="mr-2" /> Profile
                        </a>
                        <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <FaCog className="mr-2" /> Pengaturan
                        </a>
                        <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <FaQuestionCircle className="mr-2" /> Bantuan
                        </a>
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        >
                            <FaSignOutAlt className="mr-2" /> Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}