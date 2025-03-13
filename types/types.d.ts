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
  | 'cancel'
  | 'issue_canvassing'
  | 'canvass_complete'
  | 'approve_rfq'
  | 'pending_abstract'
  | 'approve_abstract'
  | 'award_aoq';

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
  head?: UserType;
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
  head?: UserType;
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
  | 'twg_chairperson'
  | 'twg_member'
  | 'chairman'
  | 'vice_chairman'
  | 'member'
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
  user_id?: string;
  active?: boolean;
  details?: SignatoryDetailType[];
  user?: UserType;
  fullname_plain?: string;
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
  awarded_to_id?: string;
};

type PurchaseRequestStatus =
  | 'draft'
  | 'pending'
  | 'approved_cash_available'
  | 'approved'
  | 'disapproved'
  | 'cancelled'
  | 'for_canvassing'
  | 'for_recanvassing'
  | 'for_abstract'
  | 'partially_awarded'
  | 'awarded'
  | 'completed';

type RequestQuotationStatus =
  | 'draft'
  | 'canvassing'
  | 'completed'
  | 'cancelled';

type AbstractQuotationStatus = 'draft' | 'pending' | 'approved' | 'awarded';

type PurchaseOrderStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'issued'
  | 'received'
  | 'for_inspection'
  | 'for_obligation'
  | 'for_disbursement'
  | 'for_payment'
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
  signatory_cash_available?: SignatoryType;
  sig_approved_by_id?: string;
  signatory_approval?: SignatoryType;
  status?: PurchaseRequestStatus;
  items?: PurchaseRequestItemType[];
  rfqs?: RequestQuotationType[];
  aoqs?: AbstractQuotationType[];
  pos?: PurchaseOrderType[];
  total_estimated_cost?: number;
  total_estimated_cost_formatted?: string;
  section_name?: string;
  funding_source_title?: string;
  funding_source_location?: string;
  requestor_fullname?: string;
  cash_available_fullname?: string;
  approval_fullname?: string;
  submitted_at?: string;
  approved_cash_available_at?: string;
  approved_at?: string;
  disapproved_at?: string;
  cancelled_at?: string;
  created_at?: string;
  updated_at?: string;
};

type RequestQuotationItemType = {
  id?: string;
  request_quotation_id?: string;
  request_quotation?: RequestQuotationType;
  pr_item_id?: string;
  pr_item?: PurchaseRequestItemType;
  supplier_id?: string;
  supplier?: SupplierType;
  brand_model?: string;
  unit_cost?: number;
  total_cost?: number;
  included?: boolean;
};

type RequestQuotationCanvasserType = {
  id?: string;
  request_quotation_id?: string;
  request_quotation?: RequestQuotationType;
  user_id?: string;
  user?: UserType;
};

type RequestQuotationType = {
  id?: string;
  purchase_request_id?: string;
  purchase_request?: PurchaseRequestType;
  signed_type?: 'bac' | 'lce';
  rfq_date?: string;
  rfq_no?: string;
  supplier_id?: string;
  supplier?: SupplierType;
  supplier_name?: string;
  supplier_address?: string;
  canvasser_names?: string[];
  opening_dt?: string;
  sig_approval_id?: string;
  signatory_approval?: SignatoryType;
  approval_fullname?: string;
  vat_registered?: boolean;
  canvassers?: RequestQuotationCanvasserType[];
  items?: RequestQuotationItemType[];
  status?: RequestQuotationStatus;
  pr_no?: string;
  funding_source?: FundingSourceType;
  funding_source_title?: string;
  funding_source_location?: string;
  purpose?: string;
  canvassing_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  created_at?: string;
  updated_at?: string;
};

type AbstractQuotationDetailType = {
  id?: string;
  abstract_quotation_id?: string;
  abstract_quotation?: AbstractQuotationType;
  aoq_item_id?: string;
  aoq_item?: AbstractQuotationItemType;
  supplier_id?: string;
  supplier?: SupplierType;
  brand_model?: string;
  unit_cost?: number;
  total_cost?: number;
};

type AbstractQuotationItemType = {
  id?: string;
  abstract_quotation_id?: string;
  abstract_quotation?: AbstractQuotationType;
  pr_item_id?: string;
  pr_item?: PurchaseRequestItemType;
  awardee_id?: string;
  awardee?: SupplierType;
  included?: boolean;
  details?: AbstractQuotationDetailType[];
};

type AbstractQuotationType = {
  id?: string;
  purchase_request_id?: string;
  purchase_request?: PurchaseRequestType;
  bids_awards_committee_id?: string;
  bids_awards_committee_name?: string;
  bids_awards_committee?: BidsAwardsCommitteeType;
  mode_procurement_id?: string;
  procurement_mode_name?: string;
  mode_procurement?: ProcurementModeType;
  solicitation_no?: string;
  solicitation_date?: string;
  opened_on?: string;
  abstract_no?: string;
  bac_action?: string;
  sig_twg_chairperson_id?: string;
  twg_chairperson_fullname?: string;
  signatory_twg_chairperson?: SignatoryType;
  sig_twg_member_1_id?: string;
  twg_member_1_fullname?: string;
  signatory_twg_member_1?: SignatoryType;
  sig_twg_member_2_id?: string;
  twg_member_2_fullname?: string;
  signatory_twg_member_2?: SignatoryType;
  sig_chairman_id?: string;
  chairman_fullname?: string;
  signatory_chairman?: SignatoryType;
  sig_vice_chairman_id?: string;
  vice_chairman_fullname?: string;
  signatory_vice_chairman?: SignatoryType;
  sig_member_1_id?: string;
  member_1_fullname?: string;
  signatory_member_1?: SignatoryType;
  sig_member_2_id?: string;
  member_2_fullname?: string;
  signatory_member_2?: SignatoryType;
  sig_member_3_id?: string;
  member_3_fullname?: string;
  signatory_member_3?: SignatoryType;
  status?: AbstractQuotationStatus;
  pending_at?: string;
  approved_at?: string;
  awarded_at?: string;
  created_at?: string;
  updated_at?: string;
  items?: AbstractQuotationItemType[];
};

type DeliveryTerm = {
  id?: string;
  term_name?: string;
  created_at?: string;
  updated_at?: string;
};

type PaymentTerm = {
  id?: string;
  term_name?: string;
  created_at?: string;
  updated_at?: string;
};

type PurchaseOrderItemType = {
  id?: string;
  purchase_order_id?: string;
  puchase_order?: PurchaseOrderType;
  pr_item_id?: string;
  pr_item?: PurchaseRequestItemType;
  description?: string;
  brand_model?: string;
  unit_cost?: number;
  total_cost?: number;
};

type PurchaseOrderType = {
  id?: string;
  purchase_request_id?: string;
  purchase_request?: PurchaseRequestType;
  po_no?: string;
  po_date?: string;
  mode_procurement_id?: string;
  mode_procurement?: ProcurementModeType;
  supplier_id?: string;
  supplier?: SupplierType;
  place_delivery_id?: string;
  place_delivery?: LocationType;
  delivery_date?: string;
  delivery_term_id?: string;
  delivery_term?: DeliveryTerm;
  payment_term_id?: string;
  payment_term?: PaymentTerm;
  total_amount_words?: string;
  total_amount?: number;
  sig_approval_id?: string;
  sig_approval: SignatoryType;
  document_type?: 'po' | 'jo';
  status?: PurchaseOrderStatus;
  pending_at?: string;
  approved_at?: string;
  issued_at?: string;
  received_at?: string;
  created_at?: string;
  updated_at?: string;
  items?: PurchaseOrderItemType[];
};
