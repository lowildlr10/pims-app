import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import SuppliersClient from '@/components/Libraries/Suppliers';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Suppliers',
  description: 'Procurement System - Suppliers',
};

const SupplierPage = async () => {
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'Library - Suppliers'}>
        <SuppliersClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default SupplierPage;
