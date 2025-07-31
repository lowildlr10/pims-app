import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import UacsCodesClient from '@/components/Libraries/UacsCodes';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'PIMS - UACS Object Code',
  description: 'PIMS - UACS Object Code',
};

const UacsObjectCodePage = async () => {
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
      <MainContainerClient title={'Library - UACS Object Code'}>
        <UacsCodesClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default UacsObjectCodePage;
