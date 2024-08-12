export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
  onClick?: () => void;
};

export interface FilterGudangProps {
  options: Array<{ value: string; label: string }>;
  selected: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ButtonProps {
  label?: string;
  onClick: any;
  className?: string;
  shortcut?: string;
  icon?: JSX.Element;
}


