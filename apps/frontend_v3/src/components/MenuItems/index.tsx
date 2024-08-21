import { homeMenus } from "@/constants/navigation-menu";
import Link from "next/link";

export const Menu: React.FC = () => {
  return (
    <div className="flex gap-4 bg-blue-500 p-4 justify-center rounded-lg">
      {homeMenus.map((item, index) => (
        <Link href={item.link ?? ''}>
        <div 
          key={index} 
          className="flex flex-col items-center border-8 border-blue-500 border-opacity-85 bg-white py-6 px-3 rounded-2xl shadow-md min-h-[150px] flex-shrink w-[150px]"
        >
          <div className="text-3xl text-teal-500">{item.icon}</div>
          <div className="mt-2 text-center">{item.name}</div>
        </div>
        </Link>
      ))}
    </div>
  );
};
