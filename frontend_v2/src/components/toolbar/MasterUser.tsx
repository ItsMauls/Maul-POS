import React, { useState } from "react";
import FilterGudang from "../FilterGudang";
import SearchBar from "../SearchBar";
import Button from "../Button";
import AddPurchaseOrder from "../modal_add/AddPurchaseOrder";
import AddUser from "../modal_add/AddUser";

interface UserProps {
  selectedGudang?: string;
  searchQuery?: string;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTambahClick?: () => void;
  onSuccess?: () => void;
}

const UserToolbar: React.FC<UserProps> = (props : UserProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    props.onSearchChange && props.onSearchChange(event);
  };

  const handleResetSPGantungClick = () => {
    console.log("Reset SP Gantung clicked");
  };

  return (
    <div className="flex items-center gap-4 mb-4 justify-between">
      <div className="flex gap-2">        
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
      </div>
      <div className="flex gap-2">
        <AddUser title="Tambah" onSuccess={
          () => {
            props.onSuccess && props.onSuccess();
          }
        }/>
      </div>
    </div>
  );
};

export default UserToolbar;
