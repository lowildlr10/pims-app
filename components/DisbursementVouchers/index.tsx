'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import StatusClient from './Status';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Helper from '@/utils/Helpers';
import { Group, Text, Tooltip } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { IconLibrary, IconMessageExclamation } from '@tabler/icons-react';
import { Menu } from '@mantine/core';
import ActionsClient from './Actions';
import ActionModalClient from '../Generic/Modal/ActionModal';

const MAIN_MODULE: ModuleType = 'dv';

const DETAIL_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Disbursement Voucher Details',
    endpoint: '/disbursement-vouchers',
    base_url: '/procurement/dv',
  },
  fullscreen: true,
};

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'dv_no',
      label: 'DV No',
      width: '12%',
      sortable: true,
    },
    {
      id: 'po_no',
      label: 'PO No',
      width: '12%',
      sortable: true,
    },
    {
      id: 'explanation_formatted',
      label: 'Explanation',
      width: '44%',
      sortable: true,
    },
    {
      id: 'payee_name',
      label: 'Payee',
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

const DisbursementVouchersClient = ({ user, permissions }: MainProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('dv_no');
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

  const { data, isLoading, mutate } = useSWR<DisbursementVoucherResponse>(
    [
      `/disbursement-vouchers`,
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
          setActiveFormData(undefined);
        } else {
          setActiveFormData(data);
        }
        break;

      default:
        break;
    }
  }, [activeData]);

  useEffect(() => {
    const obrData = data?.data?.map((body: DisbursementVoucherType) => {
      const { purchase_order, payee, ...obrData } = body;

      return {
        ...obrData,
        status_formatted: (
          <StatusClient
            size={lgScreenAndBelow ? 'xs' : 'md'}
            status={body.status}
          />
        ),
        po_no: purchase_order?.po_no ?? '-',
        explanation_formatted: body.explanation ? (
          Helper.shortenText(body.explanation, lgScreenAndBelow ? 80 : 150)
        ) : (
          <Group gap={3}>
            <IconMessageExclamation
              color={'var(--mantine-color-red-7)'}
              size={lgScreenAndBelow ? 16 : 18}
            />
            <Text
              size={lgScreenAndBelow ? 'xs' : 'sm'}
              c={'var(--mantine-color-red-7)'}
            >
              Explanation not provided...
            </Text>
          </Group>
        ),
        payee_name: body.payee?.supplier_name ?? '-',
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
                poId={body.purchase_order_id ?? ''}
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
      body: obrData ?? [],
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
          // setSearch(activeData?.data?.id ?? activeFormData?.id ?? '');
        }}
        requiresPayload={requiresPayload}
      >
        {children}
      </ActionModalClient>

      <DataTableClient
        mainModule={MAIN_MODULE}
        permissions={permissions}
        columnSort={columnSort}
        sortDirection={sortDirection}
        search={search}
        showSearch
        defaultModalOnClick={'details'}
        detailItemData={DETAIL_ITEM_CONFIG}
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

export default DisbursementVouchersClient;
