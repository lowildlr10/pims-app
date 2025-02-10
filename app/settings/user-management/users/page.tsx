import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import UserssClient from '@/components/UserManagement/Users';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Users',
  description: 'Procurement System - Users',
};

const UsersPage = async () => {
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
      <MainContainerClient title={'User Management - Users'}>
        <UserssClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default UsersPage;
