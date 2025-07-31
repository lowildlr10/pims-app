import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import CompanyProfileClient from '@/components/CompanyProfile';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'PIMS - Company Profile',
  description: 'PIMS - Company Profile',
};

const CompanyProfilePage = async () => {
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
      <MainContainerClient title={'Company Profile'}>
        <CompanyProfileClient company={company} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default CompanyProfilePage;
