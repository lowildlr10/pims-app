import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import MfoPapsClient from '@/components/Libraries/MfoPaps';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'PIMS - MFO/PAP',
  description: 'PIMS - MFO/PAP',
};

const MfoPapPage = async () => {
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
      <MainContainerClient title={'Library - MFO/PAP'}>
        <MfoPapsClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default MfoPapPage;
