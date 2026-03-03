type UserProfileProps = {
  user: UserType;
};

type UserProfileUpdateSectionType = 'information' | 'signature';

type UserProfileFormProps = {
  user: UserType;
};

type CompanyProfileProps = {
  company: CompanyType;
  permissions: string[];
};

type SignatureFormProps = {
  user: UserType;
};

type DepartmentSectionProps = {
  permissions: string[];
};

type RolesProps = {
  permissions: string[];
};

type UsersProps = {
  permissions: string[];
};

type LibraryProps = {
  permissions: string[];
};

type MainProps = {
  user: UserType;
  permissions: string[];
  search?: string;
  setSearch?: (search: string) => void;
  status?: string;
  setStatus?: (status: string) => void;
  showTableActions?: boolean;
};

type GeneralResponse = [
  url: string,
  search: string,
  page: number,
  perPage: number,
  columnSort: string,
  sortDirection: string,
  paginated: boolean,
  status?: string,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DetailResponse<T = any> = {
  data: T;
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type PaginationMeta = {
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type PaginatedResponse<T> = {
  data: T[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: PaginationMeta;
};

type DepartmentResponse = PaginatedResponse<DepartmentType>;

type RolesResponse = PaginatedResponse<RoleType>;

type UsersResponse = PaginatedResponse<UserType>;

type SystemLogResponse = PaginatedResponse<SystemLogType>;

type BidsAwardsCommitteeResponse = PaginatedResponse<BidsAwardsCommitteeType>;

type FundingSourcesResponse = PaginatedResponse<FundingSourceType>;

type ItemClassificationsResponse = PaginatedResponse<ItemClassificationType>;

type FunctionProgramProjectsResponse =
  PaginatedResponse<FunctionProgramProjectType>;

type ProcurementModesResponse = PaginatedResponse<ProcurementModeType>;

type PaperSizesResponse = PaginatedResponse<PaperSizeType>;

type ResposibilityCenterResponse = PaginatedResponse<ResponsibilityCenterType>;

type SignatoriesResponse = PaginatedResponse<SignatoryType>;

type SuppliersResponse = PaginatedResponse<SupplierType>;

type AccountClassificationsResponse =
  PaginatedResponse<AccountClassificationType>;

type AccountsResponse = PaginatedResponse<AccountType>;

type UnitIssuesResponse = PaginatedResponse<UnitIssueType>;

type TaxWithholdingsResponse = PaginatedResponse<TaxWithholdingType>;
