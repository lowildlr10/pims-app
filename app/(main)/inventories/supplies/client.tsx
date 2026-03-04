'use client';

import React, { useState, useEffect } from 'react';
import InventorySuppliesClient from '@/components/InventorySupplies';
import PageHeaderActionsClient from '@/components/Generic/PageHeader/PageHeaderActions';
import { useSearchParams } from 'next/navigation';

interface SuppliesPageActionsProps {
  user: any;
  permissions: string[];
}

export const SuppliesPageActions = ({
  user,
  permissions,
}: SuppliesPageActionsProps) => {
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
      mainModule='inv-supply'
      showCreate={true}
      showSearch={true}
      defaultModalOnClick='details'
      createPermissions={['super:*', 'inv-supply:*']}
      setSearch={setSearch}
    />
  );
};

interface SuppliesPageContentProps {
  user: any;
  permissions: string[];
}

export const SuppliesPageContent = ({
  user,
  permissions,
}: SuppliesPageContentProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  return (
    <InventorySuppliesClient
      user={user}
      permissions={permissions}
      search={search}
      setSearch={setSearch}
      showTableActions={false}
    />
  );
};
