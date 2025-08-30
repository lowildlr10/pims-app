import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import CompanyProfileClient from '@/components/CompanyProfile';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { redirect } from 'next/navigation';
import React from 'react';

const MODULE_TYPE: ModuleType = 'company';

export const metadata = {
  title: 'PIMS - Company Profile',
  description: 'PIMS - Company Profile',
};

const CompanyProfilePage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();
  const backUrl = '/';
  const hasShowPermission = [
    ...getAllowedPermissions(MODULE_TYPE, 'view'),
  ].some((permission) => permissions?.includes(permission));

  if (!user) redirect('/login');

  if (!hasShowPermission) redirect(backUrl);

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'Company Profile'}>
        <CompanyProfileClient company={company} permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default CompanyProfilePage;
