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
  status?: PurchaseRequestStatus;
};

type ModalPurchaseRequestContentProps = {
  data: PurchaseRequestType;
  handleCreateUpdate?: () => void;
  setPayload: React.Dispatch<React.SetStateAction<object | undefined>>;
};
