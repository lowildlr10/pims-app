import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import { PoPageActions, PoPageContent } from './client';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { IconShoppingCart } from '@tabler/icons-react';

const MODULE_TYPE: ModuleType = 'po';

export const metadata = {
  title: 'PIMS - Purchase Orders',
  description: 'PIMS - Purchase Orders',
};

const PurchaseOrderPage = async () => {
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
        title='Purchase Orders'
        secondaryTtile='Manage and track all purchase orders'
        icon={<IconShoppingCart size={24} stroke={1.5} />}
        permissions={permissions}
        actions={<PoPageActions user={user} permissions={permissions} />}
      >
        <PoPageContent user={user} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default PurchaseOrderPage;
