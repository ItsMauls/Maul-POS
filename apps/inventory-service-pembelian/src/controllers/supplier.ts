import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

export const supplierController = {
  async create(req: Request, res: Response) {
    try {
      const supplierData = req.body;
      const newSupplier = await prisma.supplier.create({
        data: supplierData,
      });
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Supplier created successfully',
        data: newSupplier,
      });
    } catch (error) {
      console.error('Error creating supplier:', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to create new supplier',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as keyof typeof prisma.supplier.fields || 'id';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'asc';
      const skip = (page - 1) * limit;

      const where: any = search ? {
        OR: [
          { kd_brgdg: { contains: search, mode: 'insensitive' } },
          { nama: { contains: search, mode: 'insensitive' } },
        ],
      } : {};

      const [suppliers, totalCount] = await Promise.all([
        prisma.supplier.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.supplier.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Suppliers retrieved successfully',
        data: suppliers,
        meta: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
        },
      });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch suppliers',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const supplier = await prisma.supplier.findUnique({
        where: { id: parseInt(id) },
      });

      if (!supplier) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Supplier not found',
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Supplier retrieved successfully',
        data: supplier,
      });
    } catch (error) {
      console.error('Error fetching supplier:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch supplier',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const supplierData = req.body;
      const updatedSupplier = await prisma.supplier.update({
        where: { id: parseInt(id) },
        data: supplierData,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Supplier updated successfully',
        data: updatedSupplier,
      });
    } catch (error) {
      console.error('Error updating supplier:', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to update supplier',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.supplier.delete({
        where: { id: parseInt(id) },
      });

      res.status(HTTP_STATUS.NO_CONTENT).json({
        success: true,
        message: 'Supplier deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to delete supplier',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};