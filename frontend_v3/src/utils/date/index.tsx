function formatDate(date: Date): string {
    const days: string[] = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName: string = days[date.getDay()];

    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year: number = date.getFullYear();

    const hours: string = String(date.getHours()).padStart(2, '0');
    const minutes: string = String(date.getMinutes()).padStart(2, '0');
    const seconds: string = String(date.getSeconds()).padStart(2, '0');

    return `${dayName}, ${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

export const dateNow = formatDate(new Date())

