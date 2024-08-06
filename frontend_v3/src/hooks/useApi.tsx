import { deleteBase, getBase, patchBase, postBase, putBase } from '@/utils/http';
import {
    useQuery,
    useMutation,
    UseQueryOptions,
    UseMutationOptions,
} from '@tanstack/react-query'

export const useGet = <TData = unknown, TError = unknown>(
    url: string,
    params: Record<string, any> = {},
    options: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'> = {}
) => {
    // Create a stable query key that includes url and all params
    const queryKey = [url, ...Object.entries(params).sort((a, b) => a[0].localeCompare(b[0]))];
    // const page = queryKey[0].split('&')[queryKey[0].split('&').length - 1];
    // console.log(page, 'page');
    
    return useQuery<TData, TError>({
        queryKey,
        queryFn: async () => {
            const response = await getBase(url, params);
            return response.data;
        },
        staleTime: 60000,        
        // placeholderData: (previousData) => previousData,
        ...options
    });
};

export const usePost = <TData = unknown, TError = unknown, TVariables = unknown>(
    url: string,
    options?: UseMutationOptions<TData, TError, TVariables>
) => {
    return useMutation<TData, TError, TVariables>({
        mutationFn: (data) => postBase(url, data),
        ...options
    })
}

export const usePut = <TData = unknown, TError = unknown, TVariables = unknown>(
    url: string,
    options?: UseMutationOptions<TData, TError, TVariables>
) => {
    return useMutation<TData, TError, TVariables>({
        mutationFn: (data) => putBase(url, data),
        ...options
    })
}

export const usePatch = <TData = unknown, TError = unknown, TVariables = unknown>(
    url: string,
    options?: UseMutationOptions<TData, TError, TVariables>
) => {
    return useMutation<TData, TError, TVariables>({
        mutationFn: (data) => patchBase(url, data),
        ...options
    })
}

export const useDelete = <TData = unknown, TError = unknown>(
    url: string,
    options?: UseMutationOptions<TData, TError, void>
) => {
    return useMutation<TData, TError, void>({
        mutationFn: () => deleteBase(url),
        ...options
    })
}