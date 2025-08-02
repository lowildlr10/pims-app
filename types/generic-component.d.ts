type MediaType =
  | 'avatar'
  | 'signature'
  | 'logo'
  | 'favicon'
  | 'login-background';

type SingleImageUploadProps = {
  postUrl: string;
  params?: any;
  image: string;
  height?: string | number;
  type?: MediaType;
  clearImageCache?: () => void;
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
  permissions?: string[];
};

type DirectoryPathProps = {
  permissions?: string[];
};

type DynamicSelectComboboxDataType = {
  value: string;
  label: string;
  disabled?: boolean;
}[];

type DynamicSelectProps = {
  name?: string;
  defaultData?: ComboboxData;
  endpoint?: string;
  endpointParams?: Record<string, any>;
  valueColumn?: string;
  column?: string;
  label?: string;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  value?: string | null;
  defaultValue?: string | null;
  limit?: number;
  variant?: 'unstyled' | 'filled' | 'default';
  sx?: any;
  readOnly?: boolean;
  required?: boolean;
  enableOnClickRefresh?: boolean;
  disableFetch?: boolean;
  hasPresetValue?: boolean;
  isLoading?: boolean;
  preLoading?: boolean;
  error?: React.ReactNode;
  onChange?: (value: string | null) => void;
};

type DynamicMultiselectProps = {
  endpoint: string;
  endpointParams?: any;
  column?: string;
  label?: string;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'unstyled' | 'filled' | 'default';
  value?: string[];
  sx?: EmotionSx;
  limit?: number;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (value: string[]) => void;
};

type DynamicAutocompleteProps = {
  name?: string;
  endpoint: string;
  endpointParams?: any;
  column?: string;
  label?: string;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'unstyled' | 'filled' | 'default';
  value?: string;
  limit?: number;
  readOnly?: boolean;
  required?: boolean;
  sx?: EmotionSx;
  onChange?: (value: string) => void;
};

type TableHeader = {
  id: string;
  label: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  clickable?: boolean;
};

type TableDataType = {
  head?: TableHeader[];
  subHead?: TableHeader[];
  body?: any;
};

type FormDataType = CompanyType &
  BidsAwardsCommitteeType &
  FundingSourceType &
  ItemClassificationType &
  FunctionProgramProjectType &
  PaperSizeType &
  ProcurementModeType &
  ResponsibilityCenterType &
  SignatoryType &
  SupplierType &
  AccountType &
  RoleType &
  DepartmentType &
  SectionType &
  UserType &
  SystemLogType &
  PurchaseRequestType &
  RequestQuotationType &
  AbstractQuotationType &
  PurchaseOrderType &
  InspectionAcceptanceReportType &
  InventorySupplyType &
  InventoryIssuanceType & {
    parent_id?: string | null;
    parent_body?: FormDataType;
    other_params?: { [key: string]: any } | null;
  };

type ActiveDataType = {
  display: 'details' | 'create' | 'update';
  moduleType: ModuleType;
  data: FormDataType;
};

type DataTableItemType = {
  title?: string;
  endpoint?: string;
  base_url?: string;
};

type CreateUpdateDetailItemTableType = {
  main?: DataTableItemType;
  sub?: DataTableItemType;
  fullscreen?: boolean;
};

type CreateUpdateDetailDataType = {
  endpoint: string;
  pathname: string;
};

type PrintItemTableType = {
  main?: DataTableItemType & {
    default_paper?: 'A4';
    default_orientation?: 'P' | 'L';
  };
  sub?: DataTableItemType & {
    default_paper?: 'A4';
    default_orientation?: 'P' | 'L';
  };
};

type PrintConfigType = {
  title: string;
  default_paper?: string;
  default_orientation?: 'P' | 'L';
  endpoint: string;
  fullscreen?: boolean;
};

type LogItemTableType = {
  main?: DataTableItemType;
  sub?: DataTableItemType;
};

type LogConfigType = {
  id: string;
  title: string;
  endpoint: string;
  fullscreen?: boolean;
};

type ItemCreateMenuTableType = {
  label: string;
  value: SignatoryDocumentType;
  moduleType: ModuleType;
};

