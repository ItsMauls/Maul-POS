'use client'
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useSetupKassaStore } from "@/store/setupKassa";
import { toast } from "react-hot-toast";
import { useGet, usePost, usePut } from "@/hooks/useApi";
import { API_URL } from "@/constants/api";

interface KassaData {
  no_kassa: string;
  type_jual: 'swalayan' | 'resep';
  status_antrian: string;
  fingerprint: 'Y' | 'N';
  default_printer?: string;
  kd_cab: string;
  status_operasional: boolean;
  cabang?: {
    nm_cab: string;
    // ... other branch fields if needed
  }
}

export default function SetupKassaModal() {
  const router = useRouter();
  const {
    tipePOS,
    statusKassa,
    statusAntrian,
    setTipePOS,
    setStatusKassa,
    setStatusAntrian
  } = useSetupKassaStore();

  // Fetch existing kassa data based on MAC address
  const { data: kassaData, isLoading: isLoadingKassa, refetch } = useGet<{ success: boolean; data: KassaData }>(API_URL.USER.currentKassa, {
    onError: (error: any) => {
      // Only show error if it's not a 404 (no kassa found)
      if (error.response?.status !== 404) {
        toast.error('Gagal memuat data kassa');
      }
    }
  });

  // Set initial values if kassa exists
  useEffect(() => {
    if (kassaData?.data) {
      setTipePOS(kassaData.data.type_jual === 'swalayan' ? '01 - Swalayan' : '02 - Resep');
      setStatusKassa(kassaData.data.status_operasional ? 'Aktif' : 'Non Aktif');
      setStatusAntrian(kassaData.data.status_antrian);
    }
  }, [kassaData]);

  const createKassaMutation = usePost(API_URL.USER.createKassa, {
    onSuccess: () => {
      toast.success('Kassa berhasil didaftarkan');
      refetch();
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat mendaftarkan kassa');
    }
  });

  const updateKassaMutation = usePut(`${API_URL.USER.updateKassa}/${kassaData?.data?.no_kassa}`, {
    onSuccess: () => {
      toast.success('Kassa berhasil diperbarui');
      refetch();
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat memperbarui kassa');
    }
  });

  const handleClose = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("modal");
    router.replace(`?${params.toString()}`);
  };

  const handleSave = async () => {
    const kassaPayload = {
      no_kassa: kassaData?.data?.no_kassa || "KS001",
      type_jual: tipePOS === "01 - Swalayan" ? "swalayan" : "resep",
      status_antrian: statusAntrian,
      fingerprint: "Y",
      default_printer: "EPSON TM-T82",
      kd_cab: kassaData?.data?.kd_cab || "RWT",
      status_operasional: statusKassa === "Aktif"
    };

    if (kassaData?.data) {
      updateKassaMutation.mutate(kassaPayload);
    } else {
      createKassaMutation.mutate(kassaPayload);
    }
  };

  const isLoading = createKassaMutation.isPending || updateKassaMutation.isPending || isLoadingKassa;

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {kassaData?.data ? 'Edit Kassa' : 'Setup Kassa'}
                </Dialog.Title>

                <div className="space-y-6">
                  {/* Tipe POS */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Tipe POS
                    </label>
                    <RadioGroup
                      value={tipePOS}
                      onChange={setTipePOS}
                      className="mt-2"
                    >
                      <RadioGroup.Option value="01 - Swalayan">
                        {({ checked }) => (
                          <div
                            className={`${
                              checked ? "bg-blue-50 border-blue-500" : "border-gray-200"
                            } border rounded-md p-3 cursor-pointer`}
                          >
                            01 - Swalayan
                          </div>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value="02 - Resep">
                        {({ checked }) => (
                          <div
                            className={`${
                              checked ? "bg-blue-50 border-blue-500" : "border-gray-200"
                            } border rounded-md p-3 cursor-pointer mt-2`}
                          >
                            02 - Resep
                          </div>
                        )}
                      </RadioGroup.Option>
                    </RadioGroup>
                  </div>

                  {/* Status Kassa */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Status Kassa
                    </label>
                    <RadioGroup
                      value={statusKassa}
                      onChange={setStatusKassa}
                      className="mt-2"
                    >
                      <div className="flex gap-4">
                        <RadioGroup.Option value="Aktif">
                          {({ checked }) => (
                            <div
                              className={`${
                                checked ? "bg-blue-50 border-blue-500" : "border-gray-200"
                              } border rounded-md p-3 cursor-pointer`}
                            >
                              Aktif
                            </div>
                          )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="Non Aktif">
                          {({ checked }) => (
                            <div
                              className={`${
                                checked ? "bg-blue-50 border-blue-500" : "border-gray-200"
                              } border rounded-md p-3 cursor-pointer`}
                            >
                              Non Aktif
                            </div>
                          )}
                        </RadioGroup.Option>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Status Antrian */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Status Antrian
                    </label>
                    <RadioGroup
                      value={statusAntrian}
                      onChange={setStatusAntrian}
                      className="mt-2"
                    >
                      <div className="flex gap-4">
                        <RadioGroup.Option value="Aktif">
                          {({ checked }) => (
                            <div
                              className={`${
                                checked ? "bg-blue-50 border-blue-500" : "border-gray-200"
                              } border rounded-md p-3 cursor-pointer`}
                            >
                              Aktif
                            </div>
                          )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="Non Aktif">
                          {({ checked }) => (
                            <div
                              className={`${
                                checked ? "bg-blue-50 border-blue-500" : "border-gray-200"
                              } border rounded-md p-3 cursor-pointer`}
                            >
                              Non Aktif
                            </div>
                          )}
                        </RadioGroup.Option>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Menyimpan...' : (kassaData?.data ? 'Perbarui' : 'Simpan')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}