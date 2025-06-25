'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import { randomId, useMediaQuery } from '@mantine/hooks';
import Helper from '@/utils/Helpers';
import PurchaseRequestStatusClient from '../PurchaseRequests/Status';
import StatusClient from './Status';
import { Stack, Text } from '@mantine/core';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'po_no',
      label: 'PO No',
      width: '12%',
      sortable: true,
    },
    {
      id: 'funding_source_title',
      label: 'Funding Source',
      width: '15%',
      sortable: true,
    },
    {
      id: 'supplier_name',
      label: 'Supplier',
      width: '57%',
      sortable: true,
    },
    {
      id: 'delivery_date',
      label: 'Delivery Date',
      width: '14%',
      sortable: true,
    },
    {
      id: 'show-issuances',
      label: '',
      width: '2%',
    },
  ],
  subHead: [
    {
      id: 'inventory_no',
      label: 'RIS/ICS/ARE No',
      width: '12%',
      sortable: true,
    },
    {
      id: 'document_type_formatted',
      label: 'Document Type',
      width: '57%',
      sortable: true,
    },
    {
      id: 'received_by_name',
      label: 'Issued To',
      width: '15%',
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

const InventoryIssuancesClient = ({ user, permissions }: MainProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('po_no');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [documentType] = useState<SignatoryDocumentType>('po');
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const { data, isLoading, mutate } = useSWR<InventoryIssuanceResponse>(
    [
      `/inventories/issuances`,
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
    const poData = data?.data?.map((body: PurchaseOrderType) => {
      const { issuances, supplier, purchase_request, ...poData } = body;

      return {
        ...poData,
        funding_source_title: purchase_request?.funding_source?.title ?? '-',
        supplier_name: supplier?.supplier_name ?? '-',
        delivery_date: dayjs(poData.status_timestamps.delivered_at).format(
          'MM/DD/YYYY'
        ),
        sub_body: issuances?.map((subBody: InventoryIssuanceType) => ({
          ...subBody,
          document_type_formatted:
            Helper.mapInventoryIssuanceDocumentType(subBody.document_type) ??
            '-',
          received_by_name: subBody.recipient?.fullname ?? '-',
          status_formatted: (
            <StatusClient
              size={lgScreenAndBelow ? 'xs' : 'md'}
              status={subBody.status}
            />
          ),
        })),
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: poData ?? [],
    }));
  }, [data, lgScreenAndBelow]);

  return (
    <DataTableClient
      mainModule={'po'}
      subModule={'inv-issuance'}
      user={user}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      defaultModalOnClick={'details'}
      mainItemsClickable={false}
      subItemsClickable
      showCreate
      createMenus={[
        {
          label: Helper.mapInventoryIssuanceDocumentType('ris'),
          value: 'ris',
          moduleType: 'inv-issuance',
        },
        {
          label: Helper.mapInventoryIssuanceDocumentType('ics'),
          value: 'ics',
          moduleType: 'inv-issuance',
        },
        {
          label: Helper.mapInventoryIssuanceDocumentType('are'),
          value: 'are',
          moduleType: 'inv-issuance',
        },
      ]}
      createMainItemModalTitle={'Create Issuance'}
      createMainItemEndpoint={'/inventories/issuances'}
      createModalFullscreen
      updateSubItemModalTitle={'Update Inventory Issuance'}
      updateSubItemBaseEndpoint={'/inventories/issuances'}
      updateMainItemEnable={false}
      updateModalFullscreen
      detailSubItemModalTitle={'Inventory Issuance Details'}
      detailSubItemBaseEndpoint={'/inventories/issuances'}
      printSubItemModalTitle={'Print Request for Quotation'}
      printSubItemBaseEndpoint={`/documents/${documentType}/prints`}
      printMainItemEnable={false}
      logSubItemModalTitle={'Inventory Issuance Logs'}
      subButtonLabel={'Issuances'}
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

export default InventoryIssuancesClient;
