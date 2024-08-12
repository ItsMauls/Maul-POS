"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/images/logo-roxy.png";
import { SIDENAV_ITEMS } from "@/constants";
import { SideNavItem } from "@/types";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/AuthContext"; // Import useAuth hook

const SideNav = () => {
  const { signOut } = useAuth(); 

  return (
    <div>
      <div className="w-full bg-[#1166D8] h-full flex-1 border-r border-zinc-200 hidden md:flex flex-col justify-between">
        <div className="flex flex-col space-y-4 w-full py-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center md:px-6 h-16 w-full text-center text-white"
          >
            <Image src={logo} alt="" className="w-[38px] text-center" />
            <span>PBF</span>
          </Link>
          <div className="flex flex-col space-y-2 md:px-4 text-white">
            {SIDENAV_ITEMS.map((item, idx) => (
              <MenuItem key={idx} item={item} />
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-4 w-full py-4 px-8 text-white">
          <Link href="/account" className="flex flex-row space-x-4 items-center py-2 rounded-lg">
            <Icon icon="akar-icons:user" width={24} height={24} />
            <span className="font-semibold text-base">Account</span>
          </Link>
          <button
            onClick={signOut}
            className="flex flex-row space-x-4 items-center py-2 rounded-lg cursor-pointer"
          >
            <Icon icon="streamline:logout-1-solid" width={24} height={24} />
            <span className="font-semibold text-base">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  useEffect(() => {
    if (item.subMenuItems?.some((subItem) => subItem.path === pathname)) {
      setSubMenuOpen(true);
    }
  }, [item.subMenuItems, pathname]);

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const handleItemClick = () => {
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div className={`${subMenuOpen ? "rounded-lg bg-white text-[#667085]" : ""}`}>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center rounded-lg px-4 py-2 w-full justify-between ${
              pathname.includes(item.path) ? "" : ""
            } ${subMenuOpen ? "bg-white text-black" : ""}`}
          >
            <div className="flex flex-row space-x-2 items-center ">
              {item.icon}
              <span className="font-semibold text-md">{item.title}</span>
            </div>
            <div className={`${subMenuOpen ? "rotate-180" : ""} transition-transform`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 flex flex-col space-y-6">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`${
                    subItem.path === pathname
                      ? "font-semibold bg-[#F0F1F3] rounded-lg py-2 flex px-8 w-[80%] ml-4"
                      : "pl-12"
                  }`}
                >
                  <div className="flex items-center h-full">
                    <span>{subItem.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div onClick={handleItemClick}>
          <Link
            href={item.path}
            className={`flex flex-row space-x-4 items-center py-2 px-4 rounded-lg ${
              item.path === pathname ? "" : ""
            }`}
          >
            {item.icon}
            <span className="font-semibold text-base">{item.title}</span>
          </Link>
        </div>
      )}
    </div>
  );
};
