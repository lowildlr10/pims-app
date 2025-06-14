import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import SuppliesClient from '@/components/Supplies';

export const metadata = {
  title: 'Inventory System - Supply',
  description: 'Inventory System - Supply',
};

const SupplyPage = async () => {
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
      <MainContainerClient
        title={'Inventory System - Supply'}
        permissions={permissions}
      >
        <SuppliesClient user={user} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default SupplyPage;
