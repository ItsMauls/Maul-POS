"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.antrianController = void 0;
const antrianService_1 = require("../services/antrianService");
const httpStatus_1 = require("../constants/httpStatus");
exports.antrianController = {
    async tambahAntrian(req, res) {
        try {
            const { idPelanggan, kdCab } = req.body;
            const antrian = await antrianService_1.antrianService.addAntrian(idPelanggan, kdCab);
            res
                .status(httpStatus_1.HTTP_STATUS.CREATED)
                .json(antrian);
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({ message: 'Terjadi kesalahan saat menambah antrian', error });
        }
    },
    async selesaikanAntrian(req, res) {
        try {
            const { idAntrian } = req.params;
            const antrian = await antrianService_1.antrianService.finishAntrian(Number(idAntrian));
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json(antrian);
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({ message: 'Terjadi kesalahan saat menyelesaikan antrian', error });
        }
    },
    async getAntrianHariIni(req, res) {
        try {
            const { kdCab } = req.params;
            const antrian = await antrianService_1.antrianService.getAntrianToday(kdCab);
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json(antrian);
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({ message: 'Terjadi kesalahan saat mengambil data antrian', error });
        }
    },
    async getCurrentAntrianInfo(req, res) {
        try {
            const { kdCab } = req.params;
            const antrian = await antrianService_1.antrianService.getCurrentAntrianInfo(kdCab);
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json(antrian);
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({ message: 'Terjadi kesalahan saat mengambil data antrian', error });
        }
    }
};