type DataTableProps = {
  mainModule?: ModuleType;
  subModule?: ModuleType;

  permissions: string[];

  columnSort?: string;
  sortDirection?: string;

  search?: string;
  showSearch?: boolean;
  showCreate?: boolean;
  showEdit?: boolean;
  createMenus?: ItemCreateMenuTableType[];
  defaultModalOnClick?: 'update' | 'details';
  showCreateSubItem?: boolean;
  mainItemsClickable?: boolean;
  subItemsClickable?: boolean;
  autoCollapseSubItems?: 'all' | 'first' | 'none';

  createItemData?: CreateUpdateDetailItemTableType;
  updateItemData?: CreateUpdateDetailItemTableType;
  detailItemData?: CreateUpdateDetailItemTableType;

  subButtonLabel?: string;

  data: TableDataType;
  activeFormData?: FormDataType;
  setActiveData?: React.Dispatch<
    React.SetStateAction<ActiveDataType | undefined>
  >;
  perPage: number;
  loading?: boolean;

  perPage: number;
  page: number;
  lastPage: number;
  from: number | string;
  to: number | string;
  total: number | string;

  refreshData?: () => void;

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
  createMenus?: ItemCreateMenuTableType[];
  defaultModalOnClick?: 'update' | 'details';
  setPageLoading?: (loading: boolean) => void;
  setSearch?: (value: string) => void;
  handleOpenCreateModal?: (
    parentId: string | null,
    module_type: ModuleType | null,
    additionalParams?: { [key: string]: any } | null
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
  data?: FormDataType;
  content?: ModuleType;
  display?: 'bar' | 'button';
  showButtonLabel?: boolean;
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
  buttonIconSize?: string | number;
  hasStatus?: boolean;
  status?: string;
  stack?: ModalStackReturnType;
  openLogModal?: () => void;
  updateTable?: (id: string | null) => void;
};

type DetailProps = {
  permissions?: string[];
  content: ModuleType;
  endpoint: string;
  printConfig?: PrintConfigType;
  logConfig?: LogConfigType;
  backUrl?: string;
};

type DetailModalProps = {
  permissions?: string[];
  title: string;
  content?: ModuleType;
  data: any;
  opened: boolean;
  fullscreen?: boolean;
  showPrint?: boolean;
  showEdit?: boolean;
  stack?: ModalStackReturnType;
  close: () => void;
  updateTable?: (id: string | null) => void;
};

type OpenActionModalActionType = (
  actionType: ActionType,
  title: string,
  children: React.ReactNode,
  color: string,
  buttonLabel: string,
  endpoint: string,
  redirect?: string,

  requiresPayload?: boolean,

  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  fullScreen?: boolean
) => void;

type ActionModalProps = {
  title: string;
  children: React.ReactNode;
  color?: string;
  actionType?: ActionType;
  buttonLabel: string;
  endpoint: string;
  redirect?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  opened: boolean;
  close: () => void;
  stack?: ModalStackReturnType;
  updateTable?: (id: string | null) => void;
  requiresPayload?: boolean;
};

type PrintModalProps = {
  title: string;
  endpoint: string;
  opened: boolean;
  defaultPaper?: string;
  defaultOrientation?: 'P' | 'L';
  stack?: ModalStackReturnType;
  close: () => void;
};

type LogCardProps = {
  fullname?: string;
  message: string;
  details?: string;
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

type CreateProps = {
  data?: any;
  content: ModuleType;
  endpoint: string;
  backUrl?: string;
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
  updateTable?: (id: string | null) => void;
};

type UpdateProps = {
  content: ModuleType;
  endpoint: string;
  backUrl?: string;
};

type UpdateModalProps = {
  title: string;
  content?: ModuleType;
  endpoint: string;
  data: any;
  opened: boolean;
  showEdit?: boolean;
  fullscreen?: boolean;
  stack?: ModalStackReturnType;
  close: () => void;
  updateTable?: (id: string | null) => void;
};

type ModalDepartmentContentProps = {
  data: DepartmentType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalSectionContentProps = {
  data: SectionType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
  isCreate?: boolean | undefined;
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

type ModalFunctionProgramProjectContentProps = {
  data: FunctionProgramProjectType;
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
  data: ResponsibilityCenterType;
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

type ModalAccountClassificationContentProps = {
  data: AccountClassificationType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};

type ModalAccountContentProps = {
  data: AccountType;
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
  key: string;
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
  align?: 'left' | 'center' | 'right';
};

type PurchaseRequestItemTableProps = {
  items?: PurchaseRequestItemType[];
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

type RequestQuotationItemsFieldType = {
  key: string;
  stock_no?: number;
  quantity?: number;
  unit_issue?: string;
  description?: string;
  brand_model?: string;
  unit_cost?: number;
  total_cost?: number;
  included?: boolean;
};

type AbstractQuotationItemsFieldType = {
  key: string;
  stock_no?: number;
  quantity?: number;
  unit_issue?: string;
  description?: string;
  details?: {
    key: string;
    supplier_id?: string;
    supplier_name?: string;
    brand_model: string;
    unit_cost: number;
    total_cost: number;
  }[];
  awardee_id?: string;
  awardee_name?: string;
  document_type?: 'po' | 'jo' | '';
  included?: boolean;
};

type PurchaseOrderItemsFieldType = {
  key: string;
  stock_no?: number;
  unit_issue?: string;
  description?: string;
  quantity?: number;
  unit_cost?: number;
  total_cost?: number;
};

type InventorySupplyRecipientsFieldType = {
  key: string;
  recipient_name?: string;
  issuance_no?: string;
  item_no?: string;
  acquired_date?: string;
  issued_date?: string;
  quantity?: number;
  status?: string;
};

type InventoryIssuanceItemsFieldType = {
  key: string;
  stock_no?: number;
  unit_issue?: string;
  description?: string;
  quantity?: number;
  inventory_item_no?: string;
  property_no?: string;
  estimated_useful_life?: string;
  acquired_date?: string;
  available?: number;
  unit_cost?: number;
  total_cost?: number;
};
