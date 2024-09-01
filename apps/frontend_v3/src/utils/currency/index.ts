export const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// utils/roundUp.ts
export const roundUp = (value: number): number => {
    return Math.ceil(value / 100) * 100;
};