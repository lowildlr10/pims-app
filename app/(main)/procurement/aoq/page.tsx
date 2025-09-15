import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import AbstractQuotationsClient from '@/components/AbstractQuotations';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'aoq';

export const metadata = {
  title: 'PIMS - Abstract of Bids and Quotations',
  description: 'PIMS - Abstract of Bids and Quotations',
};

const AbstractQuotationPage = async () => {
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
        title={'Abstract of Bids and Quotations'}
        permissions={permissions}
      >
        <AbstractQuotationsClient user={user} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default AbstractQuotationPage;
