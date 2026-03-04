'use client';

import React, { useState, useEffect } from 'react';
import InspectionAcceptanceReportsClient from '@/components/InspectionAcceptanceReports';
import PageHeaderActionsClient from '@/components/Generic/PageHeader/PageHeaderActions';
import { useSearchParams } from 'next/navigation';

interface IarPageActionsProps {
  user: any;
  permissions: string[];
}

export const IarPageActions = ({ user, permissions }: IarPageActionsProps) => {
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
      mainModule='iar'
      showCreate={false}
      showSearch={true}
      defaultModalOnClick='details'
      setSearch={setSearch}
    />
  );
};

interface IarPageContentProps {
  user: any;
  permissions: string[];
}

export const IarPageContent = ({ user, permissions }: IarPageContentProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  return (
    <InspectionAcceptanceReportsClient
      user={user}
      permissions={permissions}
      search={search}
      setSearch={setSearch}
      showTableActions={false}
    />
  );
};
