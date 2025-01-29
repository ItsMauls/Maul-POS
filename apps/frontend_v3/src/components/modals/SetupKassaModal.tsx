import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { RadioGroup } from '@headlessui/react'

interface SetupKassaModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SetupKassaModal({ isOpen, onClose }: SetupKassaModalProps) {
  const [selectedPosType, setSelectedPosType] = useState('01 - Swalayan')
  const [selectedKassaStatus, setSelectedKassaStatus] = useState('Aktif')
  const [selectedAntrianStatus, setSelectedAntrianStatus] = useState('Aktif')

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Setup Kassa
                </Dialog.Title>

                <div className="space-y-6">
                  {/* Tipe POS */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tipe POS</label>
                    <RadioGroup value={selectedPosType} onChange={setSelectedPosType} className="mt-2">
                      <RadioGroup.Option value="01 - Swalayan">
                        {({ checked }) => (
                          <div className={`${checked ? 'bg-blue-50 border-blue-500' : 'border-gray-200'} border rounded-md p-3 cursor-pointer`}>
                            01 - Swalayan
                          </div>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value="02 - Resep">
                        {({ checked }) => (
                          <div className={`${checked ? 'bg-blue-50 border-blue-500' : 'border-gray-200'} border rounded-md p-3 cursor-pointer mt-2`}>
                            02 - Resep
                          </div>
                        )}
                      </RadioGroup.Option>
                    </RadioGroup>
                  </div>

                  {/* Status Kassa */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status Kassa</label>
                    <RadioGroup value={selectedKassaStatus} onChange={setSelectedKassaStatus} className="mt-2">
                      <div className="flex gap-4">
                        <RadioGroup.Option value="Aktif">
                          {({ checked }) => (
                            <div className={`${checked ? 'bg-blue-50 border-blue-500' : 'border-gray-200'} border rounded-md p-3 cursor-pointer`}>
                              Aktif
                            </div>
                          )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="Non Aktif">
                          {({ checked }) => (
                            <div className={`${checked ? 'bg-blue-50 border-blue-500' : 'border-gray-200'} border rounded-md p-3 cursor-pointer`}>
                              Non Aktif
                            </div>
                          )}
                        </RadioGroup.Option>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Status Antrian */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status Antrian</label>
                    <RadioGroup value={selectedAntrianStatus} onChange={setSelectedAntrianStatus} className="mt-2">
                      <div className="flex gap-4">
                        <RadioGroup.Option value="Aktif">
                          {({ checked }) => (
                            <div className={`${checked ? 'bg-blue-50 border-blue-500' : 'border-gray-200'} border rounded-md p-3 cursor-pointer`}>
                              Aktif
                            </div>
                          )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="Non Aktif">
                          {({ checked }) => (
                            <div className={`${checked ? 'bg-blue-50 border-blue-500' : 'border-gray-200'} border rounded-md p-3 cursor-pointer`}>
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
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={() => {
                      // Handle simpan logic here
                      onClose()
                    }}
                  >
                    Simpan
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 