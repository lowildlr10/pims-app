'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import { Badge, Group, Text } from '@mantine/core';
import { IconExclamationCircleFilled } from '@tabler/icons-react';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'department_name_formatted',
      label: 'Department',
      width: '70%',
      sortable: true,
    },
    {
      id: 'headfullname',
      label: 'Department Head',
      width: '25%',
      sortable: true,
    },
    {
      id: 'show-sections',
      label: '',
      width: '5%',
    },
  ],
  subHead: [
    {
      id: 'section_name_formatted',
      label: 'Section',
      width: '70%',
    },
    {
      id: 'headfullname',
      label: 'Section Head',
      width: '30%',
    },
  ],
  body: [],
};

const DepartmentSectionClient = ({
  permissions,
}: DepartmentSectionProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnSort, setColumnSort] = useState('department_name');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const { data, isLoading, mutate } = useSWR<DepartmentResponse>(
    [
      `/accounts/departments`,
      search,
      page,
      perPage,
      columnSort,
      sortDirection,
      paginated,
    ],
    ([url, search, page, perPage, columnSort, sortDirection, paginated]: any) =>
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
    const _data = data?.data?.map((body: DepartmentType) => {
      const { sections, ..._data } = body;
      return {
        ..._data,
        subBody: sections?.map((subBody: any) => {
          return {
            ...subBody,
            section_name_formatted: (
              <Group>
                <Text size={'sm'}>{subBody.section_name}</Text>
                {!subBody.active && (
                  <Badge
                    variant={'light'}
                    leftSection={<IconExclamationCircleFilled size={14} />}
                    color={'var(--mantine-color-red-8)'}
                  >
                    Inactive
                  </Badge>
                )}
              </Group>
            )
          }
        }) || [],
        department_name_formatted: (
          <Group>
            <Text size={'sm'}>{body.department_name}</Text>
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
        )
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: _data ?? [],
    }));
  }, [data]);

  return (
    <DataTableClient
      module={'account-department'}
      subModule={'account-section'}
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

export default DepartmentSectionClient;
