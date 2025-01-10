import { getPermissions, getUser } from '@/actions/user';
import DashboardClient from '@/components/Dashboard';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Dashboard',
  description: 'Procurement System - Dashboard',
};

const DashboardPage = async () => {
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient user={user} permissions={permissions} type={'main'}>
      <MainContainerClient
        secondaryTtile={'Welcome Back,'}
        title={user.fullname ?? ''}
      >
        <DashboardClient user={user} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default DashboardPage;
