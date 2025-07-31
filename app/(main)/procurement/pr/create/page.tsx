import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import CreateClient from '@/components/Generic/CrudComponents/Create';

const MODULE_TYPE: ModuleType = 'pr';

export const metadata = {
  title: 'PIMS - Create Purchase Request',
  description: 'PIMS - Create Purchase Request',
};

const PurchaseRequestCreatePage = async () => {
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
        title={'Create Purchase Request'}
        permissions={permissions}
      >
        <CreateClient
          endpoint={'/purchase-requests'}
          content={MODULE_TYPE}
          backUrl={'/procurement/pr'}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default PurchaseRequestCreatePage;
