'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import StatusClient from './Status';
import { useMediaQuery } from '@mantine/hooks';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'pr_no',
      label: 'PR No',
      width: '12%',
      sortable: true,
    },
    {
      id: 'pr_date_formatted',
      label: 'PR Date',
      width: '12%',
      sortable: true,
    },
    {
      id: 'funding_source_title',
      label: 'Funding Source',
      width: '18%',
      sortable: true,
    },
    {
      id: 'purpose',
      label: 'Purpose',
      width: '23%',
      sortable: true,
    },
    {
      id: 'requestor_fullname',
      label: 'Requested By',
      width: '18%',
      sortable: true,
    },
    {
      id: 'status_formatted',
      label: 'Status',
      width: '12%',
      sortable: true,
    },
    {
      id: 'show-items',
      label: '',
      width: '5%',
    },
  ],
  subHead: [
    {
      id: 'quantity_formatted',
      label: 'Quantity',
      width: '10%',
    },
    {
      id: 'unit_issue_formatted',
      label: 'Unit of Issue',
      width: '10%',
    },
    {
      id: 'description',
      label: 'Description',
      width: '40%',
    },
    {
      id: 'stock_no_formatted',
      label: 'Stock No',
      width: '10%',
    },
    {
      id: 'estimated_unit_cost_formatted',
      label: 'Estimated Unit Cost',
      width: '15%',
    },
    {
      id: 'estimated_cost_formatted',
      label: 'Estimated Cost',
      width: '15%',
    },
  ],
  body: [],
};

const PurchaseRequestsClient = ({ permissions }: MainProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('pr_no');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const { data, isLoading, mutate } = useSWR<PurchaseRequestsResponse>(
    [
      `/purchase-requests`,
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
    const _data = data?.data?.map((body: PurchaseRequestType) => {
      const {
        section,
        funding_source,
        requestor,
        signatory_cash_available,
        signatory_approval,
        items,
        ..._data
      } = body;

      return {
        ..._data,
        pr_date_formatted: dayjs(body.pr_date).format('MM/DD/YYYY'),
        status_formatted: (
          <StatusClient
            size={lgScreenAndBelow ? 'xs' : 'md'}
            status={body.status}
          />
        ),
        section_name: section?.section_name ?? '-',
        funding_source_title: funding_source?.title ?? '-',
        requestor_fullname: body.requestor?.fullname ?? '-',
        cash_available_fullname: signatory_cash_available?.user?.fullname,
        approval_fullname: signatory_approval?.user?.fullname,
        items,
        sub_body:
          items?.map((subBody: PurchaseRequestItemType) => {
            return {
              ...subBody,
              quantity_formatted: String(subBody.quantity),
              stock_no_formatted: String(subBody.stock_no),
              unit_issue_formatted: subBody.unit_issue?.unit_name ?? '-',
            };
          }) || [],
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: _data ?? [],
    }));
  }, [data]);

  return (
    <DataTableClient
      mainModule={'pr'}
      subModule={'pr-item'}
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
      showDetailsFirst
      autoCollapseFirstSubItems={false}
    />
  );
};

export default PurchaseRequestsClient;
