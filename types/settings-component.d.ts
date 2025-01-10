type UserProfileProps = {
  user: UserType;
};

type UserProfileUpdateSectionType = 'information' | 'signature';

type UserProfileFormProps = {
  user: UserType;
};

type SignatureFormProps = {
  user: UserType;
};

type AvatarFormProps = {
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

type GeneralResponse = [
  url: string,
  search: string,
  page: number,
  perPage: number,
  columnSort: string,
  sortDirection: string,
  paginated: boolean,
];

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
