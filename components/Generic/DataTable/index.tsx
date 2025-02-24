'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  Button,
  Collapse,
  Modal,
  ScrollArea,
  Skeleton,
  Stack,
  Table,
  Tooltip,
  useModalsStack,
} from '@mantine/core';
import {
  IconArrowDown,
  IconArrowUp,
  IconPlus,
  IconSortAscending2Filled,
  IconSortDescending2Filled,
} from '@tabler/icons-react';
import DataTablePaginationClient from './DataTablePaginations';
import DataTableActionsClient from './DataTableActions';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import UpdateModalClient from '../Modal/UpdateModal';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import CreateModalClient from '../Modal/CreateModal';
import DetailModalClient from '../Modal/DetailModal';
import PrintModalClient from '../Modal/PrintModal';
import LogModalClient from '../Modal/LogModal';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const DataTableClient = ({
  mainModule,
  subModule,
  user,
  permissions,
  columnSort,
  sortDirection,
  search,
  enableCreateSubItem,
  enableUpdateSubItem,
  itemsClickable = true,
  showSearch,
  showCreate,
  showDetailsFirst,
  autoCollapseSubItems = 'first',
  data,
  perPage,
  loading,
  page,
  lastPage,
  from,
  to,
  total,
  refreshData,
  onChange,
}: DataTableProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');

  const [collapseStates, setCollapseStates] = useState<CollapseType>({});
  const [tableBody, setTableBody] = useState<any>(data?.body);
  const [hasSubBody, setHasSubBody] = useState(false);
  const [tableSearch, setTableSearch] = useState(search);
  const [tablePage, setTablePage] = useState(page);
  const [tablePerPage, setTablePerPage] = useState(perPage);
  const [tableColumnSort, setTableColumnSort] = useState(columnSort);
  const [tableSortDirection, setTableSortDirection] = useState(sortDirection);

  const [formData, setFormData] = useState<any>();

  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);
  const [currentId, setCurrentId] = useState<string>();
  const [currentOpenedModuleType, setCurrentOpenedModuleType] = useState<
    'main' | 'sub'
  >();

  const [createModalTitle, setCreateModalTitle] = useState('Create');
  const [createEndpoint, setCreateEndpoint] = useState('');
  const [createModalFullscreen, setCreateModalFullscreen] = useState(false);
  const [currentCreateModule, setCurrentCreateModule] = useState<ModuleType>();

  const [
    updateModalOpened,
    { open: openUpdateModal, close: closeUpdateModal },
  ] = useDisclosure(false);
  const [updateModalTitle, setUpdateModalTitle] = useState('Update');
  const [updateEndpoint, setUpdateEndpoint] = useState('');
  const [updateModalFullscreen, setUpdateModalFullscreen] = useState(false);
  const [currentUpdateModule, setCurrentUpdateModule] = useState<ModuleType>();

  const [detailModalTitle, setDetailModalTitle] = useState('Details');
  const [currentDetailModule, setCurrentDetailModule] = useState<ModuleType>();
  const [detailModalShowPrint, setDetailModalShowPrint] = useState(false);
  const [detailModalShowEdit, setDetailModalShowEdit] = useState(false);

  const [printModalTitle, setPrintModalTitle] = useState('Print');
  const [printEndpoint, setPrintEndpoint] = useState('');
  const [printDefaultPaper, setPrintDefaultPaper] = useState('');

  const [logModalTitle, setLogModalTitle] = useState('Document Logs');
  const [logEndpoint, setLogEndpoint] = useState('');

  const [subButtonLabel, setSubButtonLabel] = useState('');

  const stack = useModalsStack([
    'detail-modal',
    'print-modal',
    'update-modal',
    'log-modal',
  ]);

  useEffect(() => {
    const search = searchParams.get('search');

    if (search) {
      setTableSearch(search);
      replace(pathname);
    }
  }, []);

  useEffect(() => {
    if (currentOpenedModuleType === 'sub' && currentId) {
      const parentBody = data?.body?.find((body: any) =>
        body?.sub_body.some((subBody: any) => subBody.id === currentId)
      );
      setFormData(
        parentBody?.sub_body.find((subBody: any) => subBody.id === currentId)
      );
      return;
    }

    if (currentOpenedModuleType === 'main' && currentId) {
      setFormData(data?.body?.find((form: any) => form.id === currentId));
      return;
    }
  }, [data, currentId, currentOpenedModuleType]);

  useEffect(() => {
    data.body?.forEach((body: any) => {
      if (body?.sub_body?.length > 0) setHasSubBody(true);
    });

    if (autoCollapseSubItems === 'first') {
      setCollapseStates({
        [data?.body[0]?.id as string]: true,
      });
    } else if (autoCollapseSubItems === 'all') {
      setCollapseStates(
        data?.body?.reduce((acc: any, item: any) => {
          acc[item?.id] = true;
          return acc;
        }, {})
      );
    }

    setTableBody(data?.body);
  }, [data]);

  useEffect(() => {
    if (onChange)
      onChange(
        tableSearch,
        tablePage,
        tablePerPage,
        tableColumnSort,
        tableSortDirection
      );
  }, [
    tableSearch,
    tablePage,
    tablePerPage,
    tableColumnSort,
    tableSortDirection,
  ]);

  useEffect(() => {
    if (!mainModule) return;

    switch (mainModule) {
      case 'account-division':
        setSubButtonLabel('Sections');
        break;

      case 'lib-signatory':
        setSubButtonLabel('Details');
        break;

      case 'pr':
        if (subModule === 'rfq') {
          setSubButtonLabel('RFQs');
        } else {
          setSubButtonLabel('Items');
        }
        break;

      default:
        break;
    }
  }, [mainModule]);

  const handleToggleCollapse = (id: string | undefined) => {
    if (!id) return;

    setCollapseStates({
      ...collapseStates,
      [id]: !collapseStates[id],
    });
  };

  const handleUpdateTable = (
    id: string | null,
    payload: any,
    isSubBody?: boolean
  ) => {
    setTableBody((prev: any[]) =>
      prev.map((row: any) => {
        if (id) {
          if (isSubBody) {
            return row.id === payload.division_id
              ? {
                  ...row,
                  sub_body: row.sub_body.map((subRow: any) =>
                    subRow.id === id ? { ...subRow, ...payload } : subRow
                  ),
                }
              : row;
          } else {
            return row.id === id ? { ...row, ...payload } : row;
          }
        } else {
          const newRow = { id: new Date().toISOString(), ...payload };
          if (isSubBody) {
            return row.id === payload.division_id
              ? { ...row, sub_body: [...row.sub_body, newRow] }
              : row;
          }
          return [...prev, newRow];
        }
      })
    );

    if (refreshData) refreshData({ ...tableBody, payload });

    setTableSearch(id ?? '');
  };

  const handleOpenCreateModal = (
    parentId: string | null,
    moduleType: ModuleType | null
  ) => {
    setCurrentCreateModule(moduleType ?? undefined);

    switch (moduleType) {
      case 'account-division':
        setCreateModalTitle('Create Division');
        setCreateEndpoint('/accounts/divisions');
        break;
      case 'account-section':
        setFormData({ division_id: parentId });
        setCreateModalTitle('Add Section');
        setCreateEndpoint('/accounts/sections');
        break;
      case 'account-role':
        setCreateModalTitle('Create Role');
        setCreateEndpoint('/accounts/roles');
        break;
      case 'account-user':
        setCreateModalTitle('Create User');
        setCreateEndpoint('/accounts/users');
        setCreateModalFullscreen(false);
        break;
      case 'lib-bid-committee':
        setCreateModalTitle('Create Bids and Awards Committee');
        setCreateEndpoint('/libraries/bids-awards-committees');
        break;
      case 'lib-fund-source':
        setCreateModalTitle('Create Funding Source/Project');
        setCreateEndpoint('/libraries/funding-sources');
        break;
      case 'lib-item-class':
        setCreateModalTitle('Create Item Classification');
        setCreateEndpoint('/libraries/item-classifications');
        break;
      case 'lib-mfo-pap':
        setCreateModalTitle('Create MFO/PAP');
        setCreateEndpoint('/libraries/mfo-paps');
        break;
      case 'lib-mode-proc':
        setCreateModalTitle('Create Mode Procurement');
        setCreateEndpoint('/libraries/procurement-modes');
        break;
      case 'lib-paper-size':
        setCreateModalTitle('Create Paper Size');
        setCreateEndpoint('/libraries/paper-sizes');
        break;
      case 'lib-responsibility-center':
        setCreateModalTitle('Create Responsibility Center');
        setCreateEndpoint('/libraries/responsibility-centers');
        break;
      case 'lib-signatory':
        setCreateModalTitle('Create Signatory');
        setCreateEndpoint('/libraries/signatories');
        break;
      case 'lib-supplier':
        setCreateModalTitle('Create Supplier');
        setCreateEndpoint('/libraries/suppliers');
        break;
      case 'lib-uacs-class':
        setCreateModalTitle('Create UACS Code Classification');
        setCreateEndpoint('/libraries/uacs-code-classifications');
        break;
      case 'lib-uacs-code':
        setCreateModalTitle('Create UACS Code');
        setCreateEndpoint('/libraries/uacs-codes');
        break;
      case 'lib-unit-issue':
        setCreateModalTitle('Create Unit of Issue');
        setCreateEndpoint('/libraries/unit-issues');
        break;
      case 'pr':
        setCreateModalTitle('Create Purchase Request');
        setCreateEndpoint('/purchase-requests');
        setCreateModalFullscreen(true);
        break;
      case 'rfq':
        const parentBody = data?.body?.find(
          (form: any) => form.id === parentId
        );
        const items =
          parentBody.items?.map((item: PurchaseRequestItemType) => ({
            pr_item_id: item.id,
            brand_model: '',
            unit_cost: undefined,
            total_cost: undefined,
            pr_item: {
              stock_no: item.stock_no,
              quantity: item.quantity,
              description: item.description,
            },
          })) ?? [];

        setFormData({
          purchase_request_id: parentId,
          items,
          purpose: parentBody?.purpose,
          pr_no: parentBody?.pr_no,
          funding_source_title: parentBody?.funding_source_title,
          funding_source_location: parentBody?.funding_source_location,
        });
        setCreateModalTitle('Create Request for Quotation');
        setCreateEndpoint('/request-quotations');
        setCreateModalFullscreen(true);
        break;
      default:
        break;
    }

    openCreateModal();
  };

  const handleOpenUpdateModal = (id: string, moduleType: ModuleType | null) => {
    setFormData(tableBody?.find((form: any) => form.id === id));
    setCurrentUpdateModule(moduleType ?? undefined);

    switch (moduleType) {
      case 'account-division':
        setUpdateEndpoint(`/accounts/divisions/${id}`);
        setUpdateModalTitle('Update Division');
        break;
      case 'account-section':
        const parentBody = tableBody?.find((body: any) =>
          body?.sub_body.some((subBody: any) => subBody.id === id)
        );
        setUpdateEndpoint(`/accounts/sections/${id}`);
        setUpdateModalTitle('Update Section');
        setFormData(
          parentBody?.sub_body.find((subBody: any) => subBody.id === id)
        );
        break;
      case 'account-role':
        setUpdateEndpoint(`/accounts/roles/${id}`);
        setUpdateModalTitle('Update Role');
        break;
      case 'account-user':
        setUpdateEndpoint(`/accounts/users/${id}`);
        setUpdateModalTitle('Update User');
        setUpdateModalFullscreen(false);
        break;
      case 'lib-bid-committee':
        setUpdateModalTitle('Update Bids and Awards Committee');
        setUpdateEndpoint(`/libraries/bids-awards-committees/${id}`);
        break;
      case 'lib-fund-source':
        setUpdateModalTitle('Update Funding Source/Project');
        setUpdateEndpoint(`/libraries/funding-sources/${id}`);
        break;
      case 'lib-item-class':
        setUpdateModalTitle('Update Item Classification');
        setUpdateEndpoint(`/libraries/item-classifications/${id}`);
        break;
      case 'lib-mfo-pap':
        setUpdateModalTitle('Update MFO/PAP');
        setUpdateEndpoint(`/libraries/mfo-paps/${id}`);
        break;
      case 'lib-mode-proc':
        setUpdateModalTitle('Update Mode Procurement');
        setUpdateEndpoint(`/libraries/procurement-modes/${id}`);
        break;
      case 'lib-paper-size':
        setUpdateModalTitle('Update Paper Size');
        setUpdateEndpoint(`/libraries/paper-sizes/${id}`);
        break;
      case 'lib-responsibility-center':
        setUpdateModalTitle('Update Responsibility Center');
        setUpdateEndpoint(`/libraries/responsibility-centers/${id}`);
        break;
      case 'lib-signatory':
        setUpdateModalTitle('Update Signatory');
        setUpdateEndpoint(`/libraries/signatories/${id}`);
        break;
      case 'lib-supplier':
        setUpdateModalTitle('Update Supplier');
        setUpdateEndpoint(`/libraries/suppliers/${id}`);
        break;
      case 'lib-uacs-class':
        setUpdateModalTitle('Update UACS Code Classification');
        setUpdateEndpoint(`/libraries/uacs-code-classifications/${id}`);
        break;
      case 'lib-uacs-code':
        setUpdateModalTitle('Update UACS Code');
        setUpdateEndpoint(`/libraries/uacs-codes/${id}`);
        break;
      case 'lib-unit-issue':
        setUpdateModalTitle('Update Unit of Issue');
        setUpdateEndpoint(`/libraries/unit-issues/${id}`);
        break;
      default:
        break;
    }

    openUpdateModal();
  };

  const handleOpenDetailModal = (id: string, moduleType: ModuleType | null) => {
    const data = tableBody?.find((form: any) => form.id === id);

    setFormData(data);
    setCurrentDetailModule(moduleType ?? undefined);
    setCurrentUpdateModule(moduleType ?? undefined);

    switch (moduleType) {
      case 'pr':
        setDetailModalTitle(`Purchase Request Details [${data?.pr_no}]`);
        setDetailModalShowPrint(
          ['supply:*', ...getAllowedPermissions('pr', 'print')].some(
            (permission) => permissions?.includes(permission)
          )
        );

        setDetailModalShowEdit(
          ['supply:*', ...getAllowedPermissions('pr', 'update')].some(
            (permission) => permissions?.includes(permission)
          )
        );

        setUpdateModalTitle(`Update Purchase Request [${data?.pr_no}]`);
        setUpdateEndpoint(`/purchase-requests/${id}`);
        setUpdateModalFullscreen(true);

        setPrintModalTitle(`Print Purchase Request [${data?.pr_no}]`);
        setPrintEndpoint(`/documents/${moduleType}/prints/${id}`);
        setPrintDefaultPaper('A4');

        setLogModalTitle(`Purchase Request Logs [${data?.pr_no}]`);
        setLogEndpoint(`/logs`);

        setCurrentOpenedModuleType('main');
        break;
      case 'rfq':
        const parentBody = tableBody?.find((body: any) =>
          body?.sub_body.some((subBody: any) => subBody.id === id)
        );
        const subData = parentBody?.sub_body.find(
          (subBody: any) => subBody.id === id
        );

        setFormData(subData);
        setDetailModalTitle(`Request Quotation Details [${subData?.rfq_no}]`);
        setDetailModalShowPrint(
          ['supply:*', ...getAllowedPermissions('rfq', 'print')].some(
            (permission) => permissions?.includes(permission)
          )
        );

        setDetailModalShowEdit(
          ['supply:*', ...getAllowedPermissions('rfq', 'update')].some(
            (permission) => permissions?.includes(permission)
          )
        );

        setUpdateModalTitle(`Update Request Quotation [${subData?.rfq_no}]`);
        setUpdateEndpoint(`/request-quotations/${id}`);
        setUpdateModalFullscreen(true);

        setPrintModalTitle(`Print Request Quotation [${subData?.rfq_no}]`);
        setPrintEndpoint(`/documents/${moduleType}/prints/${id}`);
        setPrintDefaultPaper('A4');

        setLogModalTitle(`Request Quotation Logs [${subData?.rfq_no}]`);
        setLogEndpoint(`/logs`);

        setCurrentOpenedModuleType('sub');
        break;
      default:
        break;
    }

    // openDetailModal();
    stack.open('detail-modal');
  };

  const renderDynamicTdContent = (value: any): ReactNode => {
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number') {
      return `${value}`;
    } else if (Array.isArray(value)) {
      return value.join(', ');
    } else if (value instanceof Date) {
      return value.toLocaleDateString();
    } else if (React.isValidElement(value)) {
      return value;
    } else if (value && typeof value === 'object') {
      return JSON.stringify(value);
    } else if (typeof value === 'undefined') {
    } else {
      return <span>-</span>;
    }
  };

  return (
    <Stack>
      <DataTableActionsClient
        mainModule={mainModule}
        permissions={permissions}
        search={tableSearch}
        setSearch={setTableSearch}
        showCreate={showCreate}
        showSearch={showSearch}
        handleOpenCreateModal={handleOpenCreateModal}
      />

      <ScrollArea
        h={{ md: '100%', lg: 'calc(100vh - 22.5em)' }}
        sx={{ borderRadius: 5 }}
      >
        <Table
          verticalSpacing={'sm'}
          stickyHeaderOffset={-0.5}
          stickyHeader
          highlightOnHover
          withTableBorder
        >
          <Table.Thead>
            <Table.Tr bg={'var(--mantine-color-primary-9)'} c={'white'}>
              {data.head?.map((head) => (
                <Table.Th
                  key={head.id}
                  w={head.width ?? undefined}
                  p={head.sortable ? 0 : undefined}
                >
                  {head.sortable ? (
                    <Button
                      size={lgScreenAndBelow ? 'xs' : 'sm'}
                      variant={'transparent'}
                      c={'var(--mantine-color-white-9)'}
                      m={0}
                      h={'auto'}
                      py={'var(--mantine-spacing-sm)'}
                      justify={'left'}
                      fz={{ base: 11, lg: 'xs', xl: 'sm' }}
                      rightSection={
                        <>
                          {columnSort === head.id ? (
                            <>
                              {sortDirection === 'desc' ? (
                                <IconSortDescending2Filled size={14} />
                              ) : (
                                <IconSortAscending2Filled size={14} />
                              )}
                            </>
                          ) : (
                            <IconSortDescending2Filled size={14} />
                          )}
                        </>
                      }
                      onClick={() => {
                        if (loading) return;
                        setTableColumnSort(head.id);
                        setTableSortDirection(
                          tableSortDirection === 'desc' ? 'asc' : 'desc'
                        );
                      }}
                      fullWidth
                    >
                      {head.label}
                    </Button>
                  ) : (
                    <>{head.label}</>
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading &&
              Array.from({ length: perPage }).map((_, i) => (
                <Table.Tr key={i}>
                  <Table.Td colSpan={data.head?.length}>
                    <Skeleton height={30} radius='sm' />
                  </Table.Td>
                </Table.Tr>
              ))}

            {!loading && data.body?.length === 0 && (
              <>
                <Table.Tr>
                  <Table.Td
                    c={'var(--mantine-color-red-5)'}
                    ta={'center'}
                    colSpan={data.head?.length}
                    fz={{ base: 11, lg: 'xs', xl: 'sm' }}
                  >
                    No data.
                  </Table.Td>
                </Table.Tr>

                {/* {Array.from({ length: perPage - 1 }).map((_, i) => (
                  <Table.Tr key={i}>
                    <Table.Td colSpan={data.head?.length} py={'lg'}></Table.Td>
                  </Table.Tr>
                ))} */}
              </>
            )}

            {!loading &&
              tableBody?.map((body: any) => (
                <React.Fragment key={body.id}>
                  <Table.Tr
                    sx={{ cursor: itemsClickable ? 'pointer' : 'default' }}
                  >
                    {data.head?.map(
                      (head, i) =>
                        typeof body[head.id] !== 'undefined' && (
                          <Tooltip.Floating
                            key={`${body.id}-${body[head.id]}-${i}`}
                            fz={'xs'}
                            label={
                              itemsClickable &&
                              getAllowedPermissions(mainModule, 'view')?.some(
                                (permission) => permissions.includes(permission)
                              ) &&
                              showDetailsFirst
                                ? 'Click to show details'
                                : itemsClickable &&
                                    getAllowedPermissions(
                                      mainModule,
                                      'update'
                                    )?.some((permission) =>
                                      permissions.includes(permission)
                                    ) &&
                                    !showDetailsFirst
                                  ? 'Click to update'
                                  : undefined
                            }
                            disabled={!itemsClickable}
                          >
                            <Table.Td
                              fz={{ base: 11, lg: 'xs', xl: 'sm' }}
                              valign={'top'}
                              // fw={500}
                              onClick={() => {
                                if (
                                  itemsClickable &&
                                  getAllowedPermissions(
                                    mainModule,
                                    'update'
                                  )?.some((permission) =>
                                    permissions.includes(permission)
                                  ) &&
                                  !showDetailsFirst
                                ) {
                                  setCurrentId(body.id);
                                  setCurrentOpenedModuleType('main');
                                  handleOpenUpdateModal(
                                    body.id,
                                    mainModule ?? null
                                  );
                                }

                                if (
                                  itemsClickable &&
                                  getAllowedPermissions(
                                    mainModule,
                                    'view'
                                  )?.some((permission) =>
                                    permissions.includes(permission)
                                  ) &&
                                  showDetailsFirst
                                ) {
                                  setCurrentId(body.id);
                                  setCurrentOpenedModuleType('main');
                                  handleOpenDetailModal(
                                    body.id,
                                    mainModule ?? null
                                  );
                                }
                              }}
                            >
                              {renderDynamicTdContent(body[head.id])}
                            </Table.Td>
                          </Tooltip.Floating>
                        )
                    )}

                    {(hasSubBody || subModule) && (
                      <Table.Td valign={'top'}>
                        <Button
                          fz={{ base: 10, lg: 11, xl: 'xs' }}
                          size={lgScreenAndBelow ? 'compact-xs' : 'xs'}
                          variant='light'
                          color={'var(--mantine-color-secondary-9)'}
                          rightSection={
                            collapseStates[body.id ?? ''] ? (
                              <IconArrowUp size={12} />
                            ) : (
                              <IconArrowDown size={12} />
                            )
                          }
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleToggleCollapse(body.id)}
                        >
                          {collapseStates[body.id ?? ''] ? 'Hide' : 'Show'}{' '}
                          {subButtonLabel}
                        </Button>
                      </Table.Td>
                    )}
                  </Table.Tr>

                  {(hasSubBody || subModule) && (
                    <Table.Tr>
                      <Table.Td
                        bg={'var(--mantine-color-secondary-0)'}
                        colSpan={data.head?.length}
                        p={collapseStates[body.id ?? ''] ? undefined : 0}
                      >
                        <Collapse in={collapseStates[body.id ?? '']}>
                          <Table
                            bg={'white'}
                            verticalSpacing={'sm'}
                            highlightOnHover
                            withTableBorder
                          >
                            <Table.Thead>
                              <Table.Tr
                                bg={'var(--mantine-color-secondary-9)'}
                                c={'white'}
                              >
                                {data.subHead?.map((subHead) => (
                                  <Table.Th
                                    key={subHead.id}
                                    w={subHead.width}
                                    fw={500}
                                    fz={{ base: 11, lg: 'xs', xl: 'sm' }}
                                  >
                                    {subHead.label}
                                  </Table.Th>
                                ))}
                              </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                              {!loading && body?.sub_body?.length === 0 && (
                                <Table.Tr>
                                  <Table.Td
                                    c={'var(--mantine-color-red-5)'}
                                    ta={'center'}
                                    colSpan={data.head?.length}
                                    fz={{ base: 11, lg: 'xs', xl: 'sm' }}
                                  >
                                    No data.
                                  </Table.Td>
                                </Table.Tr>
                              )}

                              {body?.sub_body?.map((subBody: any) => (
                                <Table.Tr
                                  key={subBody.id}
                                  sx={{
                                    cursor:
                                      itemsClickable && enableUpdateSubItem
                                        ? 'pointer'
                                        : 'default',
                                  }}
                                >
                                  {data.subHead?.map(
                                    (subHead, subHeadIndex) =>
                                      subBody[subHead.id] && (
                                        <Tooltip.Floating
                                          key={`${subBody.id}-${subHeadIndex}`}
                                          fz={'xs'}
                                          label={
                                            itemsClickable &&
                                            getAllowedPermissions(
                                              subModule,
                                              'view'
                                            )?.some((permission) =>
                                              permissions.includes(permission)
                                            ) &&
                                            showDetailsFirst
                                              ? 'Click to show details'
                                              : itemsClickable &&
                                                  enableUpdateSubItem &&
                                                  getAllowedPermissions(
                                                    subModule,
                                                    'update'
                                                  )?.some((permission) =>
                                                    permissions.includes(
                                                      permission
                                                    )
                                                  ) &&
                                                  !showDetailsFirst
                                                ? 'Click to update'
                                                : undefined
                                          }
                                          disabled={
                                            !itemsClickable ||
                                            !enableUpdateSubItem
                                          }
                                        >
                                          <Table.Td
                                            valign={'top'}
                                            // fw={500}
                                            fz={{
                                              base: 11,
                                              lg: 'xs',
                                              xl: 'sm',
                                            }}
                                            onClick={() => {
                                              if (
                                                itemsClickable &&
                                                enableUpdateSubItem &&
                                                getAllowedPermissions(
                                                  subModule,
                                                  'update'
                                                )?.some((permission) =>
                                                  permissions.includes(
                                                    permission
                                                  )
                                                ) &&
                                                !showDetailsFirst
                                              ) {
                                                setCurrentId(subBody.id);
                                                setCurrentOpenedModuleType(
                                                  'sub'
                                                );
                                                handleOpenUpdateModal(
                                                  subBody.id,
                                                  subModule ?? null
                                                );
                                              }

                                              if (
                                                itemsClickable &&
                                                getAllowedPermissions(
                                                  subModule,
                                                  'view'
                                                )?.some((permission) =>
                                                  permissions.includes(
                                                    permission
                                                  )
                                                ) &&
                                                showDetailsFirst
                                              ) {
                                                setCurrentId(subBody.id);
                                                setCurrentOpenedModuleType(
                                                  'sub'
                                                );
                                                handleOpenDetailModal(
                                                  subBody.id,
                                                  subModule ?? null
                                                );
                                              }
                                            }}
                                          >
                                            {renderDynamicTdContent(
                                              subBody[subHead.id]
                                            )}
                                          </Table.Td>
                                        </Tooltip.Floating>
                                      )
                                  )}
                                </Table.Tr>
                              ))}

                              {enableCreateSubItem &&
                                getAllowedPermissions(
                                  subModule,
                                  'create'
                                )?.some((permission) =>
                                  permissions.includes(permission)
                                ) && (
                                  <Table.Tr>
                                    <Table.Td
                                      bg={'white'}
                                      colSpan={data.subHead?.length}
                                      p={0}
                                    >
                                      <Button
                                        variant={'outline'}
                                        size={
                                          lgScreenAndBelow ? 'compact-xs' : 'xs'
                                        }
                                        color={'var(--mantine-color-primary-9)'}
                                        leftSection={<IconPlus size={12} />}
                                        onClick={() => {
                                          setCurrentOpenedModuleType('sub');
                                          handleOpenCreateModal(
                                            body.id,
                                            subModule ?? null
                                          );
                                        }}
                                        fullWidth
                                      >
                                        Add {subButtonLabel}
                                      </Button>
                                    </Table.Td>
                                  </Table.Tr>
                                )}
                            </Table.Tbody>
                          </Table>
                        </Collapse>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </React.Fragment>
              ))}

            {/* {!loading &&
              Array.from({ length: perPage - data.body?.length }).map(
                (_, i) => (
                  <Table.Tr key={i}>
                    <Table.Td colSpan={data.head?.length} py={'lg'}>
                      <Stack h={9}></Stack>
                    </Table.Td>
                  </Table.Tr>
                )
              )} */}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <CreateModalClient
        title={createModalTitle}
        endpoint={createEndpoint}
        data={formData}
        content={currentCreateModule}
        fullscreen={createModalFullscreen}
        opened={createModalOpened}
        close={() => {
          setCurrentId(undefined);
          setCurrentOpenedModuleType(undefined);
          setFormData(undefined);
          closeCreateModal();
        }}
        updateTable={handleUpdateTable}
      />

      {!showDetailsFirst && (
        <UpdateModalClient
          title={updateModalTitle}
          endpoint={updateModalOpened ? updateEndpoint : ''}
          data={updateModalOpened ? formData : undefined}
          content={currentUpdateModule}
          fullscreen={updateModalFullscreen}
          opened={updateModalOpened}
          close={() => {
            setCurrentId(undefined);
            setCurrentOpenedModuleType(undefined);
            setFormData(undefined);
            closeUpdateModal();
          }}
          updateTable={handleUpdateTable}
        />
      )}

      {showDetailsFirst && (
        <Modal.Stack>
          <DetailModalClient
            user={user}
            permissions={permissions}
            title={detailModalTitle}
            data={stack.register('detail-modal').opened ? formData : undefined}
            content={currentDetailModule}
            opened={stack.register('detail-modal').opened}
            stack={stack}
            close={() => {
              setCurrentId(undefined);
              setCurrentOpenedModuleType(undefined);
              setFormData(undefined);
              stack.closeAll();
              setLogEndpoint('');
            }}
            updateTable={handleUpdateTable}
            showPrint={detailModalShowPrint}
            showEdit={detailModalShowEdit}
          />
          <PrintModalClient
            title={printModalTitle}
            endpoint={stack.register('print-modal').opened ? printEndpoint : ''}
            defaultValue={printDefaultPaper}
            opened={stack.register('print-modal').opened}
            stack={stack}
            close={() => {
              stack.register('print-modal').onClose();
              stack.open('detail-modal');
            }}
          />

          {logEndpoint && (
            <LogModalClient
              id={currentId ?? ''}
              title={logModalTitle}
              endpoint={logEndpoint}
              opened={stack.register('log-modal').opened}
              stack={stack}
              close={() => {
                stack.register('log-modal').onClose();
                stack.open('detail-modal');
              }}
            />
          )}

          <UpdateModalClient
            title={updateModalTitle}
            endpoint={
              stack.register('update-modal').opened ? updateEndpoint : ''
            }
            data={stack.register('update-modal').opened ? formData : undefined}
            content={currentUpdateModule}
            fullscreen={updateModalFullscreen}
            opened={stack.register('update-modal').opened}
            stack={stack}
            close={() => {
              stack.register('update-modal').onClose();
              stack.open('detail-modal');
            }}
            updateTable={handleUpdateTable}
          />
        </Modal.Stack>
      )}

      <DataTablePaginationClient
        perPage={perPage}
        page={page}
        lastPage={lastPage}
        from={from}
        to={to}
        total={total}
        setPage={setTablePage}
        setPerPage={setTablePerPage}
      />
    </Stack>
  );
};

export default DataTableClient;
