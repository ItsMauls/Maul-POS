import { Request, Response } from 'express';
import * as escpos from 'escpos';
import nodeHtmlToImage from 'node-html-to-image';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { HTTP_STATUS } from '../constants/httpStatus';
import prisma from '../config/prisma';

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
        payment_data,        
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
              tmainstock: true // Include this if you need product details
            }
          },
          cabang: true,
        },
      });
      console.log(transaction, 'gue butuh kembalian');
      console.log(payment_data, 'gue butuh PAYMENT');
      
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
            productName: detail.tmainstock.nm_brgdg,
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
            cashFormat: payment_data.cashPayment && payment_data.cashPayment.amount,
            changeFormat: payment_data.cashPayment && payment_data.cashPayment.amount - (transaction.total_harga - transaction.total_disc - transaction.total_promo),
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

      // Generate HTML receipt
      const templatePath = path.join(__dirname, '..', 'resources', 'transaksiStruk.html');
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);
      const html = template(templateData);

      let receiptData;
      try {
        // Try printing using the POS printer
        const image = await nodeHtmlToImage({
          html: html,
          quality: 100,
          type: 'png',
          puppeteerArgs: {
            args: ['--no-sandbox'],
          },
        }) as any

        // Set up the printer
        const device = new escpos.USB();
        const options = { width: 512, height: 512 } as any;
        const printer = new escpos.Printer(device, options);

        // Print the receipt
        await new Promise((resolve, reject) => {
          device.open(function(error){
            if (error) {
              console.error('Error opening USB device:', error);
              reject(error);
            } else {
              printer
                .align('CT')
                .image(image, 'S8')
                .cut()
                .close();
              resolve(void 0);
            }
          });
        });

        receiptData = image.toString('base64');
      } catch (printError) {
        console.error('Error printing receipt:', printError);
        
        // Fallback to PDF generation
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setContent(html);
          const pdf = await page.pdf({ format: 'A4' });
          await browser.close();

          if (Buffer.isBuffer(pdf)) {
            receiptData = pdf.toString('base64');
          } else if (Array.isArray(pdf) && pdf.every(item => typeof item === 'number')) {
            receiptData = Buffer.from(pdf).toString('base64');
          } else if (typeof pdf === 'object' && pdf !== null && pdf.buffer instanceof ArrayBuffer) {
            receiptData = Buffer.from(pdf.buffer).toString('base64');
          } else {
            console.error('Unexpected PDF type:', typeof pdf);
            throw new Error(`PDF generation failed: Unexpected PDF structure`);
          }
        } catch (pdfError: any) {
          console.error('Error generating PDF:', pdfError);
          console.error('PDF generation stack trace:', pdfError.stack);
          throw new Error('Failed to generate PDF receipt: ' + pdfError.message);
        }
      }

      // Update the transaction with the receipt
      await prisma.transaksi.update({
        where: { id: transaction.id },
        data: { receipt: receiptData }
      });

      res.status(HTTP_STATUS.CREATED).json({
        transaction,
        receipt: receiptData
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