'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Helper from '@/utils/Helpers';
import PurchaseRequestStatusClient from '../PurchaseRequests/Status';
import StatusClient from './Status';
import { ActionIcon, Badge, Menu, Tooltip } from '@mantine/core';
import ActionModalClient from '../Generic/Modal/ActionModal';
import { IconLibrary } from '@tabler/icons-react';
import PurchaseRequestActionsClient from '../PurchaseRequests/Actions';
import ActionsClient from './Actions';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const MAIN_MODULE: ModuleType = 'pr';
const SUB_MODULE: ModuleType = 'rfq';

const DETAIL_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Purchase Request Details',
    endpoint: '/purchase-requests',
    base_url: '/procurement/pr',
  },
  sub: {
    title: 'Request for Quotation Details',
    endpoint: '/request-quotations',
    base_url: '/procurement/rfq',
  },
  fullscreen: true,
};

const PRINT_ITEM_CONFIG: PrintItemTableType = {
  main: {
    title: 'Print Purchase Request',
    endpoint: `/documents/${MAIN_MODULE}/prints`,
  },
  sub: {
    title: 'Print Request for Quotation',
    endpoint: `/documents/${SUB_MODULE}/prints`,
  },
};

const LOG_ITEM_CONFIG: LogItemTableType = {
  main: {
    title: 'Purchase Request Logs',
  },
  sub: {
    title: 'Request for Quotation Logs',
  },
};

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
      width: '14%',
      sortable: true,
    },
    {
      id: 'action',
      label: '',
      width: '2%',
      clickable: false,
    },
    {
      id: 'show-items',
      label: '',
      width: '2%',
    },
  ],
  subHead: [
    {
      id: 'batch',
      label: 'Batch',
      width: '8%',
      sortable: true,
    },
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
      width: '31%',
      sortable: false,
    },
    {
      id: 'status_formatted',
      label: 'Status',
      width: '14%',
      sortable: true,
    },
    {
      id: 'action',
      label: '',
      width: '2%',
      clickable: false,
    },
  ],
  body: [],
};

