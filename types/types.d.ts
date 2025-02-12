type ThemeColorType = {
  primary: MantineColorsTuple;
  secondary: MantineColorsTuple;
  tertiary: MantineColorsTuple;
};

type ModuleType =
  | 'account-division'
  | 'account-section'
  | 'account-role'
  | 'account-user'
  | 'company'
  | 'system-log'
  | 'pr'
  | 'pr-item'
  | 'rfq'
  | 'aoq'
  | 'po'
  | 'iar'
  | 'ors'
  | 'dv'
  | 'inventory'
  | 'payment'
  | 'lib-bid-committee'
  | 'lib-fund-source'
  | 'lib-inv-class'
  | 'lib-item-class'
  | 'lib-mfo-pap'
  | 'lib-mode-proc'
  | 'lib-paper-size'
  | 'lib-responsibility-center'
  | 'lib-signatory'
  | 'lib-signatory-detail'
  | 'lib-supplier'
  | 'lib-uacs-class'
  | 'lib-uacs-code'
  | 'lib-unit-issue'
  | 'super'
  | 'head'
  | 'supply'
  | 'budget'
  | 'accounting'
  | 'cashier'
  | 'user';

type ActionType =
  | 'submit_approval'
  | 'approve_cash_available'
  | 'approve'
  | 'disapprove'
  | 'cancel';

type CompanyType = {
  id?: string;
  company_name?: string;
  address?: string;
  municipality?: string;
  province?: string;
  region?: string;
  company_type?: string;
  company_head_id?: string;
  head?: UserType;
  favicon?: string;
  company_logo?: string;
  login_background?: string;
  theme_colors?: ThemeColorType;
};

type RoleType = {
  id?: string;
  role_name?: string;
  active?: boolean;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
};

type UserType = {
  id?: string;
  employee_id?: string;
  fullname?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  sex?: 'male' | 'female';
  division_id?: string;
  section_id?: string;
  position_id?: string;
  designation_id?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
  allow_signature?: boolean;
  signature?: string;
  restricted?: boolean;
  division?: {
    id?: string;
    division_name?: string;
  };
  section?: {
    id?: string;
    section_name?: string;
  };
  position?: {
    id?: string;
    position_name?: string;
  };
  designation?: {
    id?: string;
    designation_name?: string;
  };
  roles: Role[];
  created_at?: string;
  updated_at?: string;
};

type DivisionType = {
  id?: string;
  division_name?: string;
  active?: boolean;
  division_head_id?: string;
  head?: {
    id?: string;
    firstname?: string;
    lastname?: string;
  };
  sections?: SectionType[];
  created_at?: string;
  updated_at?: string;
};

type SectionType = {
  id?: string;
  division_id?: string;
  section_name?: string;
  active?: boolean;
  section_head_id?: string;
  head?: {
    id?: string;
    firstname?: string;
    lastname?: string;
  };
  division?: DivisionType;
  created_at?: string;
  updated_at?: string;
};

type SystemLogType = {
  id?: string;
  user_id?: string;
  log_id?: string;
  log_module?: string;
  log_type?: 'log' | 'error';
  message?: string;
  details?: string;
  data?: object;
  user?: UserType;
  logged_at?: string;
};

type LocationType = {
  id?: string;
  location_name?: string;
};

type BidsAwardsCommitteeType = {
  id?: string;
  committee_name?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type FundingSourceType = {
  id?: string;
  location_id?: string;
  title?: string;
  total_cost?: number;
  active?: boolean;
  location?: LocationType;
  created_at?: string;
  updated_at?: string;
};

type ItemClassificationType = {
  id?: string;
  classification_name?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type MfoPapType = {
  id?: string;
  code?: string;
  description?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type PaperSizeType = {
  id?: string;
  paper_type?: string;
  unit?: 'mm' | 'cm' | 'in';
  width?: number;
  height?: number;
  created_at?: string;
  updated_at?: string;
};

type ProcurementModeType = {
  id?: string;
  mode_name?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type ResposibilityCenterType = {
  id?: string;
  code?: string;
  description?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type SignatoryDetailTypeType =
  | 'cash_availability'
  | 'approved_by'
  | 'approval'
  | 'canvassers'
  | 'authorized_official'
  | 'inspection'
  | 'acceptance'
  | 'approved_by'
  | 'issued_by'
  | 'received_from'
  | 'received_from';

type SignatoryDocumentType =
  | 'pr'
  | 'rfq'
  | 'aoq'
  | 'po'
  | 'iar'
  | 'ors'
  | 'dv'
  | 'ris'
  | 'are'
  | 'ics';

type SignatoryDetailType = {
  id?: string;
  signatory_id?: string;
  document?: SignatoryDocumentType;
  signatory_type?: string;
  position?: string;
  created_at?: string;
  updated_at?: string;
};

type SignatoryType = {
  id?: string;
  fullname?: string;
  user_id?: string;
  active?: boolean;
  details?: SignatoryDetailType[];
  user?: UserType;
  created_at?: string;
  updated_at?: string;
};

type SupplierType = {
  id?: string;
  supplier_name?: string;
  address?: string;
  tin_no?: string;
  phone?: string;
  telephone?: string;
  vat_no?: string;
  contact_person?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type UacsCodeClassificationType = {
  id?: string;
  classification_name?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type UacsCodeType = {
  id?: string;
  classification_id?: string;
  account_title?: string;
  code?: string;
  description?: string;
  classification?: UacsCodeClassificationType;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type UnitIssueType = {
  id?: string;
  unit_name?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type PurchaseRequestItemType = {
  id?: string;
  purchase_request_id?: string;
  item_sequence?: number;
  quantity?: number;
  unit_issue_id?: string;
  unit_issue?: UnitIssueType;
  description?: string;
  stock_no?: number;
  estimated_unit_cost?: number;
  estimated_cost?: number;
  estimated_unit_cost_formatted?: string;
  estimated_cost_formatted?: string;
};

type PurchaseRequestStatus =
  | 'draft'
  | 'pending'
  | 'approved_cash_available'
  | 'approved'
  | 'disapproved'
  | 'cancelled'
  | 'for_canvassing'
  | 'for_abstract'
  | 'for_po'
  | 'completed';

type PurchaseRequestType = {
  id?: string;
  section_id?: string;
  section?: SectionType;
  pr_no?: string;
  pr_date?: string;
  sai_no?: string;
  sai_date?: string;
  alobs_no?: string;
  alobs_date?: string;
  funding_source_id?: string;
  funding_source?: FundingSourceType;
  purpose?: string;
  requested_by_id?: string;
  requestor?: UserType;
  sig_cash_availability_id?: string;
  signatory_cash_availability?: SignatoryType;
  sig_approved_by_id?: string;
  signatory_approved_by?: SignatoryType;
  status?: PurchaseRequestStatus;
  items?: PurchaseRequestItemType[];
  total_estimated_cost?: number;
  total_estimated_cost_formatted?: string;
  section_name?: string;
  funding_source_title?: string;
  requestor_fullname?: string;
  cash_availability_fullname?: string;
  approver_fullname?: string;
  submitted_at?: string;
  approved_cash_available_at?: string;
  approved_at?: string;
  disapproved_at?: string;
  cancelled_at?: string;
  created_at?: string;
  updated_at?: string;
};
