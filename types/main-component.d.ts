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
    endpoint: string
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
