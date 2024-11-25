type RoleType = {
  id?: string;
  role_name?: string;
}

type UserType = {
  id?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  sex?: 'male' | 'female';
  department_id?: string;
  section_id?: string;
  position_id?:string;
  designation_id?:string;
  username?:string;
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
  designation?: {
    id?: string;
    designation_name?: string;
  };
  roles: Role[]
}