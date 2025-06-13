import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import InspectionAcceptanceReportsClient from '@/components/InspectionAcceptanceReports';

export const metadata = {
  title: 'Procurement System - Inspection and Acceptance Report',
  description: 'Procurement System - Inspection and Acceptance Report',
};

const InspectionAcceptanceReportPage = async () => {
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
        title={'Procurement - Inspection and Acceptance Report'}
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
