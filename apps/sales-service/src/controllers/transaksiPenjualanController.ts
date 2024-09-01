import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { HTTP_STATUS } from '../constants/httpStatus';
import prisma from '../config/prisma';
import * as pdfToPrinter from 'pdf-to-printer';

interface AuthRequest extends Request {
  user: any;
}

export const transaksiPenjualanController = {
  async createTransaction(req: any, res: Response) {
    try {
      const user = req.user;
      const {
        pelanggan,
        dokter,        
        jenis_penjualan,
        invoice_eksternal,
        catatan,
        total_harga,
        total_disc,
        total_sc_misc,
        total_promo,
        total_up,
        no_voucher,
        interval_transaksi,
        buffer_transaksi,
        kd_cab,
        items
      } = req.body;

      const transaction = await prisma.transaksi.create({
        data: {
          pelanggan: {
            create: {
              nama: pelanggan.nama,
              alamat: pelanggan.alamat,
              no_telp: pelanggan.noTelp,
              usia: parseInt(pelanggan.usia) || null,
              instansi: pelanggan.instansi,
              korp: pelanggan.korp,
            }
          },
          dokter: {
            create: {
              nama: dokter.nama,
              alamat: dokter.alamat,
              spesialisasi: dokter.noTelp || null,
            }
          },
          sales_pelayan: user.username,
          jenis_penjualan,
          invoice_eksternal,
          catatan,
          total_harga,
          total_disc,
          total_sc_misc,
          total_promo,
          total_up,
          no_voucher,
          interval_transaksi,
          buffer_transaksi,
          cabang: {
            connect: { kd_cab: kd_cab }
          },
          TransaksiDetail: {
            create: items.map((item: any) => ({
              kd_brgdg: item.kd_brgdg,
              jenis: item.rOption || 'R', // Provide a default value if jenis is undefined
              harga: item.harga || 0,
              qty: item.qty || 1,
              subjumlah: item.subjumlah || 0,
              disc: item.disc || 0,
              sc_misc: item.sc_misc || 0,
              promo: item.promo || 0,
              disc_promo: item.disc_promo || 0,
              up: item.up || 0,
            }))
          }
        },
        include: {
          pelanggan: true,
          dokter: true,
          TransaksiDetail: {
            include: {
              mainstock: true // Include this if you need product details
            }
          },
          cabang: true,
        },
      });

      // Prepare data for the HTML template
      const templateData = {
        transaction: {
          transType: '2',
          branch: {
            header: 'Apotek Ibra',
            address: 'Equity Tower SCBD',
            phoneNumber: '2132131',
            mobileNumber: '2132131',
            outlet: 'Outlet Name',
            email: 'company@email.com'
          },
          billNumber: transaction.invoice_eksternal,
          queue: 'Queue Number',
          date: new Date().toLocaleString(),
          cashier: user.username,
          shift: 'Shift Info',
          kassa: 'Kassa Info',
          productList: transaction.TransaksiDetail.map((detail: any) => ({
            productName: detail.mainstock.nm_brgdg,
            qty: detail.qty,
            amount: detail.subjumlah,
            nDisc: detail.disc,
            jnsPromo: detail.promo ? '3' : '0',
            r: detail.jenis,
            kdSc: '0',
            misc: false,
          })),
          subTotal: transaction.total_harga,
          totDiscount: transaction.total_disc,
          totPromo: transaction.total_promo,
          grandTotal: transaction.total_harga - transaction.total_disc - transaction.total_promo,
          payment: [{
            payFormat: transaction.total_harga - transaction.total_disc - transaction.total_promo,
            cashFormat: transaction.total_harga - transaction.total_disc - transaction.total_promo,
            changeFormat: '0',
            creditCardFormat: '0',
            debitCardFormat: '0',
            eWalletFormat: '0',
            transferBankFormat: '0',
            receivablesFormat: '0',
          }],
          customer: {
            pro: pelanggan.korp,
            address: pelanggan.alamat,
            phoneNumberCust: pelanggan.no_telp
          },
          doctor: dokter.nama,
          item: transaction.TransaksiDetail.length,
          print: new Date().toLocaleString(),
          createdBy: user.username,
          footerLine1: 'Thank you for your purchase',
          footerLine2: 'Please come again',
          footerLine3: '',
          footerLine4: '',
          footerLine5: '',
          isReceivables: false,
          corpPresent: false,
          nameEmployee: '',
          orderNumber: null,
        }
      };

      // Generate PDF receipt
      const templatePath = path.join(__dirname, '..', 'resources', 'transaksiStruk.html');
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);
      const html = template(templateData);
      // console.log('Compiled HTML:', html);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      const pdfBuffer = await page.pdf({ format: 'A4' });
      await browser.close();

      const base64Pdf = Buffer.from(pdfBuffer).toString('base64');

      // Save the PDF to a temporary file
      const tempDir = path.join(__dirname, '..', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      const pdfPath = path.join(tempDir, `receipt-${Date.now()}.pdf`);
      fs.writeFileSync(pdfPath, pdfBuffer);

      // Print the receipt
      await pdfToPrinter.print(pdfPath, { printer: process.env.PRINTER_NAME || undefined });

      // Update the transaction with the receipt
      console.log('transaction', transaction.id);
      
      await prisma.transaksi.update({
        where: { id: transaction.id },
        data: { receipt: base64Pdf }
      });

      res.status(HTTP_STATUS.CREATED).json({
        transaction,
        receipt: base64Pdf
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create transaction' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string || 'created_at';
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';
      const date = req.query.date as string;

      const skip = (page - 1) * limit;

      let where: any = {};

      if (search) {
        where.OR = [
          { id: { equals: parseInt(search) } }, // Assuming 'id' is used as 'no bon'
          { sales_pelayan: { contains: search, mode: 'insensitive' } },
          { pelanggan: { nama: { contains: search, mode: 'insensitive' } } },
          { dokter: { nama: { contains: search, mode: 'insensitive' } } },
        ];
      }

      if (date) {
        where.created_at = {
          gte: new Date(`${date}T00:00:00Z`),
          lt: new Date(`${date}T23:59:59Z`),
        };
      }

      const [transaksiList, totalCount] = await Promise.all([
        prisma.transaksi.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          select: {
            id: true, // 'no bon'
            created_at: true, // 'tanggal' and 'jam'
            sales_pelayan: true, // 'kasir'
            pelanggan: {
              select: {
                nama: true,
                alamat: true,
                instansi: true,
              },
            },
            dokter: {
              select: {
                nama: true,
              },
            },
          },
        }),
        prisma.transaksi.count({ where }),
      ]);

      const formattedTransaksiList = transaksiList.map((t: any) => ({
        no_bon: t.id,
        tanggal: t.created_at.toISOString().split('T')[0],
        jam: t.created_at.toISOString().split('T')[1].substring(0, 5),
        kasir: t.sales_pelayan,
        kassa: 'N/A', // This information is not in your current model
        shift: 'N/A', // This information is not in your current model
        customer: t.pelanggan.nama,
        alamat: t.pelanggan.alamat,
        instansi: t.pelanggan.instansi,
        dokter: t.dokter.nama,
      }));

      const totalPages = Math.ceil(totalCount / limit);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Transaksi penjualan list retrieved successfully',
        data: formattedTransaksiList,
        meta: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
        },
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch transaksi penjualan list',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transaksi = await prisma.transaksiPenjualan.findUnique({
        where: { id: parseInt(id) },
        include: { items: true },
      });

      if (!transaksi) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Transaksi penjualan not found',
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Transaksi penjualan retrieved successfully',
        data: transaksi,
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch transaksi penjualan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedTransaksi = await prisma.transaksiPenjualan.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: 'Transaksi penjualan updated successfully',
        data: updatedTransaksi,
      });
    } catch (error) {
      res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({
        success: false,
        message: 'Failed to update transaksi penjualan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.transaksiPenjualan.delete({
        where: { id: parseInt(id) },
      });
      res
      .status(HTTP_STATUS.NO_CONTENT)
      .json({
        success: true,
        message: 'Transaksi penjualan deleted successfully',
      });
    } catch (error) {
      res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({
        success: false,
        message: 'Failed to delete transaksi penjualan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};