'use client';

import React, { useState, useEffect } from 'react';
import AbstractQuotationsClient from '@/components/AbstractQuotations';
import PageHeaderActionsClient from '@/components/Generic/PageHeader/PageHeaderActions';
import { useSearchParams } from 'next/navigation';

interface AoqPageActionsProps {
  user: any;
  permissions: string[];
}

export const AoqPageActions = ({ user, permissions }: AoqPageActionsProps) => {
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
      mainModule='aoq'
      showCreate={false}
      showSearch={true}
      defaultModalOnClick='details'
      setSearch={setSearch}
    />
  );
};

interface AoqPageContentProps {
  user: any;
  permissions: string[];
}

export const AoqPageContent = ({ user, permissions }: AoqPageContentProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  return (
    <AbstractQuotationsClient
      user={user}
      permissions={permissions}
      search={search}
      setSearch={setSearch}
      showTableActions={false}
    />
  );
};
