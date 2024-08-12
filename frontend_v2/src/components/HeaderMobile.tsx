'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/images/logo.png';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SIDENAV_ITEMS } from '@/constants';
import { SideNavItem } from '@/types';
import { usePathname } from "next/navigation";

const HeaderMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="md:hidden sticky inset-x-0 top-0 z-30 w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo di kiri */}
        <Link href="/" className="flex items-center space-x-3">
          <Image src={logo} alt="Logo" className="w-[70px]" />
        </Link>
        {/* Tombol menu di kanan */}
        <MenuToggle toggle={toggleMenu} isOpen={menuOpen} />
      </div>
      {menuOpen && (
        <div className="px-4 py-2">
          {/* Dynamic mobile navigation menu */}
          <ul>
            {SIDENAV_ITEMS.map((item, idx) => (
              <MobileMenuItem key={idx} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderMobile;

const MobileMenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();

  return (
    <li>
      <Link href={item.path} className={`${item.path === pathname ? 'font-bold' : ''}`}>
        <span>{item.title}</span>
      </Link>
    </li>
  );
};

const MenuToggle = ({ toggle, isOpen }: { toggle: any, isOpen: boolean }) => (
  <button
    onClick={toggle}
    className="pointer-events-auto relative z-30"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
        animate={isOpen ? 'open' : 'closed'}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
        animate={isOpen ? 'open' : 'closed'}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
        animate={isOpen ? 'open' : 'closed'}
      />
    </svg>
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);
