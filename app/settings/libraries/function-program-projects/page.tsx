import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import FunctionProgramProjectClient from '@/components/Libraries/FunctionProgramProjects';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { redirect } from 'next/navigation';
import React from 'react';
import { IconBuilding } from '@tabler/icons-react';

const MODULE_TYPE: ModuleType = 'lib-fpp';

export const metadata = {
  title: 'PIMS - Function, Program, and Projects',
  description: 'PIMS - Function, Program, and Projects',
};

const FunctionProgramProjectsPage = async () => {
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
      <MainContainerClient
        title='Function, Program, and Projects'
        secondaryTtile='Organize functions and program projects'
        icon={<IconBuilding size={24} stroke={1.5} />}
      >
        <FunctionProgramProjectClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default FunctionProgramProjectsPage;
