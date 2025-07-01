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
      id: 'code_formatted',
      label: 'Code',
      width: '25%',
      sortable: true,
    },
    {
      id: 'description',
      label: 'Description',
      width: '75%',
      sortable: true,
    },
  ],
  body: [],
};

const MfoPapsClient = ({ permissions }: LibraryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const [activeFormData, setActiveFormData] = useState<FormDataType>();
  const [activeData, setActiveData] = useState<ActiveDataType>();
  const [activeDataEditable, setActiveDataEditable] = useState(false);

  const { data, isLoading, mutate } = useSWR<MfoPapsResponse>(
    [
      `/libraries/mfo-paps`,
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
      case 'lib-mfo-pap':
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions('lib-mfo-pap', 'update'),
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
    const _data = data?.data?.map((body: MfoPapType) => {
      return {
        ...body,
        code_formatted: (
          <Group>
            <Text size={'sm'}>{body.code}</Text>
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
      mainModule={'lib-mfo-pap'}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      showCreate
      showEdit={activeDataEditable}
      createMainItemModalTitle={'Create MFO/PAP'}
      createMainItemEndpoint={'/libraries/mfo-paps'}
      updateMainItemModalTitle={'Update MFO/PAP'}
      updateMainItemBaseEndpoint={'/libraries/mfo-paps'}
      detailMainItemBaseEndpoint={'/libraries/mfo-paps'}
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

export default MfoPapsClient;
