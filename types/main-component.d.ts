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
  handleOpenActionModal?: (
    actionType: ActionType,
    title: string,
    message: string,
    color: string,
    buttonLabel: string,
    endpoint: string,
    redirect?: string
  ) => void;
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
  canvassingAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  handleOpenActionModal?: (
    actionType: ActionType,
    title: string,
    message: string,
    color: string,
    buttonLabel: string,
    endpoint: string
  ) => void;
};

type RequestQuotationActionProps = {
  permissions?: string[];
  id: string;
  status: RequestQuotationStatus;
  handleOpenActionModal?: (
    actionType: ActionType,
    title: string,
    message: string,
    color: string,
    buttonLabel: string,
    endpoint: string
  ) => void;
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
  canvassingAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  handleOpenActionModal?: (
    actionType: ActionType,
    title: string,
    message: string,
    color: string,
    buttonLabel: string,
    endpoint: string
  ) => void;
};

type AbstractQuotationActionProps = {
  permissions?: string[];
  id: string;
  status: AbstractQuotationStatus;
  handleOpenActionModal?: (
    actionType: ActionType,
    title: string,
    message: string,
    color: string,
    buttonLabel: string,
    endpoint: string
  ) => void;
};

type ModalAbstractQuotationContentProps = {
  data: AbstractQuotationType;
  isCreate?: boolean;
  readOnly?: boolean;
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
  canvassingAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  handleOpenActionModal?: (
    actionType: ActionType,
    title: string,
    message: string,
    color: string,
    buttonLabel: string,
    endpoint: string
  ) => void;
};

type PurchaseOrderActionProps = {
  permissions?: string[];
  id: string;
  status: PurchaseOrderStatus;
  handleOpenActionModal?: (
    actionType: ActionType,
    title: string,
    message: string,
    color: string,
    buttonLabel: string,
    endpoint: string
  ) => void;
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
  status: InspectionAcceptanceReportStatus;
  canvassingAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  handleOpenActionModal?: (
    actionType: ActionType,
    title: string,
    message: string,
    color: string,
    buttonLabel: string,
    endpoint: string
  ) => void;
};

type InspectionAcceptanceReportActionProps = {
  permissions?: string[];
  id: string;
  status: InspectionAcceptanceReportStatus;
  handleOpenActionModal?: (
    actionType: ActionType,
    title: string,
    message: string,
    color: string,
    buttonLabel: string,
    endpoint: string
  ) => void;
};

type ModalInspectionAcceptanceReportContentProps = {
  data: InspectionAcceptanceReportType;
  isCreate?: boolean;
  readOnly?: boolean;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};
