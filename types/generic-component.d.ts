type LayoutSidebarProps = {
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

type LinksGroupProps = {
  module?: string;
  label: string;
  icon: React.FC<any>;
  initiallyOpened?: boolean;
  link?: string;
  links?: Link[];
};

type UserButtonProps = {
  user: any;
  handleOpen?: () => void;
};

type ModalProps = {
  type: 'primary' | 'secondary' | 'warning' | 'danger' | 'info';
  title: string;
  open: boolean;
  handleClose: () => void;
};