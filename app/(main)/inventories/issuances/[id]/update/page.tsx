import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import UpdateClient from '@/components/Generic/CrudComponents/Update';

const MODULE_TYPE: ModuleType = 'inv-issuance';

export const metadata = {
  title: 'PIMS - Update Inventory Issuance',
  description: 'PIMS - Update Inventory Issuance',
};

const InventoryIssuanceUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'main'}
    >
      <MainContainerClient
        title={'Update Inventory Issuance'}
        permissions={permissions}
      >
        <UpdateClient
          endpoint={`/inventories/issuances/${id}`}
          content={MODULE_TYPE}
          backUrl={`/inventories/issuances/${id}`}
          closeUrl={`/inventories/issuances/${MODULE_TYPE}`}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default InventoryIssuanceUpdatePage;
