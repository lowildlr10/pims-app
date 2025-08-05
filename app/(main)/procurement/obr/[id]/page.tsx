import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import DetailClient from '@/components/Generic/CrudComponents/Details';

const MODULE_TYPE: ModuleType = 'obr';

export const metadata = {
  title: 'PIMS - Obligation Request Details',
  description: 'PIMS - Obligation Request Details',
};

const ObligationRequestDetailsPage = async ({
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
        title={'Obligation Request Details'}
        permissions={permissions}
      >
        <DetailClient
          permissions={permissions}
          endpoint={`${'/obligation-requests'}/${id}`}
          content={MODULE_TYPE}
          printConfig={{
            title: 'Print Obligation Request',
            endpoint: `/documents/${MODULE_TYPE}/prints/${id}`,
          }}
          logConfig={{
            id,
            title: 'Obligation Request Logs',
            endpoint: '/logs',
          }}
          backUrl={`/procurement/${MODULE_TYPE}`}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default ObligationRequestDetailsPage;
