import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import UpdateClient from '@/components/Generic/CrudComponents/Update';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'inv-supply';

export const metadata = {
  title: 'PIMS - Update Inventory Property and Supply',
  description: 'PIMS - Update Inventory Property and Supply',
};

const InventoryPropertySupplyUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = `/inventories/supplies/${id}`;
  const hasEditPermission = [
    'supply:*',
    ...getAllowedPermissions(MODULE_TYPE, 'update'),
  ].some((permission) => permissions?.includes(permission));

  if (!user) redirect('/login');

  if (!hasEditPermission) redirect(backUrl);

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'main'}
    >
      <MainContainerClient
        title={'Update Inventory Property and Supply'}
        permissions={permissions}
      >
        <UpdateClient
          endpoint={`/inventories/supplies/${id}`}
          content={MODULE_TYPE}
          backUrl={backUrl}
          closeUrl={`/inventories/supplies/${MODULE_TYPE}`}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default InventoryPropertySupplyUpdatePage;
