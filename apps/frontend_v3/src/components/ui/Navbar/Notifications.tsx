import { notif } from "@/constants/notifications";
import dynamic from "next/dynamic";
import { NotificationTypes } from "./type";

const DateComponent = dynamic(() => import("@/utils/date"), { ssr: false });

export const Notifications = ({ className, hasDate }: NotificationTypes) => {
    return (
        <>
            {notif.map((val: any, idx) => (         
                <button key={idx} className="text-gray-500 text-xl px-2 last:border-r-2 border-black">
                    {val.logo}
                </button>
            ))}
            {hasDate && <h2 className="items-center text-sm flex text-gray-600 font-normal"><DateComponent /></h2>}
        </>
    );
};