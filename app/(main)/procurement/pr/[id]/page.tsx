import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import DetailClient from '@/components/Generic/CrudComponents/Details';

const MODULE_TYPE: ModuleType = 'pr';

export const metadata = {
  title: 'PIMS - Purchase Request Details',
  description: 'PIMS - Purchase Request Details',
};

const PurchaseRequestDetailsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from: ModuleType }>;
}) => {
  const { id } = await params;
  const from: ModuleType = (await searchParams).from;
  let backUrl = '/procurement/pr';

  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  switch (from) {
    case 'rfq':
    case 'aoq':
    case 'po':
      backUrl = `/procurement/${from}`;
      break;

    default:
      backUrl = '/procurement/pr';
      break;
  }

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'main'}
    >
      <MainContainerClient
        title={'Purchase Request Details'}
        permissions={permissions}
      >
        <DetailClient
          permissions={permissions}
          endpoint={`${'/purchase-requests'}/${id}`}
          content={MODULE_TYPE}
          printConfig={{
            title: 'Print Purchase Request',
            endpoint: `/documents/${MODULE_TYPE}/prints/${id}`,
          }}
          logConfig={{
            id,
            title: 'Purchase Request Logs',
            endpoint: '/logs',
          }}
          backUrl={backUrl}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default PurchaseRequestDetailsPage;
