import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import DepartmentSectionClient from '@/components/UserManagement/DepartmentSection';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Departments',
  description: 'Procurement System - Departments',
};

const DepartmentPage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

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
