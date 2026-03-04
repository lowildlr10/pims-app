import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import SignatoriesClient from '@/components/Libraries/Signatories';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { redirect } from 'next/navigation';
import React from 'react';
import { IconSignature } from '@tabler/icons-react';

const MODULE_TYPE: ModuleType = 'lib-signatory';

export const metadata = {
  title: 'PIMS - Signatories',
  description: 'PIMS - Signatories',
};

const SignatoryPage = async () => {
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
        title='Signatories'
        secondaryTtile='Manage authorized signatories and approval authorities'
        icon={<IconSignature size={24} stroke={1.5} />}
      >
        <SignatoriesClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default SignatoryPage;
