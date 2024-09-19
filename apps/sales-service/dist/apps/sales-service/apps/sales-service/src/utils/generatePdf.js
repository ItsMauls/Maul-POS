"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDFReceipt = generatePDFReceipt;
const pdfkit_1 = __importDefault(require("pdfkit"));
async function generatePDFReceipt(transaction) {
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default();
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.fontSize(18).text('Transaction Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Transaction ID: ${transaction.id}`);
        doc.text(`Date: ${transaction.created_at}`);
        doc.text(`Customer: ${transaction.pelanggan.nama}`);
        doc.text(`Sales Person: ${transaction.sales_pelayan}`);
        doc.moveDown();
        doc.text('Items:', { underline: true });
        transaction.TransaksiDetail.forEach((item) => {
            doc.text(`${item.kd_brgdg} - Qty: ${item.qty} - Price: ${item.harga}`);
        });
        doc.moveDown();
        doc.text(`Total: ${transaction.total_harga}`);
        doc.text(`Discount: ${transaction.total_disc}`);
        doc.text(`Final Total: ${transaction.total_harga - transaction.total_disc}`);
        doc.end();
    });
}
