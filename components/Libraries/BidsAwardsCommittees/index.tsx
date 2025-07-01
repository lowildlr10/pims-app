'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../../Generic/DataTable';
import { Badge, Group, Text } from '@mantine/core';
import { IconExclamationCircleFilled } from '@tabler/icons-react';
import Helper from '@/utils/Helpers';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'committee_name_formatted',
      label: 'Committee Name',
      width: '100%',
      sortable: true,
    },
  ],
  body: [],
};

const BidsAwardsCommitteesClient = ({ permissions }: LibraryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('committee_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const [activeFormData, setActiveFormData] = useState<FormDataType>();
  const [activeData, setActiveData] = useState<ActiveDataType>();
  const [activeDataEditable, setActiveDataEditable] = useState(false);

  const { data, isLoading, mutate } = useSWR<BidsAwardsCommitteeResponse>(
    [
      `/libraries/bids-awards-committees`,
      search,
      page,
      perPage,
      columnSort,
      sortDirection,
      paginated,
    ],
    ([
      url,
      search,
      page,
      perPage,
      columnSort,
      sortDirection,
      paginated,
    ]: GeneralResponse) =>
      API.get(url, {
        search,
        page,
        per_page: perPage,
        column_sort: columnSort,
        sort_direction: sortDirection,
        paginated,
      }),
    {
      refreshInterval: API_REFRESH_INTERVAL,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (Helper.empty(activeData?.moduleType) || Helper.empty(activeData?.data))
      return;

    const { display, moduleType, data } = activeData ?? {};
    // const status = data?.status;
    let hasEditPermission = false;

    switch (moduleType) {
      case 'lib-bid-committee':
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions('lib-bid-committee', 'update'),
        ].some((permission) => permissions?.includes(permission));

        setActiveDataEditable(hasEditPermission);

        if (display === 'create') {
        } else {
          setActiveFormData(data);
        }
        break;

      default:
        break;
    }
  }, [activeData, permissions]);

  useEffect(() => {
    const _data = data?.data?.map((body: BidsAwardsCommitteeType) => {
      return {
        ...body,
        committee_name_formatted: (
          <Group>
            <Text size={'sm'}>{body.committee_name}</Text>
            {!body.active && (
              <Badge
                variant={'light'}
                leftSection={<IconExclamationCircleFilled size={14} />}
                color={'var(--mantine-color-red-8)'}
              >
                Inactive
              </Badge>
            )}
          </Group>
        ),
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: _data ?? [],
    }));
  }, [data]);

  return (
    <DataTableClient
      mainModule={'lib-bid-committee'}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      showCreate
      showEdit={activeDataEditable}
      createMainItemModalTitle={'Create Bids and Awards Committee'}
      createMainItemEndpoint={'/libraries/bids-awards-committees'}
      updateMainItemModalTitle={'Update Bids and Awards Committee'}
      updateMainItemBaseEndpoint={'/libraries/bids-awards-committees'}
      detailMainItemBaseEndpoint={'/libraries/bids-awards-committees'}
      data={tableData}
      perPage={perPage}
      loading={isLoading}
      page={page}
      lastPage={data?.last_page ?? 0}
      from={data?.from ?? 0}
      to={data?.to ?? 0}
      total={data?.total ?? 0}
      refreshData={mutate}
      activeFormData={activeFormData}
      setActiveData={setActiveData}
      onChange={(_search, _page, _perPage, _columnSort, _sortDirection) => {
        setSearch(_search ?? '');
        setPage(_page);
        setPerPage(_perPage);
        setColumnSort(_columnSort ?? columnSort);
        setSortDirection(_sortDirection ?? 'desc');
      }}
    />
  );
};

export default BidsAwardsCommitteesClient;
