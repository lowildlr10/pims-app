import { getPermissions, getUser } from '@/actions/user';
import DepartmentSectionClient from '@/components/DepartmentSection';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Departments',
  description: 'Procurement System - Departments',
};

const DepartmentPage = async () => {
  const user: UserType = await getUser();
  const permissions: PermissionType = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'User Management - Departments and Sections'}>
        <DepartmentSectionClient user={user} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default DepartmentPage;
