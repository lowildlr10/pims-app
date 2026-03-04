'use client';

import React, { useState, useEffect } from 'react';
import PurchaseOrdersClient from '@/components/PurchaseOrders';
import PageHeaderActionsClient from '@/components/Generic/PageHeader/PageHeaderActions';
import { useSearchParams } from 'next/navigation';

interface PoPageActionsProps {
  user: any;
  permissions: string[];
}

export const PoPageActions = ({ user, permissions }: PoPageActionsProps) => {
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
      mainModule='po'
      showCreate={false}
      showSearch={true}
      defaultModalOnClick='details'
      setSearch={setSearch}
    />
  );
};

interface PoPageContentProps {
  user: any;
  permissions: string[];
}

export const PoPageContent = ({ user, permissions }: PoPageContentProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  return (
    <PurchaseOrdersClient
      user={user}
      permissions={permissions}
      search={search}
      setSearch={setSearch}
      showTableActions={false}
    />
  );
};
