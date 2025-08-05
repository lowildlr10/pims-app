import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import UpdateClient from '@/components/Generic/CrudComponents/Update';

const MODULE_TYPE: ModuleType = 'dv';

export const metadata = {
  title: 'PIMS - Update Disbursement Voucher',
  description: 'PIMS - Update Disbursement Voucher',
};

const ObligationRequestUpdatePage = async ({
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
        title={'Update Disbursement Voucher'}
        permissions={permissions}
      >
        <UpdateClient
          endpoint={`/disbursement-vouchers/${id}`}
          content={MODULE_TYPE}
          backUrl={`/procurement/${MODULE_TYPE}/${id}`}
          closeUrl={`/procurement/${MODULE_TYPE}`}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default ObligationRequestUpdatePage;
