'use client';

import React, { useState, useEffect } from 'react';
import PurchaseRequestsClient from './index';
import PageHeaderActionsClient from '@/components/Generic/PageHeader/PageHeaderActions';
import { useSearchParams } from 'next/navigation';
import { Group } from '@mantine/core';

interface PurchaseRequestsWithActionsProps {
  user: any;
  permissions: string[];
}

const PurchaseRequestsWithActionsClient = ({
  user,
  permissions,
}: PurchaseRequestsWithActionsProps) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const searchParam = searchParams.get('search');
    const statusParam = searchParams.get('status');

    if (searchParam !== search) {
      setSearch(searchParam || '');
    }
    if (statusParam !== status) {
      setStatus(statusParam || '');
    }
  }, [searchParams]);

  return (
    <>
      <Group gap='sm'>
        <PageHeaderActionsClient
          permissions={permissions}
          search={search}
          mainModule='pr'
          showCreate={true}
          showSearch={true}
          defaultModalOnClick='details'
          setSearch={setSearch}
          setPageLoading={setPageLoading}
        />
      </Group>
      <PurchaseRequestsClient
        user={user}
        permissions={permissions}
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />
    </>
  );
};

export default PurchaseRequestsWithActionsClient;
