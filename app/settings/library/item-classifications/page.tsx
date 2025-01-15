import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import ItemClassificationsClient from '@/components/Libraries/ItemClassifications';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Item Classifications',
  description: 'Procurement System - Item Classifications',
};

const ItemClassificationPage = async () => {
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'Library - Item Classifications'}>
        <ItemClassificationsClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default ItemClassificationPage;
