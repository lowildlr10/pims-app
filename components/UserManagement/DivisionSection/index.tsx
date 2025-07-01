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
      id: 'division_name_formatted',
      label: 'Division',
      width: '70%',
      sortable: true,
    },
    {
      id: 'headfullname',
      label: 'Division Head',
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

const DivisionSectionClient = ({ permissions }: DivisionSectionProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnSort, setColumnSort] = useState('division_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const [activeFormData, setActiveFormData] = useState<FormDataType>();
  const [activeData, setActiveData] = useState<ActiveDataType>();
  const [activeDataEditable, setActiveDataEditable] = useState(false);

  const { data, isLoading, mutate } = useSWR<DivisionResponse>(
    [
      `/accounts/divisions`,
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
      case 'account-division':
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions('account-division', 'update'),
        ].some((permission) => permissions?.includes(permission));

        setActiveDataEditable(hasEditPermission);

        if (display === 'create') {
        } else {
          setActiveFormData(data);
        }
        break;

      case 'account-section':
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions('account-section', 'update'),
        ].some((permission) => permissions?.includes(permission));

        setActiveDataEditable(hasEditPermission);

        if (display === 'create') {
          setActiveFormData({
            division_id: data?.parent_id ?? undefined,
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
    const _data = data?.data?.map((body: DivisionType) => {
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
        division_name_formatted: (
          <Group>
            <Text size={'sm'}>{body.division_name}</Text>
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
      mainModule={'account-division'}
      subModule={'account-section'}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      showCreate
      showCreateSubItem
      subItemsClickable
      showEdit={activeDataEditable}
      createMainItemModalTitle={'Create Division'}
      createMainItemEndpoint={'/accounts/divisions'}
      createSubItemModalTitle={'Create Section'}
      createSubItemEndpoint={'/accounts/sections'}
      updateMainItemModalTitle={'Update Division'}
      updateMainItemBaseEndpoint={'/accounts/divisions'}
      updateSubItemModalTitle={'Update Section'}
      updateSubItemBaseEndpoint={'/accounts/sections'}
      detailMainItemBaseEndpoint={'/accounts/divisions'}
      detailSubItemBaseEndpoint={'/accounts/sections'}
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

export default DivisionSectionClient;
