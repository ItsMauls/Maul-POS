import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { getMacAddress } from '../utils/network';

export class CabangController {
  // Create a new kassa for a specific branch
  async createKassa(req: Request, res: Response) {
    try {
      const {
        no_kassa,
        type_jual,
        status_antrian,
        fingerprint,
        default_printer,
        kd_cab
      } = req.body;

      // Get MAC address of the current machine
      const mac_address = await getMacAddress();
      
      // Check if MAC address is already registered
      const existingKassa = await prisma.mKassa.findFirst({
        where: { mac_address }
      });

      if (existingKassa) {
        return res.status(400).json({
          success: false,
          message: 'This MAC address is already registered to a kassa'
        });
      }

      // Verify if branch exists
      const branch = await prisma.mCabang.findUnique({
        where: { kd_cab }
      });

      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found'
        });
      }

      const newKassa = await prisma.mKassa.create({
        data: {
          no_kassa,
          mac_address,
          type_jual,
          status_antrian,
          fingerprint,
          default_printer,
          kd_cab
        }
      });

      return res.status(201).json({
        success: true,
        data: newKassa
      });
    } catch (error) {
      console.error('Error creating kassa:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get branch and kassa information based on MAC address
  async getBranchByMacAddress(req: Request, res: Response) {
    try {
      const mac_address = await getMacAddress();

      const kassaWithBranch = await prisma.mKassa.findFirst({
        where: { mac_address },
        include: {
          cabang: true
        }
      });

      if (!kassaWithBranch) {
        return res.status(404).json({
          success: false,
          message: 'No branch found for this MAC address'
        });
      }

      return res.status(200).json({
        success: true,
        data: kassaWithBranch
      });
    } catch (error) {
      console.error('Error fetching branch:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all kassas for a specific branch
  async getKassasByBranch(req: Request, res: Response) {
    try {
      const { kd_cab } = req.params;

      const kassas = await prisma.mKassa.findMany({
        where: { kd_cab }
      });

      return res.status(200).json({
        success: true,
        data: kassas
      });
    } catch (error) {
      console.error('Error fetching kassas:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create a new branch
  async createBranch(req: Request, res: Response) {
    try {
      const {
        kd_cab,
        nm_cab,
        alamat,
        no_telepon,
        no_hp,
        email,
        id_tipe_cabang,
        id_area,
        shift,
        id_instansi,
        bpjs
      } = req.body;

      // Check if branch code already exists
      const existingBranch = await prisma.mCabang.findUnique({
        where: { kd_cab }
      });

      if (existingBranch) {
        return res.status(400).json({
          success: false,
          message: 'Branch code already exists'
        });
      }

      const newBranch = await prisma.mCabang.create({
        data: {
          kd_cab,
          nm_cab,
          alamat,
          no_telepon,
          no_hp,
          email,
          id_tipe_cabang,
          id_area,
          shift,
          id_instansi,
          bpjs: bpjs || false
        }
      });

      return res.status(201).json({
        success: true,
        data: newBranch
      });
    } catch (error) {
      console.error('Error creating branch:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all branches
  async getAllBranches(req: Request, res: Response) {
    try {
      const branches = await prisma.mCabang.findMany({
        where: {
          deleted_status: false
        },
        include: {
          kassa: true
        }
      });

      return res.status(200).json({
        success: true,
        data: branches
      });
    } catch (error) {
      console.error('Error fetching branches:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get branch by code
  async getBranchByCode(req: Request, res: Response) {
    try {
      const { kd_cab } = req.params;

      const branch = await prisma.mCabang.findUnique({
        where: {
          kd_cab,
          deleted_status: false
        },
        include: {
          kassa: true
        }
      });

      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: branch
      });
    } catch (error) {
      console.error('Error fetching branch:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update branch
  async updateBranch(req: Request, res: Response) {
    try {
      const { kd_cab } = req.params;
      const updateData = req.body;

      const existingBranch = await prisma.mCabang.findUnique({
        where: { kd_cab }
      });

      if (!existingBranch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found'
        });
      }

      const updatedBranch = await prisma.mCabang.update({
        where: { kd_cab },
        data: updateData
      });

      return res.status(200).json({
        success: true,
        data: updatedBranch
      });
    } catch (error) {
      console.error('Error updating branch:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Soft delete branch
  async deleteBranch(req: Request, res: Response) {
    try {
      const { kd_cab } = req.params;

      const existingBranch = await prisma.mCabang.findUnique({
        where: { kd_cab }
      });

      if (!existingBranch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found'
        });
      }

      await prisma.mCabang.update({
        where: { kd_cab },
        data: {
          deleted_status: true,
          deleted_at: new Date()
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Branch successfully deleted'
      });
    } catch (error) {
      console.error('Error deleting branch:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update kassa
  async updateKassa(req: Request, res: Response) {
    try {
      const { no_kassa } = req.params;
      const {
        type_jual,
        status_antrian,
        fingerprint,
        default_printer,
        status_operasional
      } = req.body;

      // Check if kassa exists
      const existingKassa = await prisma.mKassa.findFirst({
        where: { no_kassa }
      });

      if (!existingKassa) {
        return res.status(404).json({
          success: false,
          message: 'Kassa tidak ditemukan'
        });
      }

      // Update kassa
      const updatedKassa = await prisma.mKassa.update({
        where: { no_kassa },
        data: {
          type_jual,
          status_antrian,
          fingerprint,
          default_printer,
          status_operasional
        }
      });

      return res.status(200).json({
        success: true,
        data: updatedKassa
      });
    } catch (error) {
      console.error('Error updating kassa:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
