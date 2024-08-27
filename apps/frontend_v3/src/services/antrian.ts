
import { API_URL } from '@/constants/api';
import { useGet, usePost, usePut } from '@/hooks/useApi';

export const useAntrian = () => {
  const tambahAntrianMutation = usePost<any, Error, { idPelanggan: number; kdCab: string }>(
    API_URL.ANTRIAN.createAntrian
  );

  const selesaikanAntrianMutation = usePut<any, Error, number>(
    `${API_URL.ANTRIAN.finishAntrian}:id`
  );

  const getAntrianHariIniQuery = (kdCab: string) =>
    useGet(`${API_URL.ANTRIAN.getAntrianToday}/${kdCab}`);

  const tambahAntrian = async (idPelanggan: number, kdCab: string) => {
    try {
      const result = await tambahAntrianMutation.mutateAsync({ idPelanggan, kdCab });
      return result;
    } catch (error) {
      console.error('Gagal menambah antrian:', error);
      throw error;
    }
  };

  const selesaikanAntrian = async (idAntrian: number) => {
    try {
      const result = await selesaikanAntrianMutation.mutateAsync(idAntrian);
      return result;
    } catch (error) {
      console.error('Gagal menyelesaikan antrian:', error);
      throw error;
    }
  };

  return {
    tambahAntrian,
    selesaikanAntrian,
    getAntrianHariIniQuery,
    isLoading: tambahAntrianMutation.isPending || selesaikanAntrianMutation.isPending,
    error: tambahAntrianMutation.error || selesaikanAntrianMutation.error,
  };
};