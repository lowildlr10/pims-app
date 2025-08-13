'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import StatusClient from './Status';
import Helper from '@/utils/Helpers';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import ActionsClient from './Actions';
import { ActionIcon, Menu, Tooltip } from '@mantine/core';
import { IconLibrary } from '@tabler/icons-react';
import ActionModalClient from '../Generic/Modal/ActionModal';

const MAIN_MODULE: ModuleType = 'iar';

const DETAIL_ITEM_CONFIG: CreateUpdateDetailItemTableType = {
  main: {
    title: 'Inspection and Acceptance Report Details',
    endpoint: '/inspection-acceptance-reports',
    base_url: '/procurement/iar',
  },
  fullscreen: true,
};

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
      label: 'PO No',
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

const InspectionAcceptanceReportsClient = ({
  user,
  permissions,
}: MainProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [columnSort, setColumnSort] = useState('iar_no');
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

      default:
        break;
    }
  }, [activeData]);

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
                documentType={purchaseOrder?.document_type ?? 'po'}
                handleOpenActionModal={handleOpenActionModal}
              />
            </Menu.Dropdown>
          </Menu>
        ),
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: iarData ?? [],
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

export default InspectionAcceptanceReportsClient;
