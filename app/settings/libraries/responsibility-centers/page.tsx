import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import ResposibilityCentersClient from '@/components/Libraries/ResposibilityCenters';

export const metadata = {
  title: 'Procurement System - Responsibility Centers',
  description: 'Procurement System - Responsibility Centers',
};

const BidsAwardsCommitteePage = async () => {
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
      <MainContainerClient title={'Library - Responsibility Centers'}>
        <ResposibilityCentersClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default BidsAwardsCommitteePage;
