import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import DepartmentSectionClient from '@/components/UserManagement/DepartmentSection';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'account-department';

export const metadata = {
  title: 'PIMS - Departments',
  description: 'PIMS - Departments',
};

const DepartmentPage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = '/';
  const hasShowPermission = [
    ...getAllowedPermissions(MODULE_TYPE, 'view'),
  ].some((permission) => permissions?.includes(permission));

  if (!user) redirect('/login');

  if (!hasShowPermission) redirect(backUrl);

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'User Management - Departments and Sections'}>
        <DepartmentSectionClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default DepartmentPage;
