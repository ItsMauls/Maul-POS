import React, { useState } from "react";
import FilterGudang from "../FilterGudang";
import SearchBar from "../SearchBar";
import Button from "../Button";
import { on } from "events";
import AddFaktur from "../modal_add/AddPFaktur";

interface ToolbarProps {
  selectedGudang?: string;
  searchQuery?: string;
  onGudangChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTambahClick?: () => void;
  onGantiTujuanClick?: () => void;
  onPilihTanggalClick?: () => void;
  onResetSPGantungClick?: () => void;
  onApproveClick?: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
  const [selectedGudang, setSelectedGudang] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const gudangOptions = [
    { value: "01", label: "Gudang 1" },
    { value: "02", label: "Gudang 2" },
  ];

  const handleGudangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGudang(event.target.value);
    props.onGudangChange && props.onGudangChange(event);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    props.onSearchChange && props.onSearchChange(event);
  };

  const handleTambahClick = () => {
    console.log("Tambah clicked");
  };

  const handlePilihTanggalClick = () => {
    console.log("Pilih Tanggal clicked");
  };

  const handleResetSPGantungClick = () => {
    console.log("Reset SP Gantung clicked");
  };

  return (
    <div className="flex items-center gap-4 mb-4 justify-between">
      <div className="flex gap-2">
        <FilterGudang
          options={gudangOptions}
          selected={selectedGudang}
          onChange={handleGudangChange}
        />
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
      </div>
      <div className="flex gap-2">
        <AddFaktur title="Tambah Faktur Pembelian" onSuccess={
          () => {
            props.onSuccess && props.onSuccess();
          }
        }
          onError={onError => {
            props.onError && props.onError(onError);
          }
          }
        />
        <Button
          label="Pelunasan"
          onClick={() => {
            props.onApproveClick && props.onApproveClick();
          }}
          className="bg-[#09A599]"
          shortcut="F2"
        />
      </div>
    </div>
  );
};

export default Toolbar;
