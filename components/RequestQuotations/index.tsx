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
import { Badge } from '@mantine/core';

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
      id: 'rfq_no',
      label: 'RFQ No',
      width: '10%',
      sortable: true,
    },
    {
      id: 'rfq_date_formatted',
      label: 'RFQ Date',
      width: '10%',
      sortable: true,
    },
    {
      id: 'signed_type_formatted',
      label: 'Signed Type',
      width: '10%',
      sortable: true,
    },
    {
      id: 'supplier_name',
      label: 'Supplier',
      width: '15%',
      sortable: true,
    },
    {
      id: 'canvasser_names_formatted',
      label: 'Canvassers',
      width: '39%',
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

const RequestQuotationsClient = ({ user, permissions }: MainProps) => {
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

  const { data, isLoading, mutate } = useSWR<RequestQuotationsResponse>(
    [
      `/request-quotations`,
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
        rfqs,
        items,
        ..._data
      } = body;

      return {
        ..._data,
        pr_date_formatted: dayjs(body.pr_date).format('MM/DD/YYYY'),
        status_formatted: (
          <PurchaseRequestStatusClient
            size={lgScreenAndBelow ? 'xs' : 'md'}
            status={body.status}
          />
        ),
        section_name: section?.section_name ?? '-',
        funding_source_title: funding_source?.title ?? '-',
        requestor_fullname: body.requestor?.fullname ?? '-',
        cash_available_fullname: signatory_cash_available?.user?.fullname,
        approval_fullname: signatory_approval?.user?.fullname,
        purpose_formatted: Helper.shortenText(
          body.purpose ?? '-',
          lgScreenAndBelow ? 80 : 150
        ),
        rfqs,
        items,
        sub_body:
          rfqs?.map((subBody: RequestQuotationType) => {
            return {
              ...subBody,
              pr_no: body?.pr_no ?? '-',
              funding_source_title: funding_source?.title ?? '-',
              funding_source_location:
                funding_source?.location?.location_name ?? '-',
              rfq_date_formatted: dayjs(subBody.rfq_date).format('MM/DD/YYYY'),
              signed_type_formatted: subBody.signed_type
                ? subBody.signed_type.toUpperCase()
                : '-',
              supplier_name: subBody.supplier?.supplier_name ?? '-',
              supplier_address: subBody.supplier?.address ?? '-',
              canvasser_names: subBody.canvassers?.map(
                (canvasser, i) => canvasser.user?.fullname
              ),
              canvasser_names_formatted: (
                <>
                  {subBody.canvassers?.map((canvasser, i) => (
                    <Badge
                      mr={4}
                      variant={'light'}
                      color={'var(--mantine-color-primary-9)'}
                      key={i}
                      sx={{ cursor: 'pointer' }}
                    >
                      {canvasser.user?.fullname}
                    </Badge>
                  ))}
                </>
              ),
              status_formatted: (
                <StatusClient
                  size={lgScreenAndBelow ? 'xs' : 'md'}
                  status={subBody.status}
                />
              ),
              purpose: body.purpose ?? '-',
              approval_fullname: subBody.signatory_approval?.user?.fullname,
            };
          }) || [],
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: _data ?? [],
    }));
  }, [data, lgScreenAndBelow]);

  return (
    <DataTableClient
      mainModule={'pr'}
      subModule={'rfq'}
      user={user}
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
      showDetailsFirst
      autoCollapseSubItems={'all'}
      enableCreateSubItem
      enableUpdateSubItem
    />
  );
};

export default RequestQuotationsClient;
