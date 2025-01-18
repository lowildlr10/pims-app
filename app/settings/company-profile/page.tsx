import { getPermissions, getUser } from '@/actions/user';
import CompanyProfileClient from '@/components/CompanyProfile';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import UserProfileClient from '@/components/UserProfile';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Company Profile',
  description: 'Procurement System - Company Profile',
};

const CompanyProfilePage = async () => {
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'Company Profile'}>
        <CompanyProfileClient />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default CompanyProfilePage;
