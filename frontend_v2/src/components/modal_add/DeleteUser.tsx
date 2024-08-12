"use client";
import { api } from "@/constants/api";
import { User } from "@/constants/types";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { Icon } from "@iconify/react";
import Modal from "../Modal";
import Image from "next/image";
import imageRemove from "@/assets/images/dialog-remove.svg";

interface DeleteUserProps {
  user: User;
  onDelete: () => void;
}

const DeleteUser = ({ user, onDelete }: DeleteUserProps) => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (userId: number) => {
    const token = Cookies.get("access_token");

    if (!token) {
      alert("Access token is missing. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${api.user.deleteUser}?id=${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDelete();
        setModal(false);
      } else {
        const data = await response.json();
        setError(data?.message || "Failed to delete user.");
        setModal(false);
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setError("An unexpected error occurred.");
      setModal(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div>
      <button
        key={user.id}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        onClick={toggleModal}
      >
        <div className="flex items-center gap-2">
          <Icon icon="fontisto:trash" width="24" height="24" />
        </div>
      </button>

      {modal && (
        <Modal isOpen={modal} onClose={toggleModal} title="">
          <div className="">
            <div className="flex justify-center">
              <Image src={imageRemove} alt="Remove Item" />
            </div>
            <p className="text-lg font-bold text-center mt-4">Yakin Hapus?</p>
            <p className="justify-center text-center mt-4">
              Dengan menghapus item yang dipilih,
              <br />
              semua informasi terkait akan hilang
            </p>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            <div className="flex gap-4 mt-4 justify-end">
              <button
                className="w-full bg-[#09A599] hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg"
                onClick={toggleModal}
              >
                <div className="flex justify-center items-center gap-2">
                  <span>Batal</span>
                </div>
              </button>
              <button
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={() => handleDelete(user.id)}
                disabled={loading}
              >
                <div className="flex justify-center items-center gap-2">
                  {loading ? <span>Loading...</span> : <span>Ya, Hapus</span>}
                </div>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DeleteUser;
