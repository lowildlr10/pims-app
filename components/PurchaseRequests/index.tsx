'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import StatusClient from './Status';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Helper from '@/utils/Helpers';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { Tooltip } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { IconLibrary } from '@tabler/icons-react';
import { Menu } from '@mantine/core';
import ActionsClient from './Actions';
import ActionModalClient from '../Generic/Modal/ActionModal';

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

  const [activeFormData, setActiveFormData] = useState<FormDataType>();
  const [activeData, setActiveData] = useState<ActiveDataType>();
  const [activeDataPrintable, setActiveDataPrintable] = useState(false);
  const [activeDataEditable, setActiveDataEditable] = useState(false);

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
    if (Helper.empty(activeData?.moduleType) || Helper.empty(activeData?.data))
      return;

    const { display, moduleType, data } = activeData ?? {};
    const status = data?.status;
    let hasPrintPermission = false;
    let hasEditPermission = false;

    switch (moduleType) {
      case 'pr':
        hasPrintPermission = [
          'supply:*',
          ...getAllowedPermissions('pr', 'print'),
        ].some((permission) => permissions?.includes(permission));
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions('pr', 'update'),
        ].some((permission) => permissions?.includes(permission));

        setActiveDataPrintable(status !== 'cancelled' && hasPrintPermission);

        setActiveDataEditable(
          [
            'draft',
            'disapproved',
            'pending',
            'approved_cash_available',
            'approved',
          ].includes(status ?? '') && hasEditPermission
        );

        if (display === 'create') {
          setActiveFormData(undefined);
        } else {
          setActiveFormData(data);
        }
        break;

      default:
        break;
    }
  }, [activeData, permissions]);

  useEffect(() => {
    const prData = data?.data?.map((body: PurchaseRequestType) => {
      const { funding_source, requestor, ...prData } = body;

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
              <ActionsClient
                permissions={permissions ?? []}
                id={body.id ?? ''}
                status={body.status ?? 'draft'}
                handleOpenActionModal={handleOpenActionModal}
              />
            </Menu.Dropdown>
          </Menu>
        ),
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: prData ?? [],
    }));
  }, [data, lgScreenAndBelow, permissions]);

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
          setSearch(activeFormData?.id ?? '');
        }}
        requiresPayload={requiresPayload}
      >
        {children}
      </ActionModalClient>

      <DataTableClient
        mainModule={'pr'}
        user={user}
        permissions={permissions}
        columnSort={columnSort}
        sortDirection={sortDirection}
        search={search}
        showSearch
        showCreate
        showPrint={activeDataPrintable}
        showEdit={activeDataEditable}
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

export default PurchaseRequestsClient;
