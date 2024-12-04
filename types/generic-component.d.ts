type LayoutSidebarProps = {
  user: any;
  type?: 'main' | 'settings';
  permissions?: PermissionType;
  children: React.ReactNode;
};

type Link = {
  label: string;
  link: string;
  allowedPermissions?: string[];
};

type LinksGroupProps = {
  permissions?: any;
  allowedPermissions?: string[];
  label: string;
  icon: React.FC<any>;
  initiallyOpened?: boolean;
  link?: string;
  links?: Link[];
};

type UserButtonProps = {
  user: UserType;
  handleOpen?: () => void;
};

type ModalProps = {
  type: 'primary' | 'secondary' | 'warning' | 'danger' | 'info';
  title: string;
  open: boolean;
  handleClose: () => void;
};

type MainContainerProps = {
  secondaryTtile?: string;
  title: string;
  children: React.ReactNode;
};

type DynamicAutocompleteProps = {
  endpoint: string;
  endpointParams?: any;
  column?: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  value?: string;
  limit?: number;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
};
