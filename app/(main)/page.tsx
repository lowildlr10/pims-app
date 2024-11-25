import { getPermissions, getUser } from '@/actions/user';
import DashboardClient from '@/components/Dashboard';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Dashboard',
  description: 'Procurement System - Dashboard',
};

const DashboardPage = async () => {
  const user = await getUser();
  const permissions = await getPermissions();

  if (!!user === false) redirect('/login');

  return (
    <LayoutSidebarClient>
      <DashboardClient />
    </LayoutSidebarClient>
  )
}

export default DashboardPage;