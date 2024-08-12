'use client'

import { useSearchParams as useNextSearchParams, useRouter } from 'next/navigation';

const useSearchParams = () => {
    const searchParams = useNextSearchParams()
    const router = useRouter()

    const getSearchParams = (key : string) => searchParams.get(key)
    const setSearchParams = (key : string, value : string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, value)
        router.push(`?${params.toString()}`)
    }

    return {
        getSearchParams,
        setSearchParams
    }
}

export default useSearchParams