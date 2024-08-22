import { notif } from "@/constants/notifications"
import { cn } from "@/lib/cn";
import { NotificationTypes } from "./type";
import { dateNow } from "../../../utils/date";

export const Notifications = ({className, hasDate} : NotificationTypes) => {
    return (
        <>
        {notif.map((val: any, idx) => {         
            return <button key={idx} className={cn("text-gray-500 text-xl px-2 last:border-r-2 border-black", className)}>{val.logo}</button>
            })}
            {hasDate && <h2 className="items-center text-sm flex text-gray-600 font-normal">{dateNow}</h2>}
        </>
    )
}