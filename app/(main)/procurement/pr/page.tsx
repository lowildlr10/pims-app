import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import {
  PurchaseRequestPageActions,
  PurchaseRequestPageContent,
} from './client';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { IconFileDescription } from '@tabler/icons-react';

const MODULE_TYPE: ModuleType = 'pr';

export const metadata = {
  title: 'PIMS - Purchase Requests',
  description: 'PIMS - Purchase Requests',
};

const PurchaseRequestPage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = '/';
  const hasShowPermission = [
    'supply:*',
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
        title='Purchase Requests'
        secondaryTtile='Manage and track all purchase requests'
        icon={<IconFileDescription size={24} stroke={1.5} />}
        permissions={permissions}
        actions={
          <PurchaseRequestPageActions user={user} permissions={permissions} />
        }
      >
        <PurchaseRequestPageContent user={user} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default PurchaseRequestPage;
