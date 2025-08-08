import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import CreateClient from '@/components/Generic/CrudComponents/Create';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'rfq';

export const metadata = {
  title: 'PIMS - Create Request for Quotation',
  description: 'PIMS - Create Request for Quotation',
};

const RequestQuotationCreatePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ parent_id: string }>;
}) => {
  const parentId = (await searchParams).parent_id;
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = `/procurement/${MODULE_TYPE}`;
  const hasCreatePermission = [
    'supply:*',
    ...getAllowedPermissions(MODULE_TYPE, 'create'),
  ].some((permission) => permissions?.includes(permission));

  if (!user) redirect('/login');

  if (!hasCreatePermission) redirect(backUrl);

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'main'}
    >
      <MainContainerClient
        title={'Create Request for Quotation'}
        permissions={permissions}
      >
        <CreateClient
          data={{
            purchase_request_id: parentId,
          }}
          endpoint={'/request-quotations'}
          content={MODULE_TYPE}
          backUrl={backUrl}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default RequestQuotationCreatePage;
