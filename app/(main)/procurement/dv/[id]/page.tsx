import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCompany } from '@/actions/company';
import DetailClient from '@/components/Generic/CrudComponents/Details';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MODULE_TYPE: ModuleType = 'dv';

export const metadata = {
  title: 'PIMS - Disbursement Voucher Details',
  description: 'PIMS - Disbursement Voucher Details',
};

const DisbursementVoucherDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = `/procurement/${MODULE_TYPE}?search=${id}`;
  const hasShowPermission = [
    'accountant:*',
    ...getAllowedPermissions(MODULE_TYPE, 'show'),
  ].some((permission) => permissions?.includes(permission));

  if (!user) redirect('/login');

  if (!hasShowPermission) redirect(backUrl);

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'main'}
    >
      <MainContainerClient
        title={'Disbursement Voucher Details'}
        permissions={permissions}
      >
        <DetailClient
          permissions={permissions}
          endpoint={`${'/disbursement-vouchers'}/${id}`}
          content={MODULE_TYPE}
          printConfig={{
            title: 'Print Disbursement Voucher',
            endpoint: `/documents/${MODULE_TYPE}/prints/${id}`,
          }}
          logConfig={{
            id,
            title: 'Disbursement Voucher Logs',
            endpoint: '/logs',
          }}
          backUrl={backUrl}
        />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default DisbursementVoucherDetailsPage;
