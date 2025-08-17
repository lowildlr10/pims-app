import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import InspectionAcceptanceReportsClient from '@/components/InspectionAcceptanceReports';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'iar';

export const metadata = {
  title: 'PIMS - Inspection and Acceptance Reports',
  description: 'PIMS - Inspection and Acceptance Reports',
};

const InspectionAcceptanceReportPage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = '/';
  const hasShowPermission = [
    'supply:*',
    ...getAllowedPermissions(MODULE_TYPE, 'show'),
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
        title={'Inspection and Acceptance Reports'}
        permissions={permissions}
      >
        <InspectionAcceptanceReportsClient
          user={user}
          permissions={permissions}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default InspectionAcceptanceReportPage;
