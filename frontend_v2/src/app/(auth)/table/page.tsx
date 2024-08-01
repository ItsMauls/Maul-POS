"use client";
import React, { useState } from "react";
import Card from "@/components/Card";
import Table from "@/components/Table";
import DefaultPagination from "@/components/Pagination";
import Toolbar from "@/components/toolbar/PurchaseRequest";
import AddPurchase from "@/components/modal_add/AddPurchase";

export default function TablePage() {
  const dummyData = [
    {
      no_pr: "PR124/00793838",
      no_po: "PB24/000793838",
      scan: "C:scanFakturPembelian",
      jns_trans: "Pembelian",
      tgl_po: "24/06/24",
      no_ref: 170500,
      tgl_ref: "24/06/24",
      nama_supplier: "Esa Jasa Indonesia",
      total: 490950000,
      keterangan: "-",
      tgl_jt: "24/06/24",
      userId: "NOVA",
      status_approval: "Di Setujui",
      tgl_approval: "24/06/24",
    },
    {
      no_pr: "PR124/00793838",
      no_po: "PB24/000793838",
      scan: "C:scanFakturPembelian",
      jns_trans: "Pembelian",
      tgl_po: "24/06/24",
      no_ref: 170500,
      tgl_ref: "24/06/24",
      nama_supplier: "Esa Jasa Indonesia",
      total: 490950000,
      keterangan: "-",
      tgl_jt: "24/06/24",
      userId: "NOVA",
      status_approval: "Di Setujui",
      tgl_approval: "24/06/24",
    },
    {
      no_pr: "PR124/00793839",
      no_po: "PB24/000793839",
      scan: "C:scanFakturPembelian",
      jns_trans: "Pembelian",
      tgl_po: "24/06/24",
      no_ref: 170500,
      tgl_ref: "24/06/24",
      nama_supplier: "Esa Jasa Indonesia",
      total: 490950000,
      keterangan: "-",
      tgl_jt: "24/06/24",
      userId: "NOVA",
      status_approval: "Di Setujui",
      tgl_approval: "24/06/24",
    },
    {
      no_pr: "PR124/00793840",
      no_po: "PB24/000793840",
      scan: "C:scanFakturPembelian",
      jns_trans: "Pembelian",
      tgl_po: "24/06/24",
      no_ref: 170500,
      tgl_ref: "24/06/24",
      nama_supplier: "Esa Jasa Indonesia",
      total: 490950000,
      keterangan: "-",
      tgl_jt: "24/06/24",
      userId: "NOVA",
      status_approval: "Di Setujui",
      tgl_approval: "24/06/24",
    },
    {
      no_pr: "PR124/00793838",
      no_po: "PB24/000793838",
      scan: "C:scanFakturPembelian",
      jns_trans: "Pembelian",
      tgl_po: "24/06/24",
      no_ref: 170500,
      tgl_ref: "24/06/24",
      nama_supplier: "Esa Jasa Indonesia",
      total: 490950000,
      keterangan: "-",
      tgl_jt: "24/06/24",
      userId: "NOVA",
      status_approval: "Di Setujui",
      tgl_approval: "24/06/24",
    },
    {
      no_pr: "PR124/00793839",
      no_po: "PB24/000793839",
      scan: "C:scanFakturPembelian",
      jns_trans: "Pembelian",
      tgl_po: "24/06/24",
      no_ref: 170500,
      tgl_ref: "24/06/24",
      nama_supplier: "Esa Jasa Indonesia",
      total: 490950000,
      keterangan: "-",
      tgl_jt: "24/06/24",
      userId: "NOVA",
      status_approval: "Di Setujui",
      tgl_approval: "24/06/24",
    },
    {
      no_pr: "PR124/00793841",
      no_po: "PB24/00079384",
      scan: "C:scanFakturPembelian",
      jns_trans: "Pembelian",
      tgl_po: "24/06/24",
      no_ref: 170500,
      tgl_ref: "24/06/24",
      nama_supplier: "Esa Jasa Indonesia",
      total: 490950000,
      keterangan: "-",
      tgl_jt: "24/06/24",
      userId: "NOVA",
      status_approval: "Di Setujui",
      tgl_approval: "24/06/24",
    },
  ];

  const columns = [
    { key: "no_pr", label: "Nomer PR" },
    { key: "no_po", label: "Nomer PO" },
    { key: "scan", label: "Scan" },
    { key: "jns_trans", label: "Jns Trans" },
    { key: "tgl_po", label: "Tanggal PO" },
    { key: "no_ref", label: "Nomer Referensi" },
    { key: "tgl_ref", label: "Tanggal Referensi" },
    { key: "nama_supplier", label: "Nama Supplier" },
    { key: "total", label: "Total" },
    { key: "keterangan", label: "Keterangan" },
    { key: "tgl_jt", label: "Tanggal Jatuh Tempo" },
    { key: "userId", label: "User ID" },
    { key: "status_approval", label: "Status Approval" },
    { key: "tgl_approval", label: "Tanggal Approval" },
  ];

  const renderButtons = (user: any, index: any) => [
    <AddPurchase key={index} title="Tambah Purchase Order" />,
  ];
  

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const getDataWithRowNumbers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return dummyData.slice(startIndex, endIndex).map((user, index) => ({
      ...user,
      no: startIndex + index + 1,
    }));
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Toolbar />
      
        <Table
          columns={columns}
          data={getDataWithRowNumbers()}
          renderButtons={renderButtons}
        />
      
      <DefaultPagination
        page={currentPage}
        totalData={dummyData.length}
        pageSize={pageSize}
        totalPage={Math.ceil(dummyData.length / pageSize)}
        paginate={paginate}
      />
    </div>
  );
}
