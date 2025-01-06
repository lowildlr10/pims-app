type LayoutSidebarProps = {
  user: any;
  type?: 'main' | 'settings';
  permissions?: string[];
  children: React.ReactNode;
};

type Link = {
  label: string;
  link: string;
  allowedPermissions?: string[];
};

type LinksGroupProps = {
  permissions?: string[];
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

type UserModalProps = {
  title: string;
  open: boolean;
  handleClose: () => void;
};

type MainContainerProps = {
  secondaryTtile?: string;
  title: string;
  children: React.ReactNode;
};

type DynamicSelectProps = {
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

type TableHeader = {
  id: string;
  label: string;
  width?: string | number;
  sortable?: boolean;
};

type TableDataType = {
  head?: TableHeader[];
  subHead?: TableHeader[];
  body?: any;
};

type DataTableProps = {
  module?: ModuleType;
  subModule?: ModuleType;

  permissions: string[];

  columnSort?: string;
  sortDirection?: string;

  search?: string;
  showSearch?: boolean;
  showCreate?: boolean;

  data: TableDataType;
  perPage: number;
  loading?: boolean;

  perPage: number;
  page: number;
  lastPage: number;
  from: number | string;
  to: number | string;
  total: number | string;

  refreshData?: (param: any) => void;

  onChange?: (
    _search?: string,
    _page: number,
    _perPage: number,
    _columnSort?: string,
    _sortDirection?: string
  ) => void;
};

type DataTablePaginationProps = {
  perPage: number;
  page: number;
  lastPage: number;
  from: number | string;
  to: number | string;
  total: number | string;
  setPage?: (value: number) => void;
  setPerPage?: (value: number) => void;
};

type DataTableActionsProps = {
  module?: ModuleType;
  permissions: string[];
  search?: string;
  showSearch?: boolean;
  showCreate?: boolean;
  setSearch?: (value: string) => void;
  handleOpenCreateModal?: (
    parentId: string | null,
    module: ModuleType | null
  ) => void;
};

type SearchModalProps = {
  search: string;
  opened: boolean;
  close: () => void;
  setSearch?: (value: string) => void;
};

type ModuleType =
  | 'account-department'
  | 'account-section'
  | 'account-role'
  | 'account-user';

type CreateModalProps = {
  title: string;
  content?: ModuleType;
  endpoint: string;
  data: any;
  opened: boolean;
  fullscreen?: boolean;
  content?: ModuleType;
  close: () => void;
  updateTable?: (id: string | null, payload: any) => void;
};

type UpdateModalProps = {
  title: string;
  content?: ModuleType;
  endpoint: string;
  data: any;
  opened: boolean;
  fullscreen?: boolean;
  content?: ModuleType;
  close: () => void;
  updateTable?: (id: string | null, payload: any, isSubBody?: boolean) => void;
};

type ModalDepartmentContentProps = {
  data: DepartmentType;
  type: 'create' | 'update';
  close: () => void;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalSectionContentProps = {
  data: SectionType;
  type: 'create' | 'update';
  close: () => void;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalRoleContentProps = {
  data: RoleType;
  type: 'create' | 'update';
  close: () => void;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type CollapseType = {
  [id: string]: boolean;
};
