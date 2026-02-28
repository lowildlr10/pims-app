import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import UnitIssuesClient from '@/components/Libraries/UnitIssues';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { redirect } from 'next/navigation';
import React from 'react';
import { IconRuler } from '@tabler/icons-react';

const MODULE_TYPE: ModuleType = 'lib-unit-issue';

export const metadata = {
  title: 'PIMS - Unit of Issues',
  description: 'PIMS - Unit of Issues',
};

const UnitIssuePage = async () => {
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
        title='Unit of Issues'
        secondaryTtile='Define units of measurement and issue quantities'
        icon={<IconRuler size={24} stroke={1.5} />}
      >
        <UnitIssuesClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default UnitIssuePage;
