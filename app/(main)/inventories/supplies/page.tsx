import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import { SuppliesPageActions, SuppliesPageContent } from './client';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { IconBox } from '@tabler/icons-react';

const MODULE_TYPE: ModuleType = 'inv-supply';

export const metadata = {
  title: 'PIMS - Inventory Property and Supplies',
  description: 'PIMS - Inventory Property and Supplies',
};

const InventoryPropertySupplyPage = async () => {
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
        title='Inventory Supplies'
        secondaryTtile='Manage and track inventory property and supplies'
        icon={<IconBox size={24} stroke={1.5} />}
        permissions={permissions}
        actions={<SuppliesPageActions user={user} permissions={permissions} />}
      >
        <SuppliesPageContent user={user} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default InventoryPropertySupplyPage;
