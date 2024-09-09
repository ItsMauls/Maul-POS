"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.antrianService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
exports.antrianService = {
    async addAntrian(idPelanggan, kdCab) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastAntrian = await prisma_1.default.antrian.findFirst({
            where: {
                tanggal: {
                    gte: today
                },
                kd_cab: kdCab
            },
            orderBy: {
                no_antrian: 'desc'
            }
        });
        const noAntrian = lastAntrian ? lastAntrian.no_antrian + 1 : 1;
        return prisma_1.default.antrian.create({
            data: {
                no_antrian: noAntrian,
                id_pelanggan: idPelanggan,
                kd_cab: kdCab,
                tanggal: new Date(),
                mulai: new Date().toISOString(),
                status: 'MENUNGGU'
            }
        });
    },
    async finishAntrian(idAntrian) {
        const antrian = await prisma_1.default.antrian.findUnique({
            where: { id_antrian: idAntrian }
        });
        if (!antrian)
            throw new Error('Antrian tidak ditemukan');
        const selesai = new Date();
        const mulai = new Date(antrian.mulai);
        const durasiDetik = Math.floor((selesai.getTime() - mulai.getTime()) / 1000);
        return prisma_1.default.antrian.update({
            where: { id_antrian: idAntrian },
            data: {
                selesai: selesai.toISOString(),
                timer: durasiDetik.toString(),
                status: 'SELESAI'
            }
        });
    },
    async getAntrianToday(kdCab) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return prisma_1.default.antrian.findMany({
            where: {
                tanggal: {
                    gte: today
                },
                kd_cab: kdCab
            },
            orderBy: {
                no_antrian: 'asc'
            }
        });
    },
    async getCurrentAntrianInfo(kdCab) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastAntrian = await prisma_1.default.antrian.findFirst({
            where: {
                tanggal: {
                    gte: today
                },
                kd_cab: kdCab
            },
            orderBy: {
                no_antrian: 'desc'
            }
        });
        const noAntrian = lastAntrian ? lastAntrian.no_antrian : 0;
        const periode = today.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return {
            noAntrian,
            periode
        };
    }
};
