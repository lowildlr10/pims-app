import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import DetailClient from '@/components/Generic/CrudComponents/Details';

const MODULE_TYPE: ModuleType = 'iar';

export const metadata = {
  title: 'PIMS - Inspection and Acceptance Report Details',
  description: 'PIMS - Inspection and Acceptance Report Details',
};

const InspectionAcceptanceReportDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
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
        title={'Inspection and Acceptance Report Details'}
        permissions={permissions}
      >
        <DetailClient
          permissions={permissions}
          endpoint={`${'/inspection-acceptance-reports'}/${id}`}
          content={MODULE_TYPE}
          printConfig={{
            title: 'Print Inspection and Acceptance Report',
            endpoint: `/documents/${MODULE_TYPE}/prints/${id}`,
          }}
          logConfig={{
            id,
            title: 'Inspection and Acceptance Report Logs',
            endpoint: '/logs',
          }}
          backUrl={`/procurement/${MODULE_TYPE}`}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default InspectionAcceptanceReportDetailsPage;
