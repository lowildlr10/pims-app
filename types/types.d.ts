type PermissionType = {
  permissions: string[];
};

type RoleType = {
  id?: string;
  role_name?: string;
  created_at?: string;
  updated_at?: string;
};

type UserType = {
  id?: string;
  fullname?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  sex?: 'male' | 'female';
  department_id?: string;
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
  department?: {
    id?: string;
    department_name?: string;
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

type DepartmentType = {
  id?: string;
  department_name?: string;
  active?: boolean;
  department_head_id?: string;
  head?: {
    id?: string;
    firstname?: string;
    lastname?: string;
  }
  sections?: SectionType[];
  created_at?: string;
  updated_at?: string;
}

type SectionType = {
  id?: string;
  section_name?: string;
  active?: boolean;
  section_head_id?: string;
  head?: {
    id?: string;
    firstname?: string;
    lastname?: string;
  }
  created_at?: string;
  updated_at?: string;
}