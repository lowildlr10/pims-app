'use client';

import React, { useState, useEffect } from 'react';
import DisbursementVouchersClient from '@/components/DisbursementVouchers';
import PageHeaderActionsClient from '@/components/Generic/PageHeader/PageHeaderActions';
import { useSearchParams } from 'next/navigation';

interface DvPageActionsProps {
  user: any;
  permissions: string[];
}

export const DvPageActions = ({ user, permissions }: DvPageActionsProps) => {
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
      mainModule='dv'
      showCreate={false}
      showSearch={true}
      defaultModalOnClick='details'
      setSearch={setSearch}
    />
  );
};

interface DvPageContentProps {
  user: any;
  permissions: string[];
}

export const DvPageContent = ({ user, permissions }: DvPageContentProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  return (
    <DisbursementVouchersClient
      user={user}
      permissions={permissions}
      search={search}
      setSearch={setSearch}
      showTableActions={false}
    />
  );
};
