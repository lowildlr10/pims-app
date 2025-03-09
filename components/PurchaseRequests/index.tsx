'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import StatusClient from './Status';
import { useMediaQuery } from '@mantine/hooks';
import Helper from '@/utils/Helpers';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'pr_no',
      label: 'PR No',
      width: '10%',
      sortable: true,
    },
    {
      id: 'pr_date_formatted',
      label: 'PR Date',
      width: '10%',
      sortable: true,
    },
    {
      id: 'funding_source_title',
      label: 'Funding Source',
      width: '15%',
      sortable: true,
    },
    {
      id: 'purpose_formatted',
      label: 'Purpose',
      width: '33%',
      sortable: true,
    },
    {
      id: 'requestor_fullname',
      label: 'Requested By',
      width: '16%',
      sortable: true,
    },
    {
      id: 'status_formatted',
      label: 'Status',
      width: '16%',
      sortable: true,
    },
  ],
  body: [],
};

const PurchaseRequestsClient = ({ user, permissions }: MainProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('pr_no');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [documentType] = useState<SignatoryDocumentType>('pr');
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
    const prData = data?.data?.map((body: PurchaseRequestType) => {
      const { section, funding_source, requestor, ...prData } = body;

      return {
        ...prData,
        pr_date_formatted: dayjs(body.pr_date).format('MM/DD/YYYY'),
        status_formatted: (
          <StatusClient
            size={lgScreenAndBelow ? 'xs' : 'md'}
            status={body.status}
          />
        ),
        funding_source_title: funding_source?.title ?? '-',
        requestor_fullname: body.requestor?.fullname ?? '-',
        purpose_formatted: Helper.shortenText(
          body.purpose ?? '-',
          lgScreenAndBelow ? 80 : 150
        ),
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: prData ?? [],
    }));
  }, [data, lgScreenAndBelow]);

  return (
    <DataTableClient
      mainModule={'pr'}
      user={user}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      showCreate
      defaultModalOnClick={'details'}
      createMainItemModalTitle={'Create Purchase Request'}
      createMainItemEndpoint={'/purchase-requests'}
      createModalFullscreen
      updateMainItemModalTitle={'Update Purchase Request'}
      updateMainItemBaseEndpoint={'/purchase-requests'}
      updateModalFullscreen
      detailMainItemModalTitle={'Purchase Request Details'}
      detailMainItemBaseEndpoint={'/purchase-requests'}
      printMainItemModalTitle={'Print Purchase Request'}
      printMainItemBaseEndpoint={`/documents/${documentType}/prints`}
      logMainItemModalTitle={'Purchase Request Logs'}
      data={tableData}
      perPage={perPage}
      loading={isLoading}
      page={page}
      lastPage={data?.last_page ?? 0}
      from={data?.from ?? 0}
      to={data?.to ?? 0}
      total={data?.total ?? 0}
      refreshData={mutate}
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

export default PurchaseRequestsClient;
