import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import CreateClient from '@/components/Generic/CrudComponents/Create';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'inv-issuance';

export const metadata = {
  title: 'PIMS - Create Inventory Issuance',
  description: 'PIMS - Create Inventory Issuance',
};

const InventoryIssuanceCreatePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ type: ModuleType }>;
}) => {
  const type: ModuleType = (await searchParams).type;
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = '/inventories/issuances';
  const hasCreatePermission = [
    'supply:*',
    ...getAllowedPermissions(MODULE_TYPE, 'create'),
  ].some((permission) => permissions?.includes(permission));

  if (!user) redirect('/login');

  if (!hasCreatePermission) redirect(backUrl);

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'main'}
    >
      <MainContainerClient
        title={'Create Inventory Issuance'}
        permissions={permissions}
      >
        <CreateClient
          data={{
            document_type: type,
          }}
          endpoint={'/inventories/issuances'}
          content={MODULE_TYPE}
          backUrl={'/inventories/issuances'}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default InventoryIssuanceCreatePage;
