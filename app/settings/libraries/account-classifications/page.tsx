import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import AccountClassificationsClient from '@/components/Libraries/AccountClassifications';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { redirect } from 'next/navigation';
import React from 'react';
import { IconLibrary } from '@tabler/icons-react';

const MODULE_TYPE: ModuleType = 'lib-account-class';

export const metadata = {
  title: 'PIMS - Account Classifications',
  description: 'PIMS - Account Classifications',
};

const AccountClassificationsPage = async () => {
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
      <MainContainerClient
        title='Account Classifications'
        secondaryTtile='Manage chart of accounts and financial classifications'
        icon={<IconLibrary size={24} stroke={1.5} />}
      >
        <AccountClassificationsClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default AccountClassificationsPage;
