'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../../Generic/DataTable';
import { Badge, Group, Stack, Text } from '@mantine/core';
import { IconExclamationCircleFilled } from '@tabler/icons-react';
import Helper from '@/utils/Helpers';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MAIN_MODULE: ModuleType = 'account-user';

const CREATE_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Create User',
    endpoint: '/accounts/users',
  },
};

const UPDATE_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Update User',
    endpoint: '/accounts/users',
  },
};

const DETAIL_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    endpoint: '/accounts/users',
  },
};

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'fullname_formatted',
      label: 'Full Name',
      width: '22%',
      sortable: true,
    },
    {
      id: 'employee_id',
      label: 'Employee ID',
      width: '10%',
      sortable: true,
    },
    {
      id: 'division_section',
      label: 'Division - Section',
      width: '20%',
      sortable: true,
    },
    {
      id: 'position_designation',
      label: 'Position - Designation',
      width: '20%',
      sortable: true,
    },
    {
      id: 'user_roles',
      label: 'Roles',
      width: '28%',
    },
  ],
  body: [],
};

const UsersClient = ({ permissions }: UsersProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnSort, setColumnSort] = useState('firstname');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const [activeFormData, setActiveFormData] = useState<FormDataType>();
  const [activeData, setActiveData] = useState<ActiveDataType>();
  const [activeDataEditable, setActiveDataEditable] = useState(false);

  const { data, isLoading, mutate } = useSWR<UsersResponse>(
    [
      `/accounts/users`,
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
      case MAIN_MODULE:
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions(MAIN_MODULE, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setActiveDataEditable(hasEditPermission);

        if (display === 'create') {
          setActiveFormData(undefined);
        } else {
          setActiveFormData(data);
        }
        break;

      default:
        break;
    }
  }, [activeData, permissions]);

  useEffect(() => {
    const _data = data?.data?.map((body: UserType) => {
      return {
        ...body,
        fullname_formatted: (
          <Group>
            <Text size={'sm'}>{body.fullname}</Text>
            {body.restricted && (
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
        user_roles: (
          <>
            {body.roles?.map((role, i) => (
              <Badge mr={4} color={'var(--mantine-color-primary-9)'} key={i}>
                {role.role_name}
              </Badge>
            )) ?? '-'}
          </>
        ),
        division_section: (
          <Stack gap={0}>
            <Text size={'sm'}>{body.division?.division_name}</Text>
            <Text c={'dimmed'} size={'sm'}>
              {body.section?.section_name}
            </Text>
          </Stack>
        ),
        position_designation: (
          <Stack gap={0}>
            <Text size={'sm'}>{body.position?.position_name}</Text>
            <Text c={'dimmed'} size={'sm'}>
              {body.designation?.designation_name}
            </Text>
          </Stack>
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
      mainModule={MAIN_MODULE}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      showCreate
      showEdit={activeDataEditable}
      createItemData={CREATE_ITEM_CONFIG}
      updateItemData={UPDATE_ITEM_CONFIG}
      detailItemData={DETAIL_ITEM_CONFIG}
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

export default UsersClient;
