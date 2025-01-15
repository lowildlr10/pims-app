import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import PaperSizesClient from '@/components/Libraries/PaperSizes';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Print Paper Sizes',
  description: 'Procurement System - Print Paper Sizes',
};

const PaperSizePage = async () => {
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'Library - Print Paper Sizes'}>
        <PaperSizesClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default PaperSizePage;
