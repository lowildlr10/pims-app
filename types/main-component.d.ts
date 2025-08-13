type LoginProps = {
  company: CompanyType;
};

type DashboardProps = {
  user: UserType;
};

type PurchaseRequestsResponse = {
  data: PurchaseRequestType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type PurchaseRequestStatusProps = {
  size?: string;
  status?: PurchaseRequestStatus;
};

type PurchaseRequestActionProps = {
  permissions?: string[];
  id: string;
  status: PurchaseRequestStatus;
  handleOpenActionModal?: OpenActionModalActionType;
};

type ModalPurchaseRequestContentProps = {
  data: PurchaseRequestType;
  readOnly?: boolean;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};

type RequestQuotationsResponse = {
  data: PurchaseRequestType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type RequestQuotationStatusProps = {
  size?: string;
  status?: RequestQuotationStatus;
};

type RequestQuotationActionProps = {
  permissions?: string[];
  id: string;
  status: RequestQuotationStatus;
  handleOpenActionModal?: OpenActionModalActionType;
};

type ModalRequestQuotationContentProps = {
  data: RequestQuotationType;
  isCreate?: boolean;
  readOnly?: boolean;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};

type AbstractQuotationsResponse = {
  data: PurchaseRequestType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type AbstractQuotationStatusProps = {
  size?: string;
  status?: AbstractQuotationStatus;
};

type AbstractQuotationActionProps = {
  permissions?: string[];
  id: string;
  status: AbstractQuotationStatus;
  handleOpenActionModal?: OpenActionModalActionType;
};

type ModalAbstractQuotationContentProps = {
  data: AbstractQuotationType;
  isCreate?: boolean;
  readOnly?: boolean;
  refreshData?: () => void;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};

type AbstractQuotationSupplierHeaderType = {
  supplier_id: string;
  supplier_name: string;
  unit_cost: number;
  total_cost: number;
};

type PurchaseOrdersResponse = {
  data: PurchaseRequestType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type PurchaseOrderStatusProps = {
  size?: string;
  status?: PurchaseOrderStatus;
};

type PurchaseOrderActionProps = {
  permissions?: string[];
  id: string;
  status: PurchaseOrderStatus;
  handleOpenActionModal?: OpenActionModalActionType;
};

type ModalPurchaseOrderContentProps = {
  data: PurchaseOrderType;
  isCreate?: boolean;
  readOnly?: boolean;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};

type InspectionAcceptanceReportResponse = {
  data: InspectionAcceptanceReportType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type InspectionAcceptanceReportStatusProps = {
  size?: string;
  status?: InspectionAcceptanceReportStatus;
};

type InspectionAcceptanceReportActionProps = {
  permissions?: string[];
  id: string;
  poId: string;
  status: InspectionAcceptanceReportStatus;
  documentType: 'po' | 'jo';
  handleOpenActionModal?: OpenActionModalActionType;
};

type ModalInspectionAcceptanceReportContentProps = {
  data: InspectionAcceptanceReportType;
  isCreate?: boolean;
  readOnly?: boolean;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};

type ObligationRequestResponse = {
  data: ObligationRequestType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type ObligationRequestStatusProps = {
  size?: string;
  status?: ObligationRequestStatus;
};

type ObligationRequestActionProps = {
  permissions?: string[];
  id: string;
  status: ObligationRequestStatus;
  handleOpenActionModal?: OpenActionModalActionType;
};

type ModalObligationRequestContentProps = {
  data: ObligationRequestType;
  isCreate?: boolean;
  readOnly?: boolean;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};

type DisbursementVoucherResponse = {
  data: DisbursementVoucherType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type DisbursementVoucherStatusProps = {
  size?: string;
  status?: DisbursementVoucherStatus;
};

type DisbursementVoucherActionProps = {
  permissions?: string[];
  id: string;
  status: DisbursementVoucherStatus;
  handleOpenActionModal?: OpenActionModalActionType;
};

type ModalDisbursementVoucherContentProps = {
  data: DisbursementVoucherType;
  isCreate?: boolean;
  readOnly?: boolean;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};

type InventorySuppliesResponse = {
  data: PurchaseOrderType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type InventorySuppliesStatusProps = {
  size?: string;
  status?: InventorySupplyStatus;
};

type InventorySupplyActionProps = {
  permissions?: string[];
  id: string;
  status: InventorySupplyStatus;
  handleOpenActionModal?: OpenActionModalActionType;
};

type ModalInventorySupplyContentProps = {
  data: InventorySupplyType;
  isCreate?: boolean;
  readOnly?: boolean;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};

type InventoryIssuanceResponse = {
  data: PurchaseOrderType[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
};

type InventoryIssuanceStatusProps = {
  size?: string;
  status?: InventoryIssuanceStatus;
};

type InventoryIssuanceActionProps = {
  permissions?: string[];
  id: string;
  status: InventoryIssuanceStatus;
  handleOpenActionModal?: OpenActionModalActionType;
};

type ModalInventoryIssuanceContentProps = {
  data: InventoryIssuanceType;
  isCreate?: boolean;
  readOnly?: boolean;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};
