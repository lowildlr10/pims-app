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
  sx?: EmotionSx;
  readOnly?: boolean;
  required?: boolean;
  enableOnClickRefresh?: boolean;
  disableFetch?: boolean;
  hasPresetValue?: boolean;
  isLoading?: boolean;
  preLoading?: boolean;
  error?: React.ReactNode;
  onChange?: (value: string) => void;
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

  user?: UserType;
  permissions: string[];

  columnSort?: string;
  sortDirection?: string;

  search?: string;
  showSearch?: boolean;
  showCreate?: boolean;
  defaultModalOnClick?: 'update' | 'details';
  showCreateSubItem?: boolean;
  mainItemsClickable?: boolean;
  subItemsClickable?: boolean;
  autoCollapseSubItems?: 'all' | 'first' | 'none';

  createMainItemModalTitle?: string;
  createMainItemEndpoint?: string;
  createSubItemModalTitle?: string;
  createSubItemEndpoint?: string;
  createModalFullscreen?: boolean;
  updateMainItemModalTitle?: string;
  updateMainItemBaseEndpoint?: string;
  updateSubItemModalTitle?: string;
  updateSubItemBaseEndpoint?: string;
  updateModalFullscreen?: boolean;
  detailMainItemModalTitle?: string;
  detailMainItemBaseEndpoint?: string;
  detailSubItemModalTitle?: string;
  detailSubItemBaseEndpoint?: string;
  printMainItemModalTitle?: string;
  printSubItemModalTitle?: string;
  printMainItemBaseEndpoint?: string;
  printSubItemBaseEndpoint?: string;
  printMainItemDefaultPaper?: string;
  printSubItemDefaultPaper?: string;
  printMainItemDefaultOrientation?: 'P' | 'L';
  printSubItemDefaultOrientation?: 'P' | 'L';
  logMainItemModalTitle?: string;
  logMainItemEndpoint?: string;
  logSubItemModalTitle?: string;
  logSuItemEndpoint?: string;
  subButtonLabel?: string;

  data: TableDataType;
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
  updateTable?: (id: string | null) => void;
};

type DetailModalProps = {
  user?: UserType;
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
  body: string | React.ReactNode,
  color: string,
  buttonLabel: string,
  endpoint: string,
  redirect?: string,

  requiresPayload?: boolean,
  formRef?: React.RefObject<ActionFormImperativeHandleType | null>,
  payload?: object,

  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  fullScreen?: boolean
) => void;

type ActionModalProps = {
  title: string;
  body: string | React.ReactNode;
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
  formRef?: React.RefObject<ActionFormImperativeHandleType | null>;
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
  updateTable?: (id: string | null) => void;
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
  updateTable?: (id: string | null) => void;
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
