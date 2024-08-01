import { Icon } from "@iconify/react";
import { SideNavItem } from "../types";
import icon from "@/assets/images/Vector.png"
import Image from "next/image";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <Icon icon="mage:dashboard-fill" width="24" height="24" />,
  },
  {
    title: "Transaksi",
    path: "/",
    icon: <Icon icon="heroicons-outline:shopping-cart" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      {title: "Purchase Request (PR)", path: "/transaksi/purchase-request"},
      {title: "Purchase Order (PO)", path: "/transaksi/purchase-order"},
      {title: "Faktur Pembelian", path: "/transaksi/faktur-pembelian"},
    ]
  },
  {
    title: "Master",
    path: "/",
    icon: <Icon icon="hugeicons:book-04" width={24} height={24} />,
    submenu: true,
    subMenuItems: [
      {title: "Master Barang", path: "/master/master-barang"},
      {title: "Master User", path: "/master/master-user"},
    ]
  },
];
