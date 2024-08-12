import { BsCalendarWeekFill } from "react-icons/bs";
import { RiNotification2Fill } from "react-icons/ri";
import { IoMail } from "react-icons/io5";

export const notif = [
    {
        name : 'notification',
        link : '/notification',
        logo : <RiNotification2Fill />,
    },
    {
        name : 'inbox',
        link : '/inbox',
        logo : <IoMail/>,
    },
    {
        name : 'schedule',
        link : '/schedules',
        logo : <BsCalendarWeekFill/>,
    },
]