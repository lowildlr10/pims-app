import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import UpdateClient from '@/components/Generic/CrudComponents/Update';

const MODULE_TYPE: ModuleType = 'rfq';

export const metadata = {
  title: 'PIMS - Update Request for Quotation',
  description: 'PIMS - Update Request for Quotation',
};

const RequestQuotationUpdatePage = async ({
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
        title={'Update Request for Quotation'}
        permissions={permissions}
      >
        <UpdateClient
          endpoint={`/request-quotations/${id}`}
          content={MODULE_TYPE}
          backUrl={`/procurement/${MODULE_TYPE}/${id}`}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default RequestQuotationUpdatePage;
