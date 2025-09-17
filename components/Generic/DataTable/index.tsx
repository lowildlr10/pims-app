'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  Button,
  Collapse,
  Grid,
  Skeleton,
  Stack,
  Table,
  Tooltip,
  useModalsStack,
} from '@mantine/core';
import {
  IconArrowDown,
  IconArrowUp,
  IconCaretRightFilled,
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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import API from '@/libs/API';
import { API_REFRESH_INTERVAL } from '@/config/intervals';
import CustomLoadingOverlay from '../CustomLoadingOverlay';

const DataTableClient = ({
  mainModule,
  subModule,

  permissions,

  columnSort,
  sortDirection,

  search,
  showSearch,
  showCreate,
  showEdit,
  createMenus,
  defaultModalOnClick = 'update',
  showCreateSubItem,
  mainItemsClickable = true,
  subItemsClickable,
  autoCollapseSubItems = 'all',

  createItemData,
  updateItemData,
  detailItemData,

  subButtonLabel = 'Items',

  data,
  activeFormData,
  setActiveData,
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
  const { replace, push } = useRouter();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  const [collapseStates, setCollapseStates] = useState<CollapseType>({});
  const [subTableStickyStates, setSubTableStickyStates] =
    useState<CollapseType>({});
  const [tableBody, setTableBody] = useState<any>(data?.body);
  const [hasSubBody, setHasSubBody] = useState(false);
  const [tableSearch, setTableSearch] = useState(search);
  const [tablePage, setTablePage] = useState(page);
  const [tablePerPage, setTablePerPage] = useState(perPage);
  const [tableColumnSort, setTableColumnSort] = useState(columnSort);
  const [tableSortDirection, setTableSortDirection] = useState(sortDirection);
  const [pageLoading, setPageLoading] = useState(false);

  const [formData, setFormData] = useState<FormDataType | undefined>(
    activeFormData
  );

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
            ? (detailItemData?.main?.endpoint ?? '')
              ? `${detailItemData?.main?.endpoint ?? ''}/${currentId}`
              : null
            : (detailItemData?.sub?.endpoint ?? '')
              ? `${detailItemData?.sub?.endpoint ?? ''}/${currentId}`
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
    setFormData(activeFormData ?? undefined);
  }, [activeFormData]);

  useEffect(() => {
    const selectedModule = currentDetailModule ?? currentUpdateModule;

    if (setActiveData && selectedModule) {
      setActiveData({
        display: 'details',
        moduleType: selectedModule,
        data: detailData?.data?.data,
      });
    }
  }, [detailData, currentDetailModule, currentUpdateModule, setActiveData]);

  useEffect(() => {
    const search = searchParams.get('search');

    if (search) {
      setTableSearch(search);
      replace(pathname);
    }
  }, [searchParams]);

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

  const handleSubTableSticky = (id: string | undefined) => {
    if (!id) return;

    setSubTableStickyStates({
      ...subTableStickyStates,
      [id]: !subTableStickyStates[id],
    });
  };

  const handleUpdateTable = (id: string | null) => {
    if (refreshData) refreshData();

    refreshDetail();

    setTableSearch(id ?? '');
  };

  const handleOpenCreateModal = (
    parentId: string | null,
    moduleType: ModuleType | null,
    otherParams?: { [key: string]: any } | null
  ) => {
    setCurrentCreateModule(moduleType ?? undefined);

    if (moduleType && setActiveData) {
      setActiveData({
        display: 'create',
        moduleType,
        data: {
          parent_id: parentId,
          parent_body:
            data?.body?.find((form: any) => form.id === parentId) ?? undefined,
          other_params: otherParams,
        },
      });
    }

    openCreateModal();
  };

  const handleOpenUpdateModal = (moduleType: ModuleType | undefined) => {
    setCurrentUpdateModule(moduleType ?? undefined);

    openUpdateModal();
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

  const dynamicMainTable = () => {
    return (
      <Table
        verticalSpacing={'sm'}
        stickyHeaderOffset={lgScreenAndBelow ? 39 : 49}
        stickyHeader={!lgScreenAndBelow}
        highlightOnHover
        withTableBorder
        sx={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
      >
        <Table.Thead>
          <Table.Tr
            bg={'var(--mantine-color-primary-8)'}
            c={'white'}
            h={lgScreenAndBelow ? '2.55rem' : '3rem'}
          >
            {data.head?.map((head) => (
              <Table.Th
                key={head.id}
                w={head.width ?? undefined}
                p={head.sortable ? 0 : undefined}
                ta={head.align ?? undefined}
                bg={'var(--mantine-color-primary-8)'}
                fz={lgScreenAndBelow ? 'xs' : 'sm'}
              >
                {head.sortable ? (
                  <Button
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    variant={'transparent'}
                    c={'var(--mantine-color-white-9)'}
                    m={0}
                    h={lgScreenAndBelow ? 'lg' : 'xl'}
                    px={lgScreenAndBelow ? 'xs' : 'sm'}
                    py={0}
                    ta={head.align ?? undefined}
                    justify={'left'}
                    fz={lgScreenAndBelow ? 'xs' : 'sm'}
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
                  fz={lgScreenAndBelow ? 'sm' : 'md'}
                  h={'calc(100vh - 28em)'}
                >
                  No data.
                </Table.Td>
              </Table.Tr>
            </>
          )}

          {!loading &&
            tableBody?.map((body: any, index: number) => (
              <React.Fragment key={body.id}>
                <Table.Tr
                  sx={{
                    cursor: mainItemsClickable ? 'pointer' : 'not-allowed',
                    borderBottom:
                      (hasSubBody || subModule) && collapseStates[body.id ?? '']
                        ? '2px solid var(--mantine-color-tertiary-9)'
                        : undefined,
                  }}
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
                          disabled={
                            !mainItemsClickable || head?.clickable === false
                          }
                        >
                          <Table.Td
                            fz={lgScreenAndBelow ? 'xs' : 'sm'}
                            valign={'top'}
                            onClick={(e) => {
                              if (head?.clickable === false) {
                                setCurrentId(body.id);
                                setCurrentOpenedModuleType('main');
                                setCurrentDetailModule(mainModule);
                                setFetchDetails(true);
                                return;
                              }

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
                                handleOpenUpdateModal(mainModule);
                              }

                              if (
                                mainItemsClickable &&
                                getAllowedPermissions(mainModule, 'view')?.some(
                                  (permission) =>
                                    permissions.includes(permission)
                                ) &&
                                defaultModalOnClick === 'details'
                              ) {
                                setPageLoading(true);
                                e.preventDefault();

                                if (hasSubBody || subModule) {
                                  const searchParams = subModule
                                    ? `from=${subModule}`
                                    : '';
                                  push(
                                    `${detailItemData?.main?.base_url}/${body.id}?${searchParams}`
                                  );
                                } else {
                                  push(`${pathname}/${body.id}`);
                                }
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
                        color={'var(--mantine-color-secondary-7)'}
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
                  <Table.Tr
                    sx={{
                      borderBottom:
                        (hasSubBody || subModule) &&
                        collapseStates[body.id ?? '']
                          ? '2px solid var(--mantine-color-tertiary-9)'
                          : undefined,
                    }}
                  >
                    <Table.Td
                      bg={'var(--mantine-color-tertiary-2)'}
                      colSpan={data.head?.length}
                      p={0}
                    >
                      <Collapse
                        in={collapseStates[body.id ?? '']}
                        p={lgScreenAndBelow ? 'xs' : 'sm'}
                        onTransitionEnd={() => handleSubTableSticky(body.id)}
                      >
                        <Grid
                          display={
                            !subTableStickyStates[body.id ?? '']
                              ? 'initial'
                              : 'none'
                          }
                        >
                          <Grid.Col span={'content'} px={0}>
                            <IconCaretRightFilled
                              color={'var(--mantine-color-secondary-9)'}
                              size={lgScreenAndBelow ? 20 : 25}
                            />
                          </Grid.Col>
                          <Grid.Col span={'auto'} pl={0}>
                            <Table
                              bg={'white'}
                              verticalSpacing={'sm'}
                              highlightOnHover
                              withTableBorder
                              stickyHeaderOffset={lgScreenAndBelow ? 77 : 96}
                              stickyHeader={!lgScreenAndBelow}
                            >
                              <Table.Thead sx={{ zIndex: 2 }}>
                                <Table.Tr
                                  bg={'var(--mantine-color-secondary-8)'}
                                  c={'white'}
                                >
                                  {data.subHead?.map((subHead) => (
                                    <Table.Th
                                      key={subHead.id}
                                      w={subHead.width}
                                      fw={500}
                                      ta={subHead.align ?? undefined}
                                      fz={lgScreenAndBelow ? 'xs' : 'sm'}
                                      bg={'var(--mantine-color-secondary-8)'}
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
                                        : 'not-allowed',
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
                                            disabled={
                                              !subItemsClickable ||
                                              subHead?.clickable === false
                                            }
                                          >
                                            <Table.Td
                                              valign={'top'}
                                              fz={
                                                lgScreenAndBelow ? 'xs' : 'sm'
                                              }
                                              onClick={(e) => {
                                                if (
                                                  subHead?.clickable === false
                                                ) {
                                                  setCurrentId(subBody.id);
                                                  setCurrentOpenedModuleType(
                                                    'sub'
                                                  );
                                                  setCurrentDetailModule(
                                                    subModule
                                                  );
                                                  setFetchDetails(true);
                                                  return;
                                                }

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
                                                  defaultModalOnClick ===
                                                    'update'
                                                ) {
                                                  setCurrentId(subBody.id);
                                                  setCurrentOpenedModuleType(
                                                    'sub'
                                                  );
                                                  handleOpenUpdateModal(
                                                    subModule
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
                                                  setPageLoading(true);
                                                  e.preventDefault();

                                                  if (
                                                    detailItemData?.sub
                                                      ?.base_url
                                                  ) {
                                                    push(
                                                      `${detailItemData?.sub?.base_url}/${subBody.id}`
                                                    );
                                                  } else {
                                                    push(
                                                      `${pathname}/${body.id}`
                                                    );
                                                  }
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
                                          variant='subtle'
                                          bd={
                                            '1px dashed var(--mantine-color-primary-8)'
                                          }
                                          h={lgScreenAndBelow ? 43 : 48}
                                          size={lgScreenAndBelow ? 'xs' : 'sm'}
                                          color={
                                            'var(--mantine-color-primary-8)'
                                          }
                                          leftSection={<IconPlus size={12} />}
                                          radius={'xs'}
                                          onClick={(e) => {
                                            setCurrentOpenedModuleType('sub');

                                            if (
                                              defaultModalOnClick === 'details'
                                            ) {
                                              setPageLoading(true);
                                              e.preventDefault();

                                              if (
                                                detailItemData?.sub?.base_url
                                              ) {
                                                push(
                                                  `${detailItemData?.sub?.base_url}/create?parent_id=${body.id}`
                                                );
                                              } else {
                                                push(
                                                  `${pathname}/create?parent_id=${body.id}`
                                                );
                                              }
                                            } else {
                                              handleOpenCreateModal(
                                                body.id,
                                                subModule ?? null
                                              );
                                            }
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
                          </Grid.Col>
                        </Grid>
                      </Collapse>
                    </Table.Td>
                  </Table.Tr>
                )}
              </React.Fragment>
            ))}
        </Table.Tbody>
      </Table>
    );
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
        createMenus={createMenus}
        setPageLoading={setPageLoading}
        defaultModalOnClick={defaultModalOnClick}
        handleOpenCreateModal={(parentId, moduleType, otherParams) => {
          handleOpenCreateModal(parentId, moduleType, otherParams);
          setCurrentOpenedModuleType('main');
        }}
      />

      {lgScreenAndBelow ? (
        <Table.ScrollContainer
          minWidth={900}
          maxHeight={'calc(100vh - 21.5em)'}
        >
          <>{dynamicMainTable()}</>
        </Table.ScrollContainer>
      ) : (
        <>{dynamicMainTable()}</>
      )}

      <CustomLoadingOverlay visible={detailLoading || pageLoading} />

      {defaultModalOnClick === 'update' && (
        <CreateModalClient
          title={
            currentOpenedModuleType === 'main'
              ? createModalOpened
                ? (createItemData?.main?.title ?? 'Create')
                : ''
              : createModalOpened
                ? (createItemData?.sub?.title ?? 'Create')
                : ''
          }
          endpoint={
            currentOpenedModuleType === 'main'
              ? createModalOpened
                ? (createItemData?.main?.endpoint ?? '')
                : ''
              : createModalOpened
                ? (createItemData?.sub?.endpoint ?? '')
                : ''
          }
          data={formData}
          content={currentCreateModule}
          fullscreen={createItemData?.fullscreen}
          opened={createModalOpened}
          close={() => {
            setCurrentId(undefined);
            setCurrentOpenedModuleType(undefined);

            if (setActiveData) {
              setActiveData && setActiveData(undefined);
            }

            closeCreateModal();
          }}
          updateTable={handleUpdateTable}
        />
      )}

      {defaultModalOnClick === 'update' && (
        <UpdateModalClient
          title={
            currentOpenedModuleType === 'main'
              ? updateModalOpened
                ? (updateItemData?.main?.title ?? 'Update')
                : ''
              : updateModalOpened
                ? (updateItemData?.sub?.title ?? 'Update')
                : ''
          }
          endpoint={
            currentOpenedModuleType === 'main'
              ? updateModalOpened
                ? `${updateItemData?.main?.endpoint ?? ''}/${currentId}`
                : ''
              : updateModalOpened
                ? `${updateItemData?.sub?.endpoint ?? ''}/${currentId}`
                : ''
          }
          data={updateModalOpened ? formData : undefined}
          content={currentUpdateModule}
          fullscreen={updateItemData?.fullscreen}
          showEdit={showEdit}
          opened={updateModalOpened}
          close={() => {
            setCurrentId(undefined);
            setCurrentOpenedModuleType(undefined);

            if (setActiveData) {
              setActiveData && setActiveData(undefined);
            }

            closeUpdateModal();
          }}
          updateTable={handleUpdateTable}
        />
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
