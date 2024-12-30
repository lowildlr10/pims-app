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
  user: UserType;
  permissions: PermissionType;
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

type CollapseType = {
  [id: string]: boolean
}