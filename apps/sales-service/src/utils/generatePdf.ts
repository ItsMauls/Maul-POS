import PDFDocument from 'pdfkit';

export async function generatePDFReceipt(transaction: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

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
    transaction.TransaksiDetail.forEach((item: any) => {
      doc.text(`${item.kd_brgdg} - Qty: ${item.qty} - Price: ${item.harga}`);
    });

    doc.moveDown();
    doc.text(`Total: ${transaction.total_harga}`);
    doc.text(`Discount: ${transaction.total_disc}`);
    doc.text(`Final Total: ${transaction.total_harga - transaction.total_disc}`);

    doc.end();
  });
}