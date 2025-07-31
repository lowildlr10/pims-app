'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../../Generic/DataTable';
import Helper from '@/utils/Helpers';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MAIN_MODULE: ModuleType = 'lib-paper-size';

const CREATE_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Create Paper Size Type',
    endpoint: '/libraries/paper-sizes',
  },
};

const UPDATE_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Update Paper Size Type',
    endpoint: '/libraries/paper-sizes',
  },
};

const DETAIL_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    endpoint: '/libraries/paper-sizes',
  },
};

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'paper_type',
      label: 'Paper Type',
      width: '25%',
      sortable: true,
    },
    {
      id: 'unit',
      label: 'Unit',
      width: '25%',
      sortable: true,
    },
    {
      id: 'width',
      label: 'Width',
      width: '25%',
      sortable: true,
    },
    {
      id: 'height',
      label: 'Width',
      width: '25%',
      sortable: true,
    },
  ],
  body: [],
};

const PaperSizesClient = ({ permissions }: LibraryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('paper_type');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const [activeFormData, setActiveFormData] = useState<FormDataType>();
  const [activeData, setActiveData] = useState<ActiveDataType>();
  const [showCreate, setShowCreate] = useState(false);
  const [activeDataEditable, setActiveDataEditable] = useState(false);

  const { data, isLoading, mutate } = useSWR<PaperSizesResponse>(
    [
      `/libraries/paper-sizes`,
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
    const _data = data?.data?.map((body: PaperSizeType) => {
      return {
        ...body,
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

export default PaperSizesClient;
