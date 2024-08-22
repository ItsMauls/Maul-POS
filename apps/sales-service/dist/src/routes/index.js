"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const info_obat_1 = __importDefault(require("./info-obat"));
const transaksi_penjualan_1 = __importDefault(require("./transaksi-penjualan"));
const retur_penjualan_1 = __importDefault(require("./retur-penjualan"));
const router = (0, express_1.Router)();
router.use('/info-obat', info_obat_1.default);
router.use('/transaksi-penjualan', transaksi_penjualan_1.default);
router.use('/retur-penjualan', retur_penjualan_1.default);
exports.default = router;
