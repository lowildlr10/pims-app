export type LayoutSidebarProps = {
  user: any;
  type?: 'main' | 'settings';
  permissions?: string[];
  children: React.ReactNode;
};

type Link = {
  label: string;
  link: string;
  module?: string;
};

export type LinksGroupProps = {
  module?: string;
  label: string;
  icon: React.FC<any>;
  initiallyOpened?: boolean;
  link?: string;
  links?: Link[];
};

export type UserButtonProps = {
  user: any;
  handleOpen?: () => void;
};

export type ModalProps = {
  type: 'primary' | 'secondary' | 'warning' | 'danger' | 'info';
  title: string;
  open: boolean;
  handleClose: () => void;
};