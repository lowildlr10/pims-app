import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import UpdateClient from '@/components/Generic/CrudComponents/Update';

const MODULE_TYPE: ModuleType = 'po';

export const metadata = {
  title: 'PIMS - Update Inspection and Acceptance Report',
  description: 'PIMS - Update Inspection and Acceptance Report',
};

const InspectionAcceptanceReportUpdatePage = async ({
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
        title={'Update Inspection and Acceptance Report'}
        permissions={permissions}
      >
        <UpdateClient
          endpoint={`/inspection-acceptance-reports/${id}`}
          content={MODULE_TYPE}
          backUrl={`/procurement/${MODULE_TYPE}/${id}`}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default InspectionAcceptanceReportUpdatePage;
