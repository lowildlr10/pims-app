'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  Button,
  Collapse,
  LoadingOverlay,
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
import useSWR from 'swr';
import API from '@/libs/API';
import { API_REFRESH_INTERVAL } from '@/config/intervals';

const DataTableClient = ({
  mainModule,
  subModule,

  user,
  permissions,

  columnSort,
  sortDirection,

  search,
  showSearch,
  showCreate,
  defaultModalOnClick = 'update',
  showCreateSubItem,
  mainItemsClickable = true,
  subItemsClickable,
  autoCollapseSubItems = 'all',

  createMainItemModalTitle = 'Create',
  createMainItemEndpoint = '',
  createSubItemModalTitle = 'Create',
  createSubItemEndpoint = '',
  createModalFullscreen,
  updateMainItemModalTitle = 'Update',
  updateMainItemBaseEndpoint = '',
  updateSubItemModalTitle = 'Update',
  updateSubItemBaseEndpoint = '',
  updateModalFullscreen,
  detailMainItemModalTitle = 'Details',
  detailMainItemBaseEndpoint = '',
  detailSubItemModalTitle = 'Details',
  detailSubItemBaseEndpoint = '',
  printMainItemModalTitle = 'Print',
  printMainItemBaseEndpoint = '',
  printSubItemModalTitle = 'Print',
  printSubItemBaseEndpoint = '',
  printMainItemDefaultPaper = 'A4',
  printSubItemDefaultPaper = 'A4',
  printMainItemDefaultOrientation = 'P',
  printSubItemDefaultOrientation = 'L',
  logMainItemModalTitle = 'Logs',
  logMainItemEndpoint = '/logs',
  logSubItemModalTitle = 'Logs',
  logSuItemEndpoint = '/logs',
  subButtonLabel = 'Items',

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

  const [currentCreateModule, setCurrentCreateModule] = useState<ModuleType>();
  const [
    updateModalOpened,
    { open: openUpdateModal, close: closeUpdateModal },
  ] = useDisclosure(false);
  const [currentUpdateModule, setCurrentUpdateModule] = useState<ModuleType>();
  const [currentDetailModule, setCurrentDetailModule] = useState<ModuleType>();
  const [detailModalShowPrint, setDetailModalShowPrint] = useState(false);
  const [detailModalShowEdit, setDetailModalShowEdit] = useState(false);

  const [fetchDetails, setFetchDetails] = useState(false);

  const stack = useModalsStack([
    'detail-modal',
    'print-modal',
    'update-modal',
    'log-modal',
  ]);

  const {
    data: detailData,
    isLoading: detailLoading,
    mutate: refreshDetail,
  } = useSWR<DetailResponse>(
    fetchDetails && currentId
      ? [
          currentOpenedModuleType === 'main'
            ? detailMainItemBaseEndpoint
              ? `${detailMainItemBaseEndpoint}/${currentId}`
              : null
            : detailSubItemBaseEndpoint
              ? `${detailSubItemBaseEndpoint}/${currentId}`
              : null,
        ]
      : null,
    ([url]: GeneralResponse) => API.get(url),
    {
      refreshInterval: API_REFRESH_INTERVAL,
      refreshWhenHidden: true,
      keepPreviousData: false,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (
      (stack.register('detail-modal').opened ||
        stack.register('update-modal').opened ||
        updateModalOpened) &&
      currentId
    ) {
      setFetchDetails(true);
    } else {
      setFetchDetails(false);
    }
  }, [stack, updateModalOpened, currentId]);

  useEffect(() => {
    setFormData(detailData?.data?.data);
  }, [detailData]);

  useEffect(() => {
    const search = searchParams.get('search');

    if (search) {
      setTableSearch(search);
      replace(pathname);
    }
  }, []);

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

  const handleToggleCollapse = (id: string | undefined) => {
    if (!id) return;

    setCollapseStates({
      ...collapseStates,
      [id]: !collapseStates[id],
    });
  };

  const handleUpdateTable = (id: string | null) => {
    if (refreshData) refreshData();

    refreshDetail();

    setTableSearch(id ?? '');
  };

  const handleOpenCreateModal = (
    parentId: string | null,
    moduleType: ModuleType | null
  ) => {
    setCurrentCreateModule(moduleType ?? undefined);

    switch (moduleType) {
      case 'account-section':
        setFormData({ division_id: parentId });
        break;
      case 'rfq':
        const parentBody = data?.body?.find(
          (form: any) => form.id === parentId
        );

        setFormData({
          purchase_request_id: parentId,
          purpose: parentBody?.purpose,
          pr_no: parentBody?.pr_no,
        });
        break;
      default:
        break;
    }

    openCreateModal();
  };

  const handleOpenUpdateModal = (id: string, moduleType: ModuleType | null) => {
    setCurrentUpdateModule(moduleType ?? undefined);

    openUpdateModal();
  };

  const handleOpenDetailModal = (id: string, moduleType: ModuleType | null) => {
    setCurrentDetailModule(moduleType ?? undefined);
    setCurrentUpdateModule(moduleType ?? undefined);

    switch (moduleType) {
      case 'pr':
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
        break;
      case 'rfq':
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
        break;
      case 'aoq':
        setDetailModalShowPrint(
          ['supply:*', ...getAllowedPermissions('aoq', 'print')].some(
            (permission) => permissions?.includes(permission)
          )
        );

        setDetailModalShowEdit(
          ['supply:*', ...getAllowedPermissions('aoq', 'update')].some(
            (permission) => permissions?.includes(permission)
          )
        );
        break;
      default:
        break;
    }

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
        handleOpenCreateModal={(parentId, moduleType) => {
          handleOpenCreateModal(parentId, moduleType);
          setCurrentOpenedModuleType('main');
        }}
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
                    sx={{ cursor: mainItemsClickable ? 'pointer' : 'default' }}
                  >
                    {data.head?.map(
                      (head, i) =>
                        typeof body[head.id] !== 'undefined' && (
                          <Tooltip.Floating
                            key={`${body.id}-${body[head.id]}-${i}`}
                            fz={'xs'}
                            label={
                              mainItemsClickable &&
                              getAllowedPermissions(mainModule, 'view')?.some(
                                (permission) => permissions.includes(permission)
                              ) &&
                              defaultModalOnClick === 'details'
                                ? 'Click to show details'
                                : mainItemsClickable &&
                                    getAllowedPermissions(
                                      mainModule,
                                      'update'
                                    )?.some((permission) =>
                                      permissions.includes(permission)
                                    ) &&
                                    defaultModalOnClick === 'update'
                                  ? 'Click to update'
                                  : undefined
                            }
                            disabled={!mainItemsClickable}
                          >
                            <Table.Td
                              fz={{ base: 11, lg: 'xs', xl: 'sm' }}
                              valign={'top'}
                              // fw={500}
                              onClick={() => {
                                if (
                                  mainItemsClickable &&
                                  getAllowedPermissions(
                                    mainModule,
                                    'update'
                                  )?.some((permission) =>
                                    permissions.includes(permission)
                                  ) &&
                                  defaultModalOnClick === 'update'
                                ) {
                                  setCurrentId(body.id);
                                  setCurrentOpenedModuleType('main');
                                  handleOpenUpdateModal(
                                    body.id,
                                    mainModule ?? null
                                  );
                                }

                                if (
                                  mainItemsClickable &&
                                  getAllowedPermissions(
                                    mainModule,
                                    'view'
                                  )?.some((permission) =>
                                    permissions.includes(permission)
                                  ) &&
                                  defaultModalOnClick === 'details'
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
                                    cursor: subItemsClickable
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
                                            subItemsClickable &&
                                            getAllowedPermissions(
                                              subModule,
                                              'view'
                                            )?.some((permission) =>
                                              permissions.includes(permission)
                                            ) &&
                                            defaultModalOnClick === 'details'
                                              ? 'Click to show details'
                                              : subItemsClickable &&
                                                  getAllowedPermissions(
                                                    subModule,
                                                    'update'
                                                  )?.some((permission) =>
                                                    permissions.includes(
                                                      permission
                                                    )
                                                  ) &&
                                                  defaultModalOnClick ===
                                                    'update'
                                                ? 'Click to update'
                                                : undefined
                                          }
                                          disabled={!subItemsClickable}
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
                                                subItemsClickable &&
                                                getAllowedPermissions(
                                                  subModule,
                                                  'update'
                                                )?.some((permission) =>
                                                  permissions.includes(
                                                    permission
                                                  )
                                                ) &&
                                                defaultModalOnClick === 'update'
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
                                                subItemsClickable &&
                                                getAllowedPermissions(
                                                  subModule,
                                                  'view'
                                                )?.some((permission) =>
                                                  permissions.includes(
                                                    permission
                                                  )
                                                ) &&
                                                defaultModalOnClick ===
                                                  'details'
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

                              {showCreateSubItem &&
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

      <LoadingOverlay
        visible={detailLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <CreateModalClient
        title={
          currentOpenedModuleType === 'main'
            ? createModalOpened
              ? createMainItemModalTitle
              : ''
            : createModalOpened
              ? createSubItemModalTitle
              : ''
        }
        endpoint={
          currentOpenedModuleType === 'main'
            ? createModalOpened
              ? createMainItemEndpoint
              : ''
            : createModalOpened
              ? createSubItemEndpoint
              : ''
        }
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

      {defaultModalOnClick === 'update' && (
        <UpdateModalClient
          title={
            currentOpenedModuleType === 'main'
              ? updateModalOpened
                ? updateMainItemModalTitle
                : ''
              : updateModalOpened
                ? updateSubItemModalTitle
                : ''
          }
          endpoint={
            currentOpenedModuleType === 'main'
              ? updateModalOpened
                ? `${updateMainItemBaseEndpoint}/${currentId}`
                : ''
              : updateModalOpened
                ? `${updateSubItemBaseEndpoint}/${currentId}`
                : ''
          }
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

      {defaultModalOnClick === 'details' && (
        <Modal.Stack>
          <DetailModalClient
            user={user}
            permissions={permissions}
            title={
              currentOpenedModuleType === 'main'
                ? stack.register('detail-modal').opened
                  ? detailMainItemModalTitle
                  : ''
                : stack.register('detail-modal').opened
                  ? detailSubItemModalTitle
                  : ''
            }
            data={stack.register('detail-modal').opened ? formData : undefined}
            content={currentDetailModule}
            opened={stack.register('detail-modal').opened}
            stack={stack}
            close={() => {
              setCurrentId(undefined);
              setCurrentOpenedModuleType(undefined);
              setFormData(undefined);
              stack.closeAll();
            }}
            updateTable={handleUpdateTable}
            showPrint={detailModalShowPrint}
            showEdit={detailModalShowEdit}
          />

          <PrintModalClient
            title={
              currentOpenedModuleType === 'main'
                ? stack.register('print-modal').opened
                  ? printMainItemModalTitle
                  : ''
                : stack.register('print-modal').opened
                  ? printSubItemModalTitle
                  : ''
            }
            endpoint={
              currentOpenedModuleType === 'main'
                ? stack.register('print-modal').opened
                  ? `${printMainItemBaseEndpoint}/${currentId}`
                  : ''
                : stack.register('print-modal').opened
                  ? `${printSubItemBaseEndpoint}/${currentId}`
                  : ''
            }
            defaultPaper={
              currentOpenedModuleType === 'main'
                ? printMainItemDefaultPaper
                : printSubItemDefaultPaper
            }
            defaultOrientation={
              currentOpenedModuleType === 'main'
                ? printMainItemDefaultOrientation
                : printSubItemDefaultOrientation
            }
            opened={stack.register('print-modal').opened}
            stack={stack}
            close={() => {
              stack.register('print-modal').onClose();
              stack.open('detail-modal');
            }}
          />

          <LogModalClient
            id={currentId ?? ''}
            title={
              currentOpenedModuleType === 'main'
                ? stack.register('log-modal').opened
                  ? logMainItemModalTitle
                  : ''
                : stack.register('log-modal').opened
                  ? logSubItemModalTitle
                  : ''
            }
            endpoint={
              currentOpenedModuleType === 'main'
                ? stack.register('log-modal').opened
                  ? logMainItemEndpoint
                  : ''
                : stack.register('log-modal').opened
                  ? logSuItemEndpoint
                  : ''
            }
            opened={stack.register('log-modal').opened}
            stack={stack}
            close={() => {
              stack.register('log-modal').onClose();
              stack.open('detail-modal');
            }}
          />

          <UpdateModalClient
            title={
              currentOpenedModuleType === 'main'
                ? updateModalOpened
                  ? updateMainItemModalTitle
                  : ''
                : updateModalOpened
                  ? updateSubItemModalTitle
                  : ''
            }
            endpoint={
              currentOpenedModuleType === 'main'
                ? stack.register('update-modal').opened
                  ? `${updateMainItemBaseEndpoint}/${currentId}`
                  : ''
                : stack.register('update-modal').opened
                  ? `${updateSubItemBaseEndpoint}/${currentId}`
                  : ''
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
