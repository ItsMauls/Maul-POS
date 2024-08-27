import { Request, Response } from 'express';
import { antrianService } from '../services/antrianService';
import { HTTP_STATUS } from '../constants/httpStatus';

export const antrianController = {
    async tambahAntrian(req: Request, res: Response) {
        try {
            const { idPelanggan, kdCab } = req.body;
            const antrian = await antrianService.addAntrian(idPelanggan, kdCab);
            res
            .status(HTTP_STATUS.CREATED)
            .json(antrian);
        } catch (error) {
            res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: 'Terjadi kesalahan saat menambah antrian', error });
        }
    },

    async selesaikanAntrian(req: Request, res: Response) {
        try {
            const { idAntrian } = req.params;
            const antrian = await antrianService.finishAntrian(Number(idAntrian));
            res
            .status(HTTP_STATUS.OK)
            .json(antrian);
        } catch (error) {
            res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: 'Terjadi kesalahan saat menyelesaikan antrian', error });
        }
    },

    async getAntrianHariIni(req: Request, res: Response) {
        try {
            const { kdCab } = req.params;
            const antrian = await antrianService.getAntrianToday(kdCab);
            res
            .status(HTTP_STATUS.OK)
            .json(antrian);
        } catch (error) {
            res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: 'Terjadi kesalahan saat mengambil data antrian', error });
        }
    },

    async getCurrentAntrianInfo(req: Request, res: Response) {
        try {
            const { kdCab } = req.params;
            const antrian = await antrianService.getCurrentAntrianInfo(kdCab);
            res
            .status(HTTP_STATUS.OK)
            .json(antrian);
        } catch (error) {
            res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: 'Terjadi kesalahan saat mengambil data antrian', error });
        }
    }
};