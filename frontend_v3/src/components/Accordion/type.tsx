import { ReactNode } from 'react';

export type SearchBarProps = {
  placeholder?: string;
  className?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  inputClassName?: string;
  id?: string;
}
export type AccordionMenuProps = {
    idx : number
    trigger : string
    subMenu? : SubMenu[] | null | undefined | any
    icon : string | any
    className : string
    link : string
    isRedirect : boolean
}

export type AccordionItemProps = {
    children : ReactNode
    className : string
    props : any
  }
  
export type CustomAccordionTriggerProps = {
    children : ReactNode
    className? : string
    subMenu? : SubMenu[] | null | undefined
}

export type CustomAccordionContentProps = {
    children : ReactNode
    setFocusedIndex? : number | any
    className? : string
    isHovered? : boolean
}

export type SubMenu = {
    name: string;
    link: string;
  }

