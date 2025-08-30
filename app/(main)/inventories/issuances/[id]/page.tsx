import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import DetailClient from '@/components/Generic/CrudComponents/Details';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'inv-issuance';

export const metadata = {
  title: 'PIMS - Inventory Issuance Details',
  description: 'PIMS - Inventory Issuance Details',
};

const InventoryIssuanceDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = `/inventories/issuances?search=${id}`;
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
        title={'Inventory Issuance Details'}
        permissions={permissions}
      >
        <DetailClient
          permissions={permissions}
          endpoint={`/inventories/issuances/${id}`}
          content={MODULE_TYPE}
          printConfig={{
            title: 'Print Inventory Issuance',
            endpoint: '',
          }}
          logConfig={{
            id,
            title: 'Inventory Issuance Logs',
            endpoint: '/logs',
          }}
          backUrl={backUrl}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default InventoryIssuanceDetailsPage;
