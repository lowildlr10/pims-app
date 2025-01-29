import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import SystemLogsClient from '@/components/SystemLog';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - System Logs',
  description: 'Procurement System - System Logs',
};

const SystemLogPage = async () => {
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const company: CompanyType = await getCompany();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'System Logs'}>
        <SystemLogsClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default SystemLogPage;
