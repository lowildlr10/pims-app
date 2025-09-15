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

type DetailResponse = {
  data: any;
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type DepartmentResponse = {
  data: DepartmentType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type RolesResponse = {
  data: RoleType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type UsersResponse = {
  data: UserType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type SystemLogResponse = {
  data: SystemLogType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type BidsAwardsCommitteeResponse = {
  data: BidsAwardsCommitteeType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type FundingSourcesResponse = {
  data: FundingSourceType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type ItemClassificationsResponse = {
  data: ItemClassificationType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type FunctionProgramProjectsResponse = {
  data: FunctionProgramProjectType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type ProcurementModesResponse = {
  data: ProcurementModeType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type PaperSizesResponse = {
  data: PaperSizeType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type ResposibilityCenterResponse = {
  data: ResponsibilityCenterType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type SignatoriesResponse = {
  data: SignatoryType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type SuppliersResponse = {
  data: SupplierType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type AccountClassificationsResponse = {
  data: AccountClassificationType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type AccountsResponse = {
  data: AccountType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type UnitIssuesResponse = {
  data: UnitIssueType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};
