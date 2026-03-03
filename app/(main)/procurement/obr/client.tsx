'use client';

import React, { useState, useEffect } from 'react';
import ObligationRequestsClient from '@/components/ObligationRequests';
import PageHeaderActionsClient from '@/components/Generic/PageHeader/PageHeaderActions';
import { useSearchParams } from 'next/navigation';

interface ObrPageActionsProps {
  user: any;
  permissions: string[];
}

export const ObrPageActions = ({ user, permissions }: ObrPageActionsProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const searchParam = searchParams.get('search');

    if (searchParam !== search) {
      setSearch(searchParam || '');
    }
  }, [searchParams]);

  return (
    <PageHeaderActionsClient
      permissions={permissions}
      createPermissions={['obr:*', 'obr:create', 'budget:*', 'super:*']}
      search={search}
      mainModule='obr'
      showCreate={true}
      showSearch={true}
      defaultModalOnClick='details'
      setSearch={setSearch}
    />
  );
};

interface ObrPageContentProps {
  user: any;
  permissions: string[];
}

export const ObrPageContent = ({ user, permissions }: ObrPageContentProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  return (
    <ObligationRequestsClient
      user={user}
      permissions={permissions}
      search={search}
      setSearch={setSearch}
      showTableActions={false}
    />
  );
};
