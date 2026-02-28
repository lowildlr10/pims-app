'use client';

import React, { useState, useEffect } from 'react';
import PurchaseRequestsClient from '@/components/PurchaseRequests';
import PageHeaderActionsClient from '@/components/Generic/PageHeader/PageHeaderActions';
import { useSearchParams } from 'next/navigation';

interface PurchaseRequestPageActionsProps {
  user: any;
  permissions: string[];
}

export const PurchaseRequestPageActions = ({
  user,
  permissions,
}: PurchaseRequestPageActionsProps) => {
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
      search={search}
      mainModule='pr'
      showCreate={true}
      showSearch={true}
      defaultModalOnClick='details'
      createPermissions={['super:*', 'supply:*']}
      setSearch={setSearch}
    />
  );
};

interface PurchaseRequestPageContentProps {
  user: any;
  permissions: string[];
}

export const PurchaseRequestPageContent = ({
  user,
  permissions,
}: PurchaseRequestPageContentProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  return (
    <PurchaseRequestsClient
      user={user}
      permissions={permissions}
      search={search}
      setSearch={setSearch}
      showTableActions={false}
    />
  );
};
