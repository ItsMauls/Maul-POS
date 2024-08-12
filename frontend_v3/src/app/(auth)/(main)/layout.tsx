import { QueryProvider } from "@/components/QueryProvider";
import { BreadCrumbs } from "@/components/ui/Breadcrumbs";
import { Navbar } from "@/components/ui/Navbar";
import { Sidebar } from "@/components/ui/Sidebar";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
    <QueryProvider>
      <div className="flex bg-gray-50 min-h-screen">
          <Sidebar />
          <div className="flex flex-col flex-grow">
              <Navbar pathName="" />
              <BreadCrumbs className="px-8 py bg-white" />
              <main className="flex-grow px-8 py-4">
                  {children}                                            
              </main>
          </div>
      </div>
      </QueryProvider>
    );
}
