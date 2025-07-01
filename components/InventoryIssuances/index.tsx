'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import { randomId, useDisclosure, useMediaQuery } from '@mantine/hooks';
import Helper from '@/utils/Helpers';
import PurchaseRequestStatusClient from '../PurchaseRequests/Status';
import StatusClient from './Status';
import { ActionIcon, Menu, Stack, Text } from '@mantine/core';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { Tooltip } from '@mantine/core';
import { IconLibrary } from '@tabler/icons-react';
import ActionsClient from './Actions';
import ActionModalClient from '../Generic/Modal/ActionModal';

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
      id: 'delivery_date_formatted',
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

const InventoryIssuancesClient = ({ user, permissions }: MainProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnSort, setColumnSort] = useState('po_no');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [documentType] = useState<SignatoryDocumentType>('po');
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
    if (Helper.empty(activeData?.moduleType) || Helper.empty(activeData?.data))
      return;

    const { display, moduleType, data } = activeData ?? {};
    const status = data?.status;
    let hasPrintPermission = false;
    let hasEditPermission = false;

    switch (moduleType) {
      case 'inv-issuance':
        hasPrintPermission = [
          'supply:*',
          ...getAllowedPermissions('inv-issuance', 'print'),
        ].some((permission) => permissions?.includes(permission));
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions('inv-issuance', 'update'),
        ].some((permission) => permissions?.includes(permission));

        setActiveDataPrintable(status !== 'cancelled' && hasPrintPermission);

        setActiveDataEditable(
          ['draft', 'pending', 'approved'].includes(status ?? '') &&
            hasEditPermission
        );

        if (display === 'create') {
          setActiveFormData({
            document_type: data?.other_params?.document_type,
          });
        } else {
          setActiveFormData(data);
        }
        break;

      default:
        break;
    }
  }, [activeData, permissions]);

  useEffect(() => {
    const poData = data?.data?.map((body: PurchaseOrderType) => {
      const { issuances, supplier, purchase_request, ...poData } = body;

      return {
        ...poData,
        funding_source_title: purchase_request?.funding_source?.title ?? '-',
        supplier_name: supplier?.supplier_name ?? '-',
        delivery_date_formatted: poData?.status_timestamps?.delivered_at
          ? dayjs(poData?.status_timestamps?.delivered_at).format('MM/DD/YYYY')
          : '-',
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
        })),
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: poData ?? [],
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
          setSearch(activeFormData?.id ?? '');
        }}
        requiresPayload={requiresPayload}
      >
        {children}
      </ActionModalClient>

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
        showPrint={activeDataPrintable}
        showEdit={activeDataEditable}
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
        updateModalFullscreen
        detailSubItemModalTitle={'Inventory Issuance Details'}
        detailSubItemBaseEndpoint={'/inventories/issuances'}
        printSubItemModalTitle={'Print Request for Quotation'}
        printSubItemBaseEndpoint={`/documents/${documentType}/prints`}
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

export default InventoryIssuancesClient;
