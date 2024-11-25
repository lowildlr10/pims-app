import { getPermissions, getUser } from '@/actions/user';
import { LayoutSidebarClient } from '@/components/Generic/LayoutSidebar';
import UserProfileClient from '@/components/UserProfile';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Procurement System - Profile',
  description: 'Procurement System - Profile',
};

const page = async () => {
  const user = await getUser();
  const permissions = await getPermissions();

  if (!!user === false) redirect('/login');

  return (
    <LayoutSidebarClient
      user={user}
      permissions={permissions}
      type={'settings'}
    >
      <UserProfileClient user={user} />
    </LayoutSidebarClient>
  );
};

export default page;
