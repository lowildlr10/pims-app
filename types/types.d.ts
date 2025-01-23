type ThemeColorType = {
  primary: MantineColorsTuple;
  secondary: MantineColorsTuple;
  tertiary: MantineColorsTuple;
};

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

type LocationType = {
  id?: string;
  location_name?: string;
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

type SignatoryDetailTypeType =
  | 'pr_cash_availability'
  | 'pr_approved_by'
  | 'rfq_approval'
  | 'rfq_canvassers'
  | 'po_authorized_official'
  | 'iar_inspection'
  | 'iar_acceptance'
  | 'ris_approved_by'
  | 'ris_issued_by'
  | 'ics_received_from'
  | 'are_received_from';

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
