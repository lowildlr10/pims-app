'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../../Generic/DataTable';

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
  const [perPage, setPerPage] = useState(10);
  const [columnSort, setColumnSort] = useState('paper_type');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

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
      module={'lib-paper-size'}
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

export default PaperSizesClient;
