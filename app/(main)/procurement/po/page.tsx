import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import PurchaseOrdersClient from '@/components/PurchaseOrders';

export const metadata = {
  title: 'Procurement System - Purchase and Job Order',
  description: 'Procurement System - Purchase and Job Order',
};

const PurchaseOrderPage = async () => {
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
        title={'Procurement - Purchase and Job Order'}
        permissions={permissions}
      >
        <PurchaseOrdersClient user={user} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default PurchaseOrderPage;
