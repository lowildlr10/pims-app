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

const MAIN_MODULE: ModuleType = 'lib-supplier';

const CREATE_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Create Supplier',
    endpoint: '/libraries/suppliers',
  },
};

const UPDATE_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Update Supplier',
    endpoint: '/libraries/suppliers',
  },
};

const DETAIL_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    endpoint: '/libraries/suppliers',
  },
};

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'supplier_name_formatted',
      label: 'Supplier',
      width: '20%',
      sortable: true,
    },
    {
      id: 'address',
      label: 'Address',
      width: '35%',
      sortable: true,
    },
    {
      id: 'phone',
      label: 'Phone',
      width: '13%',
      sortable: true,
    },
    {
      id: 'telephone',
      label: 'Telephone',
      width: '13%',
      sortable: true,
    },

    {
      id: 'contact_person',
      label: 'Contact Person',
      width: '19%',
      sortable: true,
    },
  ],
  body: [],
};

const SuppliersClient = ({ permissions }: LibraryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('supplier_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const [activeFormData, setActiveFormData] = useState<FormDataType>();
  const [activeData, setActiveData] = useState<ActiveDataType>();
  const [showCreate, setShowCreate] = useState(false);
  const [activeDataEditable, setActiveDataEditable] = useState(false);

  const { data, isLoading, mutate } = useSWR<SuppliersResponse>(
    [
      `/libraries/suppliers`,
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

    switch (moduleType) {
      case MAIN_MODULE:
        if (display === 'create') {
          setActiveFormData(undefined);
        } else {
          setActiveFormData(data);
        }
        break;

      default:
        break;
    }
  }, [activeData]);

  useEffect(() => {
    setShowCreate([
      'supply:*',
      ...getAllowedPermissions(MAIN_MODULE, 'create'),
    ].some((permission) => permissions?.includes(permission)));

    setActiveDataEditable([
      'supply:*',
      ...getAllowedPermissions(MAIN_MODULE, 'update'),
    ].some((permission) => permissions?.includes(permission)));
  }, [permissions]);

  useEffect(() => {
    const _data = data?.data?.map((body: SupplierType) => {
      return {
        ...body,
        supplier_name_formatted: (
          <Group>
            <Text size={'sm'}>{body.supplier_name}</Text>
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
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      showCreate={showCreate}
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

export default SuppliersClient;
