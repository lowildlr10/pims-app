import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import DetailClient from '@/components/Generic/CrudComponents/Details';

const MODULE_TYPE: ModuleType = 'rfq';

export const metadata = {
  title: 'PIMS - Request for Quotation Details',
  description: 'PIMS - Request for Quotation Details',
};

const RequestQuotationDetailsPage = async ({
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
        title={'Request for Quotation Details'}
        permissions={permissions}
      >
        <DetailClient
          permissions={permissions}
          endpoint={`${'/request-quotations'}/${id}`}
          content={MODULE_TYPE}
          printConfig={{
            title: 'Print Request for Quotation',
            endpoint: `/documents/${MODULE_TYPE}/prints/${id}`,
          }}
          logConfig={{
            id,
            title: 'Request for Quotation Logs',
            endpoint: '/logs',
          }}
          backUrl={`/procurement/${MODULE_TYPE}`}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default RequestQuotationDetailsPage;
