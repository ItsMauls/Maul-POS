'use client'
import AccordionMenu from "@/components/Accordion"
import { eticketMenus, masterDataMenus, transaksiPembelianMenus, transaksiPenjualanMenus } from "@/constants/navigation-menu"
import { usePathname } from "next/navigation"

export const NavigationMenu = () => {
    const pathName = usePathname()

    let menus = [] as any

    const transaksiPenjualanPage = pathName.startsWith('/transaksi-penjualan') 
    const transaksiPembelianPage = pathName.startsWith('/transaksi-pembelian') 
    const masterDataPage = pathName.startsWith('/master-data')
    const eTicketPage = pathName.startsWith('/e-ticket')

    if(transaksiPembelianPage) menus = transaksiPembelianMenus
    else if(transaksiPenjualanPage) menus = transaksiPenjualanMenus
    else if(masterDataPage) menus = masterDataMenus
    else if(eTicketPage) menus = eticketMenus

    return (
        <>
        {menus.map((val: any, idx: any) => {
            const subMenu = val.subMenu    
            const isRedirect = val.isRedirect
            return (
                <AccordionMenu
                    icon={val.logo}
                    link={val.link}
                    key={idx}
                    isRedirect={isRedirect}
                    className={'text-white mx-auto my-4'}
                    idx={idx}
                    trigger={val.name}
                    subMenu={subMenu}
                />
            )
        })}
        </>
    )
}