import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import InventorySuppliesClient from '@/components/InventorySupplies';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

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
    ...getAllowedPermissions(MODULE_TYPE, 'show'),
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
        title={'Inventory Property and Supplies'}
        permissions={permissions}
      >
        <InventorySuppliesClient user={user} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default InventoryPropertySupplyPage;
