import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import ProcurementModesClient from '@/components/Libraries/ProcurementModes';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Modes of Procurement',
  description: 'Procurement System - Modes of Procurement',
};

const ModesProcurementPage = async () => {
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'Library - Modes of Procurement'}>
        <ProcurementModesClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default ModesProcurementPage;
