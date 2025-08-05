import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import DetailClient from '@/components/Generic/CrudComponents/Details';

const MODULE_TYPE: ModuleType = 'aoq';

export const metadata = {
  title: 'PIMS - Abstract of Bids and Quotation Details',
  description: 'PIMS - Abstract of Bids and Quotation Details',
};

const AbstractQuotationDetailsPage = async ({
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
        title={'Abstract of Bids and Quotation Details'}
        permissions={permissions}
      >
        <DetailClient
          permissions={permissions}
          endpoint={`${'/abstract-quotations'}/${id}`}
          content={MODULE_TYPE}
          printConfig={{
            title: 'Print Abstract of Bids and Quotation',
            endpoint: `/documents/${MODULE_TYPE}/prints/${id}`,
            default_paper: 'Long',
            default_orientation: 'L',
          }}
          logConfig={{
            id,
            title: 'Abstract of Bids and Quotation Logs',
            endpoint: '/logs',
          }}
          backUrl={`/procurement/${MODULE_TYPE}?search=${id}`}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default AbstractQuotationDetailsPage;
