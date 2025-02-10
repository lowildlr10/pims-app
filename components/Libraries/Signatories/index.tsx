'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../../Generic/DataTable';
import { Badge, Group, Text } from '@mantine/core';
import { IconExclamationCircleFilled } from '@tabler/icons-react';
import Helper from '@/utils/Helpers';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'fullname',
      label: 'Full Name',
      width: '95%',
      sortable: true,
    },
    {
      id: 'show-deatils',
      label: '',
      width: '5%',
    },
  ],
  subHead: [
    {
      id: 'document_formatted',
      label: 'Document',
      width: '20%',
    },
    {
      id: 'signatory_type_formatted',
      label: 'Display',
      width: '40%',
    },
    {
      id: 'position',
      label: 'Position/Designation',
      width: '40%',
    },
  ],
  body: [],
};

const SignatoriesClient = ({ permissions }: LibraryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnSort, setColumnSort] = useState('fullname');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const { data, isLoading, mutate } = useSWR<SignatoriesResponse>(
    [
      `/libraries/signatories`,
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
    const _data = data?.data?.map((body: SignatoryType) => {
      const { user, details, ..._data } = body;
      return {
        ..._data,
        details,
        sub_body:
          details?.map((subBody: SignatoryDetailType) => {
            return {
              ...subBody,
              document_formatted: String(subBody?.document).toUpperCase(),
              signatory_type_formatted: Helper.formatStringHasUnderscores(
                String(subBody?.signatory_type)
              ),
            };
          }) || [],
        fullname: (
          <Group>
            <Text size={'sm'}>{body.user?.fullname}</Text>
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
      mainModule={'lib-signatory'}
      subModule={'lib-signatory-detail'}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      data={tableData}
      perPage={perPage}
      loading={isLoading}
      page={page}
      lastPage={data?.last_page ?? 0}
      from={data?.from ?? 0}
      to={data?.to ?? 0}
      total={data?.total ?? 0}
      refreshData={(params) => mutate(params)}
      onChange={(_search, _page, _perPage, _columnSort, _sortDirection) => {
        setSearch(_search ?? '');
        setPage(_page);
        setPerPage(_perPage);
        setColumnSort(_columnSort ?? columnSort);
        setSortDirection(_sortDirection ?? 'desc');
      }}
      showSearch
      showCreate
    />
  );
};

export default SignatoriesClient;
