'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import { useMediaQuery } from '@mantine/hooks';
import Helper from '@/utils/Helpers';
import PurchaseRequestStatusClient from '../PurchaseRequests/Status';
import StatusClient from './Status';
import { NumberFormatter } from '@mantine/core';

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
      width: '31%',
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
    {
      id: 'show-items',
      label: '',
      width: '2%',
    },
  ],
  subHead: [
    {
      id: 'po_no',
      label: 'PO/JO No',
      width: '12%',
      sortable: true,
    },
    {
      id: 'po_date_formatted',
      label: 'Date',
      width: '10%',
      sortable: true,
    },
    {
      id: 'procurement_mode_name',
      label: 'Mode of Procurement',
      width: '18%',
      sortable: true,
    },
    {
      id: 'supplier_name',
      label: 'Supplier',
      width: '30%',
      sortable: true,
    },
    {
      id: 'total_amount_format',
      label: 'Total Amount',
      width: '14%',
      sortable: false,
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

const PurchaseOrdersClient = ({ user, permissions }: MainProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('pr_no');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [documentType] = useState<SignatoryDocumentType>('pr');
  const [subDocumentType] = useState<SignatoryDocumentType>('po');
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const { data, isLoading, mutate } = useSWR<PurchaseOrdersResponse>(
    [
      `/purchase-orders`,
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
      const { section, funding_source, requestor, pos, ...prData } = body;

      return {
        ...prData,
        pr_date_formatted: dayjs(body.pr_date).format('MM/DD/YYYY'),
        status_formatted: (
          <PurchaseRequestStatusClient
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
        sub_body:
          pos?.map((subBody: PurchaseOrderType) => {
            return {
              ...subBody,
              po_date_formatted: subBody.po_date
                ? dayjs(subBody.po_date).format('MM/DD/YYYY')
                : '-',
              procurement_mode_name: subBody.mode_procurement?.mode_name ?? '-',
              supplier_name: subBody.supplier?.supplier_name ?? '-',
              total_amount_format: (
                <NumberFormatter
                  prefix={'P'}
                  value={subBody.total_amount}
                  thousandSeparator
                  decimalScale={2}
                />
              ),
              status_formatted: (
                <StatusClient
                  size={lgScreenAndBelow ? 'xs' : 'md'}
                  status={subBody.status}
                />
              ),
            };
          }) || [],
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
      subModule={'po'}
      user={user}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      defaultModalOnClick={'details'}
      subItemsClickable
      createMainItemModalTitle={'Create Purchase Request'}
      createMainItemEndpoint={'/purchase-requests'}
      createSubItemModalTitle={'Create Purchase/Job Order'}
      createSubItemEndpoint={'/purchase-orders'}
      createModalFullscreen
      updateMainItemModalTitle={'Update Purchase Request'}
      updateMainItemBaseEndpoint={'/purchase-requests'}
      updateSubItemModalTitle={'Update Purchase/Job Order'}
      updateSubItemBaseEndpoint={'/purchase-orders'}
      updateModalFullscreen
      detailMainItemModalTitle={'Purchase Request Details'}
      detailMainItemBaseEndpoint={'/purchase-requests'}
      detailSubItemModalTitle={'Purchase/Job Order Details'}
      detailSubItemBaseEndpoint={'/purchase-orders'}
      printMainItemModalTitle={'Print Purchase Request'}
      printMainItemBaseEndpoint={`/documents/${documentType}/prints`}
      printSubItemModalTitle={'Print Purchase/Job Order'}
      printSubItemBaseEndpoint={`/documents/${subDocumentType}/prints`}
      printSubItemDefaultPaper={'A4'}
      logMainItemModalTitle={'Purchase Request Logs'}
      logSubItemModalTitle={'Purchase/Job Order Logs'}
      subButtonLabel={'PO/JOs'}
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

export default PurchaseOrdersClient;
