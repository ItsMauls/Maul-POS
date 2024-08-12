export type ButtonTypes = {
    children : any,
    onClick? : () => void,
    hasIcon?: boolean,
    icon?: any,
    isLoading?: boolean,
    iconPosition?: 'left' | 'right',
    className?: string,
    disabled?: boolean,
}


export interface PaginationButtonTypes {    
    totalItems? : number
    itemsPerPage? : number
    currentPage : number
}