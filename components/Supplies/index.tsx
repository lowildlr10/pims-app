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
import { NumberFormatter, Text } from '@mantine/core';

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
      id: 'show-supplies',
      label: '',
      width: '2%',
    },
  ],
  subHead: [
    {
      id: 'created_date',
      label: 'Creation Date',
      width: '14%',
      sortable: true,
    },
    {
      id: 'description_formatted',
      label: 'Title',
      width: '22%',
      sortable: true,
    },
    {
      id: 'unit_issue_name',
      label: 'Unit',
      width: '10%',
      sortable: true,
    },
    {
      id: 'item_classification_name',
      label: 'Classification',
      width: '15%',
      sortable: true,
    },
    {
      id: 'required_document_formatted',
      label: 'Required Document',
      width: '15%',
      sortable: true,
    },
    {
      id: 'quantity',
      label: 'Quantity',
      width: '12%',
      sortable: false,
    },
    {
      id: 'available',
      label: 'Available',
      width: '12%',
      sortable: false,
    },
  ],
  body: [],
};

const SuppliesClient = ({ user, permissions }: MainProps) => {
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

  const { data, isLoading, mutate } = useSWR<SuppliesResponse>(
    [
      `/inventories/supplies`,
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
      const { supplies, supplier, purchase_request, ...poData } = body;

      return {
        ...poData,
        funding_source_title: purchase_request?.funding_source?.title ?? '-',
        supplier_name: supplier?.supplier_name ?? '-',
        delivery_date: dayjs(poData.status_timestamps.delivered_at).format(
          'MM/DD/YYYY'
        ),
        sub_body: supplies?.map((subBody: SupplyType) => {
          const description = Helper.formatTextWithWhitespace(
            subBody?.description ?? '-'
          ).map((line, i) => (
            <React.Fragment key={randomId()}>
              {line.replace(/\t/g, '\u00a0\u00a0\u00a0\u00a0')}
              <br />
            </React.Fragment>
          ));

          return {
            ...subBody,
            description_formatted: <>{description}</>,
            unit_issue_name: subBody.unit_issue?.unit_name ?? '-',
            item_classification_name:
              subBody.item_classification?.classification_name ?? '-',
            required_document_formatted: Helper.mapInventoryIssuanceType(
              subBody.required_document
            ),
            created_date: dayjs(subBody.created_at).format('MM/DD/YYYY'),
          };
        }),
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
      subModule={'inv-supply'}
      user={user}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      defaultModalOnClick={'details'}
      subItemsClickable
      updateSubItemModalTitle={'Update Inventory Supply'}
      updateSubItemBaseEndpoint={'/inventories/supplies'}
      updateMainItemEnable={false}
      updateModalFullscreen
      detailMainItemModalTitle={'Purchase Order Details'}
      detailMainItemBaseEndpoint={'/purchase-orders'}
      detailSubItemModalTitle={'Inventory Supply Details'}
      detailSubItemBaseEndpoint={'/inventories/supplies'}
      printMainItemModalTitle={'Print Purchase Order'}
      printMainItemBaseEndpoint={`/documents/${documentType}/prints`}
      printMainItemEnable={false}
      printSubItemEnable={false}
      logMainItemModalTitle={'Purchase/Job Order Logs'}
      logSubItemModalTitle={'Inventory Supply Logs'}
      subButtonLabel={'Supplies'}
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

export default SuppliesClient;
