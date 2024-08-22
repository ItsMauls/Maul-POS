import { Menu } from "@/components/MenuItems";
import { Navbar } from "@/components/ui/Navbar";

export default async function Main() {
    return (
        <main className="bg-blue-500">
            <Navbar />
            <div className="bg-blue-500 w-full h-screen">
                <div className="text-white font-medium text-6xl mt-44 text-center tracking-normal">
                    <h1>Permudah Transaksi</h1>
                    <h1 className="py-3">dengan Sistem POS</h1>
                    <h1>Terintegrasi</h1>
                    <p className="text-lg my-4 font-light">Proses transaksi cepat, Tepat dan akurat</p>
                </div>
            <Menu />
            </div>
            
        </main>

    )
}