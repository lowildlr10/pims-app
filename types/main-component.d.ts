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
  submittedAt?: string;
  approvedCashAvailableAt?: string;
  approvedAt?: string;
  disapprovedAt?: string;
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

type ModalPurchaseRequestContentProps = {
  data: PurchaseRequestType;
  readOnly?: boolean;
  handleCreateUpdate?: (uncontrolledPayload?: object) => void;
};
