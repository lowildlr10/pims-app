'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import { useMediaQuery } from '@mantine/hooks';
import StatusClient from './Status';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'iar_no',
      label: 'IAR No',
      width: '14%',
      sortable: true,
    },
    {
      id: 'iar_date_formatted',
      label: 'IAR Date',
      width: '10%',
      sortable: true,
    },
    {
      id: 'po_no',
      label: 'PO/JO No',
      width: '14%',
      sortable: true,
    },
    {
      id: 'supplier',
      label: 'Supplier',
      width: '30%',
      sortable: true,
    },
    {
      id: 'signatory_inspection',
      label: 'Inspected By',
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

const InspectionAcceptanceReportsClient = ({
  user,
  permissions,
}: MainProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('iar_no');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [documentType] = useState<SignatoryDocumentType>('iar');
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const { data, isLoading, mutate } =
    useSWR<InspectionAcceptanceReportResponse>(
      [
        `/inspection-acceptance-reports`,
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
    const iarData = data?.data?.map((body: InspectionAcceptanceReportType) => {
      const {
        purchase_order: purchaseOrder,
        supplier,
        signatory_inspection: inspectedBy,
        ...iarData
      } = body;

      return {
        ...iarData,
        po_no: purchaseOrder?.po_no ?? '-',
        iar_date_formatted: body.iar_date
          ? dayjs(body.iar_date).format('MM/DD/YYYY')
          : '-',
        supplier: supplier?.supplier_name ?? '-',
        signatory_inspection: inspectedBy?.user?.fullname ?? '-',
        status_formatted: (
          <StatusClient
            size={lgScreenAndBelow ? 'xs' : 'md'}
            status={body.status}
          />
        ),
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: iarData ?? [],
    }));
  }, [data, lgScreenAndBelow]);

  return (
    <DataTableClient
      mainModule={'iar'}
      user={user}
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      showSearch
      defaultModalOnClick={'details'}
      createMainItemModalTitle={'Create Inspection and Acceptance Report'}
      createMainItemEndpoint={'/inspection-acceptance-reports'}
      createModalFullscreen
      updateMainItemModalTitle={'Update Inspection and Acceptance Report'}
      updateMainItemBaseEndpoint={'/inspection-acceptance-reports'}
      updateModalFullscreen
      detailMainItemModalTitle={'Inspection and Acceptance Report Details'}
      detailMainItemBaseEndpoint={'/inspection-acceptance-reports'}
      printMainItemModalTitle={'Inspection and Acceptance Report'}
      printMainItemBaseEndpoint={`/documents/${documentType}/prints`}
      printSubItemDefaultPaper={'A4'}
      logMainItemModalTitle={'Inspection and Acceptance Report Logs'}
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

export default InspectionAcceptanceReportsClient;
