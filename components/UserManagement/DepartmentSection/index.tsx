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

const MAIN_MODULE: ModuleType = 'account-department';
const SUB_MODULE: ModuleType = 'account-section';

const CREATE_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Create Department',
    endpoint: '/accounts/departments',
  },
  sub: {
    title: 'Create Section',
    endpoint: '/accounts/sections',
  },
};

const UPDATE_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Update Department',
    endpoint: '/accounts/departments',
  },
  sub: {
    title: 'Create Section',
    endpoint: '/accounts/sections',
  },
};

const DETAIL_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    endpoint: '/accounts/departments',
  },
  sub: {
    endpoint: '/accounts/sections',
  },
};

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

const DepartmentSectionClient = ({ permissions }: DepartmentSectionProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnSort, setColumnSort] = useState('department_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const [activeFormData, setActiveFormData] = useState<FormDataType>();
  const [activeData, setActiveData] = useState<ActiveDataType>();
  const [activeDataEditable, setActiveDataEditable] = useState(false);

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

      case SUB_MODULE:
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions(SUB_MODULE, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setActiveDataEditable(hasEditPermission);

        if (display === 'create') {
          setActiveFormData({
            department_id: data?.parent_id ?? undefined,
          });
        } else {
          setActiveFormData(data);
        }
        break;

      default:
        break;
    }
  }, [activeData, permissions]);

  useEffect(() => {
    const _data = data?.data?.map((body: DepartmentType) => {
      const { sections, ..._data } = body;
      return {
        ..._data,
        headfullname: body.head?.fullname ?? '-',
        sub_body:
          sections?.map((subBody) => {
            return {
              ...subBody,
              headfullname: subBody.head?.fullname ?? '-',
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
              ),
            };
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
      subModule={SUB_MODULE}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      showCreate
      showCreateSubItem
      subItemsClickable
      showEdit={activeDataEditable}
      createItemData={CREATE_ITEM_CONFIG}
      updateItemData={UPDATE_ITEM_CONFIG}
      detailItemData={DETAIL_ITEM_CONFIG}
      subButtonLabel={'Sections'}
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

export default DepartmentSectionClient;
