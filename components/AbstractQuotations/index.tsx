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
      id: 'solicitation_no',
      label: 'Solicitation No',
      width: '10%',
      sortable: true,
    },
    {
      id: 'solicitation_date_formatted',
      label: 'Solicitation Date',
      width: '10%',
      sortable: true,
    },
    {
      id: 'abstract_no',
      label: 'Abstract No',
      width: '10%',
      sortable: true,
    },
    {
      id: 'opened_on_formatted',
      label: 'Opened On',
      width: '10%',
      sortable: true,
    },
    {
      id: 'procurement_mode_name',
      label: 'Mode of Procurement',
      width: '14%',
      sortable: false,
    },
    {
      id: 'bac_action_formatted',
      label: 'BAC Action',
      width: '30%',
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

const AbstractQuotationsClient = ({ user, permissions }: MainProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('pr_no');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [documentType] = useState<SignatoryDocumentType>('pr');
  const [subDocumentType] = useState<SignatoryDocumentType>('aoq');
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const { data, isLoading, mutate } = useSWR<AbstractQuotationsResponse>(
    [
      `/abstract-quotations`,
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
      const { section, funding_source, requestor, aoqs, ...prData } = body;

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
          aoqs?.map((subBody: AbstractQuotationType) => {
            return {
              ...subBody,
              // bids_awards_committee_name:
              //   subBody.bids_awards_committee?.committee_name ?? '-',
              procurement_mode_name: subBody.mode_procurement?.mode_name ?? '-',
              solicitation_date_formatted: dayjs(
                subBody.solicitation_date
              ).format('MM/DD/YYYY'),
              opened_on_formatted: subBody.opened_on
                ? dayjs(subBody.opened_on).format('MM/DD/YYYY')
                : '-',
              bac_action_formatted: Helper.shortenText(
                subBody.bac_action ?? '-',
                lgScreenAndBelow ? 80 : 150
              ),
              status_formatted: (
                <StatusClient
                  size={lgScreenAndBelow ? 'xs' : 'md'}
                  status={subBody.status}
                />
              ),
              // purpose: body.purpose ?? '-',
              // twg_chairperson_fullname:
              //   subBody.signatory_twg_chairperson?.user?.fullname ?? '-',
              // twg_member_1_fullname:
              //   subBody.signatory_twg_member_1?.user?.fullname ?? '-',
              // twg_member_2_fullname:
              //   subBody.signatory_twg_member_2?.user?.fullname ?? '-',
              // chairman_fullname:
              //   subBody.signatory_chairman?.user?.fullname ?? '-',
              // vice_chairman_fullname:
              //   subBody.signatory_vice_chairman?.user?.fullname ?? '-',
              // member_1_fullname:
              //   subBody.signatory_member_1?.user?.fullname ?? '-',
              // member_2_fullname:
              //   subBody.signatory_member_2?.user?.fullname ?? '-',
              // member_3_fullname:
              //   subBody.signatory_member_2?.user?.fullname ?? '-',
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
      subModule={'aoq'}
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
      createSubItemModalTitle={'Create Abstract of Bids and Quotation'}
      createSubItemEndpoint={'/abstract-quotations'}
      createModalFullscreen
      updateMainItemModalTitle={'Update Purchase Request'}
      updateMainItemBaseEndpoint={'/purchase-requests'}
      updateSubItemModalTitle={'Update Abstract of Bids and Quotation'}
      updateSubItemBaseEndpoint={'/abstract-quotations'}
      updateModalFullscreen
      detailMainItemModalTitle={'Purchase Request Details'}
      detailMainItemBaseEndpoint={'/purchase-requests'}
      detailSubItemModalTitle={'Abstract of Bids and Quotation Details'}
      detailSubItemBaseEndpoint={'/abstract-quotations'}
      printMainItemModalTitle={'Print Purchase Request'}
      printMainItemBaseEndpoint={`/documents/${documentType}/prints`}
      printSubItemModalTitle={'Print Abstract of Bids and Quotation'}
      printSubItemBaseEndpoint={`/documents/${subDocumentType}/prints`}
      logMainItemModalTitle={'Purchase Request Logs'}
      logSubItemModalTitle={'Abstract of Bids and Quotation Logs'}
      subButtonLabel={'Abstracts'}
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

export default AbstractQuotationsClient;
