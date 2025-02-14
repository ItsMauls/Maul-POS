'use client'
import { useState, useEffect } from "react";

const formatDate = (date: Date): string => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[date.getDay()];

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${dayName}, ${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

const DateComponent = () => {
    const [currentDate, setCurrentDate] = useState(formatDate(new Date()));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(formatDate(new Date()));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <span>{currentDate}</span>;
};

export default DateComponent;