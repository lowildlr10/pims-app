import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import RolesClient from '@/components/Roles';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Unit of Issues',
  description: 'Procurement System - Unit of Issues',
};

const UnitIssuePage = async () => {
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'Library - Unit of Issues'}>
        {/* <RolesClient permissions={permissions} /> */}
        <></>
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default UnitIssuePage;
