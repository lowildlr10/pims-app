import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import TaxWithholdingsClient from '@/components/Libraries/TaxWithholdings';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { redirect } from 'next/navigation';
import React from 'react';
import { IconReceipt } from '@tabler/icons-react';

const MODULE_TYPE: ModuleType = 'lib-tax-withholding';

export const metadata = {
  title: 'PIMS - Tax Withholdings',
  description: 'PIMS - Tax Withholdings',
};

const TaxWithholdingsPage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = '/';
  const hasShowPermission = [
    ...getAllowedPermissions(MODULE_TYPE, 'view'),
  ].some((permission) => permissions?.includes(permission));

  if (!user) redirect('/login');

  if (!hasShowPermission) redirect(backUrl);

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient
        title='Tax Withholdings'
        secondaryTtile='Manage tax withholding types and their computation rates'
        icon={<IconReceipt size={24} stroke={1.5} />}
      >
        <TaxWithholdingsClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default TaxWithholdingsPage;
