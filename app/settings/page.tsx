import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import SettingsClient from '@/components/Settings';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { IconSettings2 } from '@tabler/icons-react';

export const metadata = {
  title: 'PIMS - Settings',
  description: 'PIMS - Settings',
};

const SettingsPage = async () => {
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
      <MainContainerClient
        title='Settings'
        secondaryTtile='Manage your application settings and configurations'
        icon={<IconSettings2 size={24} stroke={1.5} />}
      >
        <SettingsClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default SettingsPage;
