'use client';

import React, { useState, useEffect } from 'react';
import InventoryIssuancesClient from '@/components/InventoryIssuances';
import PageHeaderActionsClient from '@/components/Generic/PageHeader/PageHeaderActions';
import { useSearchParams } from 'next/navigation';

interface IssuancesPageActionsProps {
  user: any;
  permissions: string[];
}

export const IssuancesPageActions = ({
  user,
  permissions,
}: IssuancesPageActionsProps) => {
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
      mainModule='inv-issuance'
      showCreate={true}
      showSearch={true}
      defaultModalOnClick='details'
      createPermissions={['super:*', 'inv-supply:*']}
      createMenus={[
        {
          label: 'Inventory Issuance Slip (ICS)',
          value: 'ics',
          moduleType: 'inv-issuance',
        },
        {
          label: 'Requisition Issuance Slip (RIS)',
          value: 'ris',
          moduleType: 'inv-issuance',
        },
        {
          label: 'Acknowledgement Receipt of Equipment (ARE)',
          value: 'are',
          moduleType: 'inv-issuance',
        },
      ]}
      setPageLoading={(loading: boolean) => {}}
      setSearch={setSearch}
    />
  );
};

interface IssuancesPageContentProps {
  user: any;
  permissions: string[];
}

export const IssuancesPageContent = ({
  user,
  permissions,
}: IssuancesPageContentProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  return (
    <InventoryIssuancesClient
      user={user}
      permissions={permissions}
      search={search}
      setSearch={setSearch}
      showTableActions={false}
    />
  );
};
