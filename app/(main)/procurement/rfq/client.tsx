'use client';

import React, { useState, useEffect } from 'react';
import RequestQuotationsClient from '@/components/RequestQuotations';
import PageHeaderActionsClient from '@/components/Generic/PageHeader/PageHeaderActions';
import { useSearchParams } from 'next/navigation';

interface RfqPageActionsProps {
  user: any;
  permissions: string[];
}

export const RfqPageActions = ({ user, permissions }: RfqPageActionsProps) => {
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
      mainModule='rfq'
      showCreate={false}
      showSearch={true}
      defaultModalOnClick='details'
      setSearch={setSearch}
    />
  );
};

interface RfqPageContentProps {
  user: any;
  permissions: string[];
}

export const RfqPageContent = ({ user, permissions }: RfqPageContentProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  return (
    <RequestQuotationsClient
      user={user}
      permissions={permissions}
      search={search}
      setSearch={setSearch}
      showTableActions={false}
    />
  );
};
