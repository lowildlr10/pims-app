import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import CreateClient from '@/components/Generic/CrudComponents/Create';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'obr';

export const metadata = {
  title: 'PIMS - Create Obligation Request (Bills Payment)',
  description: 'PIMS - Create Obligation Request for Bills Payment',
};

const ObrBillsPaymentCreatePage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = `/procurement/${MODULE_TYPE}`;
  const hasCreatePermission = [
    'budget:*',
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
        title={'Create Obligation Request - Bills Payment'}
        permissions={permissions}
      >
        <CreateClient
          endpoint={'/obligation-requests'}
          content={'obr'}
          backUrl={backUrl}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default ObrBillsPaymentCreatePage;
