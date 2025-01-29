type SingleImageUploadProps = {
  postUrl: string;
  params?: any;
  image: string;
  height?: string | number;
  type?: 'avatar' | 'logo' | 'signature' | 'default';
};

type LayoutSidebarProps = {
  company: CompanyType;
  user: UserType;
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

type DynamicMultiselectProps = {
  endpoint: string;
  endpointParams?: any;
  column?: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  value?: string[];
  limit?: number;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (value: string[]) => void;
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
  enableCreateSubItem?: boolean;
  enableUpdateSubItem?: boolean;
  itemsClickable?: boolean;
  showSearch?: boolean;
  showCreate?: boolean;
  showDetailsFirst?: boolean;

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

type ModalDivisionContentProps = {
  data: DivisionType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalSectionContentProps = {
  data: SectionType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalRoleContentProps = {
  data: RoleType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalUserContentProps = {
  data: UserType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalFundingSourceContentProps = {
  data: FundingSourceType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalItemClassificationContentProps = {
  data: ItemClassificationType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalMfoPapContentProps = {
  data: MfoPapType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalPaperSizeContentProps = {
  data: PaperSizeType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalProcurementModeContentProps = {
  data: ProcurementModeType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalSignatoryContentProps = {
  data: SignatoryType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalSupplierContentProps = {
  data: SupplierType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalUacsCodeClassificationContentProps = {
  data: UacsCodeClassificationType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalUacsCodeContentProps = {
  data: UacsCodeType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalUnitIssueContentProps = {
  data: UnitIssueType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type CollapseType = {
  [id: string]: boolean;
};

type ScopeFieldType = {
  label: string;
  value: string;
  checked: boolean;
};

type PermissionsFieldType = {
  label: string;
  description?: string;
  module: ModuleType;
  checked: boolean;
  indeterminate: boolean;
  scopes: ScopeFieldType[];
};

type SignatorySubDetailsFieldType = {
  checked: boolean;
  label: string;
  signatory_type: SignatoryDetailTypeType;
  position: string;
};

type SignatoryDetailsFieldType = {
  document: SignatoryDocumentType;
  label: string;
  details: SignatorySubDetailsFieldType[];
};

type RoleIndeterminateType = {
  module: ModuleType;
  indeterminate: boolean;
};

type RoleCheckedType = {
  module: ModuleType;
  checked: boolean;
};
