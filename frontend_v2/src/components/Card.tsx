import { ReactNode } from "react";

function Card({ title, children, topMargin, TopSideButtons }: { title: string; children: ReactNode; topMargin: string; TopSideButtons?: ReactNode }) {
  return (
    <div className={`bg-white rounded-lg shadow-xl ${topMargin || "mt-6"} p-6 w-full`}>

      {/* Title for Card */}
      <div className="text-xl font-semibold flex justify-between items-center mb-3">
        {title}

        {/* Top side button, show only if present */}
        {TopSideButtons && <div className="ml-auto">{TopSideButtons}</div>}
      </div>

      <div className="h-[1.5px] mt-2 mb-2 bg-gray-200"></div>

      {/* Card Body */}
      <div className="h-full w-full pb-6 mt-3">
        {children}
      </div>
    </div>
  );
}

export default Card;
