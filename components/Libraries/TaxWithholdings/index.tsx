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

const MAIN_MODULE: ModuleType = 'lib-tax-withholding';

const CREATE_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Create Tax Withholding',
    endpoint: '/libraries/tax-withholdings',
  },
};

const UPDATE_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Update Tax Withholding',
    endpoint: '/libraries/tax-withholdings',
  },
};

const DETAIL_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    endpoint: '/libraries/tax-withholdings',
  },
};

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'name_formatted',
      label: 'Name',
      width: '35%',
      sortable: true,
    },
    {
      id: 'type',
      label: 'Type',
      width: '20%',
    },
    {
      id: 'ewt_rate_formatted',
      label: 'W/Tax Rate',
      width: '15%',
    },
    {
      id: 'ptax_rate_formatted',
      label: 'P/Tax Rate',
      width: '15%',
    },
    {
      id: 'vat_formatted',
      label: 'VAT',
      width: '15%',
    },
  ],
  body: [],
};

const TaxWithholdingsClient = ({ permissions }: LibraryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const [activeFormData, setActiveFormData] = useState<FormDataType>();
  const [activeData, setActiveData] = useState<ActiveDataType>();
  const [showCreate, setShowCreate] = useState(false);
  const [activeDataEditable, setActiveDataEditable] = useState(false);

  const { data, isLoading, mutate } = useSWR<TaxWithholdingsResponse>(
    [
      `/libraries/tax-withholdings`,
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
  }, [activeData, permissions]);

  useEffect(() => {
    setShowCreate(
      getAllowedPermissions(MAIN_MODULE, 'create').some((permission) =>
        permissions?.includes(permission)
      )
    );

    setActiveDataEditable(
      getAllowedPermissions(MAIN_MODULE, 'update').some((permission) =>
        permissions?.includes(permission)
      )
    );
  }, [permissions]);

  useEffect(() => {
    const _data = data?.data?.map((body: TaxWithholdingType) => {
      const ewtPct = ((body.ewt_rate ?? 0) * 100).toFixed(0) + '%';
      const ptaxPct = ((body.ptax_rate ?? 0) * 100).toFixed(0) + '%';

      return {
        ...body,
        name_formatted: (
          <Group>
            <Text size={'sm'}>{body.name}</Text>
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
        ewt_rate_formatted: ewtPct,
        ptax_rate_formatted: ptaxPct,
        vat_formatted: body.is_vat ? (
          <Badge variant={'light'} color={'var(--mantine-color-primary-8)'}>
            VAT
          </Badge>
        ) : (
          <Badge variant={'light'} color={'var(--mantine-color-gray-6)'}>
            Non-VAT
          </Badge>
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
      lastPage={data?.meta?.last_page ?? 0}
      from={data?.meta?.from ?? 0}
      to={data?.meta?.to ?? 0}
      total={data?.meta?.total ?? 0}
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

export default TaxWithholdingsClient;
