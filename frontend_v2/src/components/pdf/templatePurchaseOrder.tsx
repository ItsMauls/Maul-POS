'use client';

import { DetailPurchaseOrder } from '@/constants/types';
import { formatRupiah } from '@/libs/formater';
import { forwardRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/libs/cn';

interface Props {
    data?: DetailPurchaseOrder;
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
                                    <p>No PR: {data?.header.no_ref}</p>
                                    <p>Tanggal PR: {data?.header.tgl_ref}</p>
                                    <p>No PO: {data?.header.no_po}</p>
                                    <p>Tanggal PO: {data?.header.tgl_po}</p>
                                </div>
                                <div>
                                    <p>User: {data?.header.user.name}</p>
                                    <p>Gudang: {data?.header.gudang}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr>
                                        <th className="border border-black p-2">No</th>
                                        <th className="border border-black p-2">Kode</th>
                                        <th className="border border-black p-2">Barang</th>
                                        <th className="border border-black p-2">Batch</th>
                                        <th className="border border-black p-2">Expired</th>
                                        <th className="border border-black p-2">Qty</th>
                                        <th className="border border-black p-2">Harga</th>
                                        <th className='border border-black p-2'>Disc</th>
                                        <th className="border border-black p-2">Total NPPn</th>
                                        <th className="border border-black p-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.detail.map((item, index) => (
                                        <tr key={index} className={
                                            cn('p-2', item.new_item ? 'bg-yellow-100 italic' : '')
                                        }>
                                            <td className="border border-black p-2 text-center">{index + 1}</td>
                                            <td className="border border-black p-2 ">{item.barang.kode_barang}</td>
                                            <td className="border border-black p-2 ">{item.barang.nama_barang}</td>
                                            <td className="border border-black p-2 text-center">{item.batch}</td>
                                            <td className="border border-black p-2 text-center">{item.tgl_expired}</td>
                                            <td className="border border-black p-2 text-center">{item.qty}</td>
                                            <td className="border border-black p-2 text-center">{formatRupiah(item.barang.harga_beli)}</td>
                                            <td className="border border-black p-2 text-center">{formatRupiah(item.disc_nominal)}</td>
                                            <td className="border border-black p-2 text-center">{formatRupiah(item.total_nppn)}</td>
                                            <td className="border border-black p-2 text-center">{formatRupiah(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between mt-4">
                            <div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="">
                                        <tr>
                                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Deskripsi
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jumlah
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="p-2 whitespace-nowrap">Total Diskon</td>
                                            <td className="p-2 whitespace-nowrap">{formatRupiah(data?.header.total_diskon || 0)}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 whitespace-nowrap">Total NoPPN</td>
                                            <td className="p-2 whitespace-nowrap">{formatRupiah(data?.header.total_net || 0)}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 whitespace-nowrap">Total PPN</td>
                                            <td className="p-2 whitespace-nowrap">{formatRupiah(data?.header.total_ppn || 0)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="">
                                        <tr>
                                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Deskripsi
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jumlah
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="p-2 whitespace-nowrap">Sub Total</td>
                                            <td className="p-2 whitespace-nowrap">{formatRupiah(data?.header.total || 0)}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 whitespace-nowrap">Total Item</td>
                                            <td className="p-2 whitespace-nowrap">{data?.detail.length}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-between mt-10">
                            <div>
                                <p>Approved 2 By:</p>
                                <p>{data?.header?.user_approved_1?.name}</p>
                            </div>
                            <div>
                                <p>Approved 2 By:</p>
                                <p>{data?.header?.user_approved_2?.name}</p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-10">
                            <div>
                                {signatureImage1 && <Image src={signatureImage1} width={100} height={100} alt='signatur 1' />}
                                {/* <Image src={signatureImage1} width={100} height={100} alt='signatur 1' /> */}
                                <p>_____________________</p>
                                <p>{data?.header?.user_approved_1?.name}</p>
                            </div>
                            <div>
                                {/* <Image src={signatureImage2} width={100} height={100} alt='signatur 2' /> */}
                                {signatureImage2 && <Image src={signatureImage2} width={100} height={100} alt='signatur 2' />}
                                <p>_____________________</p>
                                <p>{data?.header?.user_approved_2?.name}</p>
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