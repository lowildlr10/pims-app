import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import DetailClient from '@/components/Generic/CrudComponents/Details';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'inv-supply';

export const metadata = {
  title: 'PIMS - Inventory Property and Supply Details',
  description: 'PIMS - Inventory Property and Supply Details',
};

const InventoryPropertySupplyDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = `/inventories/supplies?search=${id}`;
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
        title={'Inventory Property and Supply Details'}
        permissions={permissions}
      >
        <DetailClient
          permissions={permissions}
          endpoint={`${'/inventories/supplies'}/${id}`}
          content={MODULE_TYPE}
          printConfig={{
            title: 'Print Inventory Property and Supply',
            endpoint: `/documents/${MODULE_TYPE}/prints/${id}`,
          }}
          logConfig={{
            id,
            title: 'Inventory Property and Supply Logs',
            endpoint: '/logs',
          }}
          backUrl={backUrl}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default InventoryPropertySupplyDetailsPage;
