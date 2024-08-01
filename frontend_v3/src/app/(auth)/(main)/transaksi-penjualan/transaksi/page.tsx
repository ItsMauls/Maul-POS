'use client'
import { SingleAccordion } from "@/components/Accordion/SingleAccordion";
import { Card } from "@/components/Card";
import { AdditionalTransaksiContent } from "@/components/Content/AdditionalTransaksiContent";
import { DokterCardContent } from "@/components/Content/DokterCardContent";
import { PelangganCardContent } from "@/components/Content/PelangganCardContent";
import { TransaksiCardContent } from "@/components/Content/TransaksiCardContent";
import { Table } from "@/components/Table";
import { createColumns, defaultData } from "@/constants";

  export default function Page() {
    const accordionMenus = [
      {
        trigger: 'Pelanggan',
        content : <PelangganCardContent />
      }, {
        trigger: 'Dokter',
        content: <DokterCardContent />
      }
    ]
    const meta = {
      totalData: 0
    };
  
    return (
      <> 
        <div className="flex space-x-4">
          <div className="flex-1">
            <Table
              meta={meta}
              defaultData={defaultData}
              tableClassName="max-w-[1028px]"
              columns={createColumns}
              enableSorting={false}
            />
          </div>
          <div className="w-[280px] space-y-4">
            <Card className="h-[448px]">
              <TransaksiCardContent />
            </Card>
            {accordionMenus.map((val, index) => (
              <SingleAccordion 
                key={index}
                trigger={val.trigger}
                content={val.content}
              />
            ))}
            <Card className="h-[242px]">
              <AdditionalTransaksiContent />
            </Card>
          </div>
        </div>
      </>
    );
  }