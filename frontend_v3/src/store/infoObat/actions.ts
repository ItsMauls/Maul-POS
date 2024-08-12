import { API_URL } from '@/constants/api';
import { useInfoObatStore } from './store';
import { InfoObat } from './types';
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';


export const useInfoObatActions = () => {
  const setInfoObats = (infoObats: InfoObat[]) => useInfoObatStore.setState({ infoObats });
  const setLoading = (isLoading: boolean) => useInfoObatStore.setState({ isLoading });
  const setError = (error: string | null) => useInfoObatStore.setState({ error });

  const fetchInfoObats = useGet<InfoObat[]>(API_URL.SALES["info-obat"], {}, {
    onSuccess: (data: InfoObat[]) => {
      setInfoObats(data);
      setLoading(false);
    },
    onError: (error: unknown) => {
      setError(error instanceof Error ? error.message : String(error));
      setLoading(false);
    }
  });

  const createInfoObat = usePost<InfoObat, Error, InfoObat>(API_URL.SALES["info-obat"], {
    onMutate: () => setLoading(true),
    onSuccess: (newInfoObat) => {
      useInfoObatStore.setState((state) => ({
        infoObats: [...state.infoObats, newInfoObat],
        isLoading: false,
      }));
    },
    onError: (error: unknown) => {
      setError(error instanceof Error ? error.message : String(error));
      setLoading(false);
    }  });

  const updateInfoObat = usePut<InfoObat, Error, InfoObat>(API_URL.SALES["info-obat"], {
    onMutate: () => setLoading(true),
    onSuccess: (updatedInfoObat) => {
      useInfoObatStore.setState((state) => ({
        infoObats: state.infoObats.map((io) =>
          io.kd_brgdg === updatedInfoObat.kd_brgdg ? updatedInfoObat : io
        ),
        isLoading: false,
      }));
    },
    onError: (error: unknown) => {
      setError(error instanceof Error ? error.message : String(error));
      setLoading(false);
    }
  });

  const deleteInfoObat = useDelete<string>(API_URL.SALES["info-obat"], {
    onMutate: () => setLoading(true),
    onSuccess: (_, kd_brgdg: any) => {
      useInfoObatStore.setState((state) => ({
        infoObats: state.infoObats.filter((io) => io.kd_brgdg !== kd_brgdg),
        isLoading: false,
      }));
    },
    onError: (error: unknown) => {
      setError(error instanceof Error ? error.message : String(error));
      setLoading(false);
    }
  });

  return {
    fetchInfoObats,
    createInfoObat,
    updateInfoObat,
    deleteInfoObat,
  };
};