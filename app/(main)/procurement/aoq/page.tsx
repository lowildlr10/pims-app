import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import AbstractQuotationsClient from '@/components/AbstractQuotations';

export const metadata = {
  title: 'Procurement System - Abstract of Quotations',
  description: 'Procurement System - Abstract of Quotations',
};

const AbstractQuotationPage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'main'}
    >
      <MainContainerClient title={'Procurement - Abstract of Quotations'}>
        <AbstractQuotationsClient user={user} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default AbstractQuotationPage;
