import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import RolesClient from '@/components/UserManagement/Roles';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Roles',
  description: 'Procurement System - Roles',
};

const RolePage = async () => {
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
      <MainContainerClient title={'User Management - Roles'}>
        <RolesClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default RolePage;
