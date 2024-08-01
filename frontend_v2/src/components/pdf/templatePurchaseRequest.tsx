'use client';

import { DetailPurchaseRequest } from '@/constants/types';
import { formatRupiah } from '@/libs/formater';
import { forwardRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface Props {
    data?: DetailPurchaseRequest;
    signatureImage1?: string;
    signatureImage2?: string;
}

const PurchaseRequestTemplate = forwardRef<
    HTMLDivElement,
    Props
>(({ data, signatureImage1, signatureImage2 }, ref) => {
    console.log(data);
  
    return (
        <div className="h-0 w-0 overflow-hidden">
            <div
                ref={ref}
                className="w-full"
            >
                <div className="flex justify-center">
                    <div className="w-full">
                        <div className="flex justify-center">
                            <h1 className="text-2xl font-bold">Purchase Request</h1>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between">
                                <div>
                                    <p>Request No: {data?.header.no}</p>
                                    <p>Request Date: {data?.header.tanggal}</p>
                                </div>
                                <div>
                                    <p>Request By: {data?.header.user.name}</p>
                                    <p>Gudang: {data?.header.gudang}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr>
                                        <th className="border border-black">No</th>
                                        <th className="border border-black">Kode Barang</th>
                                        <th className="border border-black">Barang</th>
                                        <th className="border border-black">Qty</th>
                                        <th className="border border-black">Harga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.detail.map((item, index) => (
                                        <tr key={index} className='p-2'>
                                            <td className="border border-black text-center">{index + 1}</td>
                                            <td className="border border-black pl-2">{item.barang.kode_barang}</td>
                                            <td className="border border-black pl-2">{item.barang.nama_barang}</td>
                                            <td className="border border-black text-center">{item.qty_pesan}</td>
                                            <td className="border border-black text-center">{formatRupiah(item.harga_ppn * item.qty_pesan || 0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between mt-4">
                            <div className="">
                                <p>Keterangan:</p>
                                <p>{data?.header.keterangan}</p>
                            </div>
                            <div className=''>
                                <p>Total Harga: {formatRupiah(data?.header.total || 0)}</p>
                                <p>Total Item: {data?.detail.length}</p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-10">
                            <div>
                                <p>Requested By:</p>
                                <p>{data?.header.user.name}</p>
                            </div>
                            <div>
                                <p>Approved By:</p>
                                <p>{data?.header?.user_approved?.name}</p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-10">
                            <div>
                                {signatureImage1 && <Image src={signatureImage1} width={100} height={100} alt='signatur 1' />}
                                {/* <Image src={signatureImage1} width={100} height={100} alt='signatur 1' /> */}
                                <p>_____________________</p>
                                <p>{data?.header.user.name}</p>
                            </div>
                            <div>
                                {/* <Image src={signatureImage2} width={100} height={100} alt='signatur 2' /> */}
                                {signatureImage2 && <Image src={signatureImage2} width={100} height={100} alt='signatur 2' />}
                                <p>_____________________</p>
                                <p>{data?.header?.user_approved?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
});
PurchaseRequestTemplate.displayName = 'PrintableTemplate';

export { PurchaseRequestTemplate };