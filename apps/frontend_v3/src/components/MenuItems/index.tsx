'use client'
import { homeMenus } from "@/constants/navigation-menu";
import { useRouter, useSearchParams } from "next/navigation"; // Untuk Next.js App Router
import SetupKassaModal from "../modals/SetupKassaModal"; // Tambahkan import

export const Menu: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showModal = searchParams.get("modal") === "true"; // Tambahkan ini

  return (
    <>
      <div className="flex gap-4 bg-blue-500 p-4 justify-center rounded-lg">
        {homeMenus.map((item, index) => {
          const handleClick = () => {
            console.log(`Clicked on ${item.name}`);

            if (item.name === "Setup Kassa") {
              // Tambahkan query param modal=true tanpa reload
              const params = new URLSearchParams(Array.from(searchParams.entries()));
              params.set("modal", "true");
              router.replace(`?${params.toString()}`);
            } else {
              // Navigasi biasa untuk item lain
              router.push(item.link ?? "#");
            }
          };

          return (
            <div
              key={index}
              className="flex flex-col items-center border-8 border-blue-500 border-opacity-85 bg-white py-6 px-3 rounded-2xl shadow-md min-h-[150px] flex-shrink w-[150px] cursor-pointer"
              onClick={handleClick}
            >
              <div className="text-3xl text-teal-500">{item.icon}</div>
              <div className="mt-2 text-center">{item.name}</div>
            </div>
          );
        })}
      </div>

      {showModal && <SetupKassaModal/>}
    </>
  );
};