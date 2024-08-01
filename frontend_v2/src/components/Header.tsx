"use client";

import React, { useEffect, useState } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

import useScroll from "@/hooks/UseScroll";
import Cookies from 'js-cookie';
import { User } from "@/constants/types";


const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logotype */}
        <div className="flex items-center space-x-3">
          {/* <Link href="/" className="md:hidden flex items-center space-x-3">
            <Image src={logo} alt="Logo" className="h-[31.7px] w-[50px]" />
          </Link>
          <Link
            href="/"
            className="hidden md:flex items-center space-x-3 hover:text-cyan-600"
          >
            Kembali ke website
          </Link> */}

          {/* User info */}
        </div>
        {user && (
            <div className="flex items-center space-x-3">
              <span className="text-l text-bold">
                {user.name} ({user.role.name})
              </span>
            </div>
          )}
      </div>
    </div>
  );
};

export default Header;