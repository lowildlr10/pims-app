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
  name?: string;
  defaultData?: { value: string; label: string }[];
  endpoint?: string;
  endpointParams?: any;
  valueColumn?: string;
  column?: string;
  label?: string;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  value?: string;
  defaultValue?: string;
  limit?: number;
  variant?: 'unstyled' | 'filled' | 'default';
  readOnly?: boolean;
  required?: boolean;
  enableOnClickRefresh?: boolean;
  disableFetch?: boolean;
  hasPresetValue?: boolean;
  isLoading?: boolean;
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
  mainModule?: ModuleType;
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
  autoCollapseFirstSubItems?: boolean;

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
  mainModule?: ModuleType;
  permissions: string[];
  search?: string;
  showSearch?: boolean;
  showCreate?: boolean;
  setSearch?: (value: string) => void;
  handleOpenCreateModal?: (
    parentId: string | null,
    module_type: ModuleType | null
  ) => void;
};

type SearchModalProps = {
  search: string;
  opened: boolean;
  close: () => void;
  setSearch?: (value: string) => void;
};

type DetailActionProps = {
  permissions?: string[];
  data?: any;
  content?: ModuleType;
  hasStatus?: boolean;
  status?: string;
  stack?: ModalStackReturnType;
  updateTable?: (id: string | null, payload: any) => void;
};

type DetailModalProps = {
  permissions?: string[];
  title: string;
  content?: ModuleType;
  // endpoint: string;
  data: any;
  opened: boolean;
  fullscreen?: boolean;
  stack?: ModalStackReturnType;
  close: () => void;
  updateTable?: (id: string | null, payload: any) => void;
};

type ActionModalProps = {
  title: string;
  message: string;
  color?: string;
  actionType?: ActionType;
  buttonLabel: string;
  endpoint: string;
  opened: boolean;
  close: () => void;
  stack?: ModalStackReturnType;
  updateTable?: (id: string | null, payload: any) => void;
};

type PrintModalProps = {
  title: string;
  endpoint: string;
  opened: boolean;
  stack?: ModalStackReturnType;
  close: () => void;
};

type LogCardProps = {
  fullname?: string;
  message: string;
  logType: 'log' | 'error';
  loggedAt: string;
};

type LogModalProps = {
  id: string;
  title: string;
  endpoint: string;
  opened: boolean;
  stack?: ModalStackReturnType;
  close: () => void;
};

type CreateModalProps = {
  title: string;
  content?: ModuleType;
  endpoint: string;
  data: any;
  opened: boolean;
  fullscreen?: boolean;
  stack?: ModalStackReturnType;
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
  stack?: ModalStackReturnType;
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

type ModalBidsAwardsCommitteeContentProps = {
  data: BidsAwardsCommitteeType;
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

type ModalResposibilityCenterContentProps = {
  data: ResposibilityCenterType;
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
  module_type: ModuleType;
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
  moduleType: ModuleType;
  indeterminate: boolean;
};

type RoleCheckedType = {
  moduleType: ModuleType;
  checked: boolean;
};

type PurchaseRequestItemsFieldType = {
  item_key: number;
  quantity?: number;
  unit_issue_id?: string;
  unit_issue?: string;
  description?: string;
  stock_no?: number;
  estimated_unit_cost?: number;
  estimated_cost?: number;
};

type PurchaseRequestItemHeader = {
  id: string;
  label: string;
  width?: number | string;
  required?: boolean;
};

type PurchaseRequestItemTableProps = {
  items?: PurchaseRequestItemType[];
  value?: string;
  defaultValue?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};
