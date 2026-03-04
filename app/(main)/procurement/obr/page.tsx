import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import { ObrPageActions, ObrPageContent } from './client';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { IconFileStack } from '@tabler/icons-react';

const MODULE_TYPE: ModuleType = 'obr';

export const metadata = {
  title: 'PIMS - Obligation Requests',
  description: 'PIMS - Obligation Requests',
};

const ObligationRequestPage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = '/';
  const hasShowPermission = [
    'budget:*',
    ...getAllowedPermissions(MODULE_TYPE, 'view'),
  ].some((permission) => permissions?.includes(permission));

  if (!user) redirect('/login');

  if (!hasShowPermission) redirect(backUrl);

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'main'}
    >
      <MainContainerClient
        title={'Obligation Requests'}
        secondaryTtile={'Manage and track all obligation requests'}
        icon={<IconFileStack size={24} stroke={1.5} />}
        permissions={permissions}
        actions={<ObrPageActions user={user} permissions={permissions} />}
      >
        <ObrPageContent user={user} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default ObligationRequestPage;