const RequestQuotationsClient = ({ user, permissions }: MainProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('pr_no');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const [activeFormData, setActiveFormData] = useState<FormDataType>();
  const [activeData, setActiveData] = useState<ActiveDataType>();

  const [actionType, setActionType] = useState<ActionType>();
  const [title, setTitle] = useState('');
  const [children, setChildren] = useState<React.ReactNode>();
  const [color, setColor] = useState('var(--mantine-color-primary-9)');
  const [buttonLabel, setButtonLabel] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [redirect, setRedirect] = useState<string>();
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  const [fullScreen, setFullScreen] = useState<boolean>();
  const [requiresPayload, setRequiresPayload] = useState<boolean>();
  const [
    actionModalOpened,
    { open: openActionModal, close: closeActionModal },
  ] = useDisclosure(false);
  const [showCreateSubItem, setShowCreateSubItem] = useState(false);

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
    if (Helper.empty(activeData?.moduleType) || Helper.empty(activeData?.data))
      return;

    const { display, moduleType, data } = activeData ?? {};

    switch (moduleType) {
      case MAIN_MODULE:
        if (display === 'create') {
        } else {
          setActiveFormData(data);
        }
        break;

      case SUB_MODULE:
        if (display === 'create') {
          setActiveFormData({
            purchase_request_id: data?.parent_id ?? undefined,
            purpose: data?.parent_body?.purpose,
            pr_no: data?.parent_body?.pr_no,
          });
        } else {
          setActiveFormData(data);
        }
        break;

      default:
        break;
    }
  }, [activeData]);

  useEffect(() => {
    setShowCreateSubItem(
      ['supply:*', ...getAllowedPermissions(SUB_MODULE, 'create')].some(
        (permission) => permissions?.includes(permission)
      )
    );
  }, [permissions]);

  useEffect(() => {
    const prData = data?.data?.map((body: PurchaseRequestType) => {
      const { section, funding_source, requestor, rfqs, ...prData } = body;

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
        action: (
          <Menu
            position={'left-start'}
            offset={6}
            shadow={'md'}
            width={400}
            withArrow
          >
            <Menu.Target>
              <Tooltip label={'Quick Action'}>
                <ActionIcon
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  color={'var(--mantine-color-primary-7)'}
                >
                  <IconLibrary size={lgScreenAndBelow ? 14 : 16} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Quick Actions</Menu.Label>
              <PurchaseRequestActionsClient
                permissions={permissions ?? []}
                id={body.id ?? ''}
                status={body.status ?? 'draft'}
                handleOpenActionModal={handleOpenActionModal}
              />
            </Menu.Dropdown>
          </Menu>
        ),
        sub_body:
          rfqs?.map((subBody: RequestQuotationType) => {
            return {
              ...subBody,
              rfq_date_formatted: dayjs(subBody.rfq_date).format('MM/DD/YYYY'),
              signed_type_formatted: subBody.signed_type
                ? subBody.signed_type.toUpperCase()
                : '-',
              supplier_name: subBody.supplier?.supplier_name ?? '-',
              canvasser_names_formatted: (
                <>
                  {subBody?.canvassers && subBody?.canvassers?.length > 0 ? (
                    subBody.canvassers?.map((canvasser, i) => (
                      <Badge
                        mr={4}
                        variant={'light'}
                        color={'var(--mantine-color-primary-9)'}
                        key={i}
                        sx={{ cursor: 'pointer' }}
                      >
                        {canvasser.user?.fullname}
                      </Badge>
                    ))
                  ) : (
                    <>-</>
                  )}
                </>
              ),
              status_formatted: (
                <StatusClient
                  size={lgScreenAndBelow ? 'xs' : 'md'}
                  status={subBody.status}
                />
              ),
              action: (
                <Menu
                  position={'left-start'}
                  offset={6}
                  shadow={'md'}
                  width={400}
                  withArrow
                >
                  <Menu.Target>
                    <Tooltip label={'Quick Action'}>
                      <ActionIcon
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        color={'var(--mantine-color-secondary-7)'}
                      >
                        <IconLibrary size={lgScreenAndBelow ? 14 : 16} />
                      </ActionIcon>
                    </Tooltip>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Quick Actions</Menu.Label>
                    <ActionsClient
                      permissions={permissions ?? []}
                      id={subBody.id ?? ''}
                      status={subBody.status ?? 'draft'}
                      handleOpenActionModal={handleOpenActionModal}
                    />
                  </Menu.Dropdown>
                </Menu>
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

  const handleOpenActionModal = (
    actionType: ActionType,
    title: string,
    children: React.ReactNode,
    color: string,
    buttonLabel: string,
    endpoint: string,
    redirect?: string,
    requiresPayload?: boolean,
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    fullScreen?: boolean
  ) => {
    setActionType(actionType);
    setTitle(title);
    setChildren(children);
    setColor(color);
    setButtonLabel(buttonLabel);
    setEndpoint(endpoint);
    setRedirect(redirect);
    setRequiresPayload(requiresPayload);
    setSize(size);
    setFullScreen(fullScreen);

    openActionModal();
  };

  return (
    <>
      <ActionModalClient
        title={title}
        color={color}
        actionType={actionType}
        buttonLabel={buttonLabel}
        endpoint={endpoint}
        redirect={redirect}
        size={size}
        fullScreen={fullScreen}
        opened={actionModalOpened}
        close={closeActionModal}
        updateTable={() => {
          mutate();
          // setSearch(activeFormData?.id ?? '');
        }}
        requiresPayload={requiresPayload}
      >
        {children}
      </ActionModalClient>

      <DataTableClient
        mainModule={MAIN_MODULE}
        subModule={SUB_MODULE}
        permissions={permissions}
        columnSort={columnSort}
        sortDirection={sortDirection}
        search={search}
        showSearch
        defaultModalOnClick={'details'}
        showCreateSubItem={showCreateSubItem}
        subItemsClickable
        detailItemData={DETAIL_ITEM_CONFIG}
        subButtonLabel={'RFQs'}
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
    </>
  );
};

export default RequestQuotationsClient;
