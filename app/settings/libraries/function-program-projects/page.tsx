import { getCompany } from '@/actions/company';
import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import MainContainerClient from '@/components/Generic/MainContainer';
import FunctionProgramProjectClient from '@/components/Libraries/FunctionProgramProjects';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'PIMS - Function, Program, and Projects',
  description: 'PIMS - Function, Program, and Projects',
};

const FunctionProgramProjectsPage = async () => {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();
  const permissions: string[] = await getPermissions();

  if (!user) redirect('/login');

  return (
    <LayoutSidebarClient
      company={company}
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <MainContainerClient title={'Library - Function, Program, and Projects'}>
        <FunctionProgramProjectClient permissions={permissions} />
      </MainContainerClient>
    </LayoutSidebarClient>
  );
};

export default FunctionProgramProjectsPage;
