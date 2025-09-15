import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import ResposibilityCentersClient from '@/components/Libraries/ResposibilityCenters';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'lib-responsibility-center';

export const metadata = {
  title: 'PIMS - Responsibility Centers',
  description: 'PIMS - Responsibility Centers',
};

const BidsAwardsCommitteePage = async () => {
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
      <MainContainerClient title={'Library - Responsibility Centers'}>
        <ResposibilityCentersClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default BidsAwardsCommitteePage;
