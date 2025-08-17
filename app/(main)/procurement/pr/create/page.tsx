import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import CreateClient from '@/components/Generic/CrudComponents/Create';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'pr';

export const metadata = {
  title: 'PIMS - Create Purchase Request',
  description: 'PIMS - Create Purchase Request',
};

const PurchaseRequestCreatePage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = `/procurement/${MODULE_TYPE}`;
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
        title={'Create Purchase Request'}
        permissions={permissions}
      >
        <CreateClient
          endpoint={'/purchase-requests'}
          content={MODULE_TYPE}
          backUrl={backUrl}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default PurchaseRequestCreatePage;
