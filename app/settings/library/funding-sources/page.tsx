import { getPermissions, getUser } from '@/actions/user';
import FundingSourcesClient from '@/components/Libraries/FundingSources';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Funding Sources/Projects',
  description: 'Procurement System - Funding Sources/Projects',
};

const FundingSourcePage = async () => {
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'Library - Funding Sources/Projects'}>
        <FundingSourcesClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default FundingSourcePage;
