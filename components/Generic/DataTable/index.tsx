'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  Grid,
  Group,
  Paper,
  Skeleton,
  Stack,
  Table,
  Text,
  Tooltip,
  useModalsStack,
} from '@mantine/core';
import {
  IconArrowDown,
  IconArrowUp,
  IconCaretRightFilled,
  IconChevronDown,
  IconChevronUp,
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
  showTableActions = true,
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
  const isMobile = useMediaQuery('(max-width: 600px)');
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
        data: detailData?.data,
      });
    }
  }, [detailData, currentDetailModule, currentUpdateModule, setActiveData]);

  useEffect(() => {
    const search = searchParams.get('search');

    if (search !== null) {
      setTableSearch(search);
      replace(pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    data.body?.forEach((body: any) => {
      if (body?.sub_body?.length > 0) setHasSubBody(true);
    });

    if (autoCollapseSubItems === 'first' && data.body?.[0]?.id) {
      setCollapseStates({
        [data.body[0].id as string]: true,
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

  const handleMainRowClick = (
    body: any,
    head: TableHeader,
    e: React.MouseEvent
  ) => {
    if (head?.clickable === false) {
      setCurrentId(body.id);
      setCurrentOpenedModuleType('main');
      setCurrentDetailModule(mainModule);
      setFetchDetails(true);
      return;
    }

    if (
      mainItemsClickable &&
      getAllowedPermissions(mainModule, 'update')?.some((permission) =>
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
      getAllowedPermissions(mainModule, 'view')?.some((permission) =>
        permissions.includes(permission)
      ) &&
      defaultModalOnClick === 'details'
    ) {
      setPageLoading(true);
      e.preventDefault();

      if (hasSubBody || subModule) {
        const searchParams = subModule ? `from=${subModule}` : '';
        push(`${detailItemData?.main?.base_url}/${body.id}?${searchParams}`);
      } else {
        push(`${pathname}/${body.id}`);
      }
    }
  };

  const handleSubRowClick = (
    body: any,
    subBody: any,
    subHead: TableHeader,
    e: React.MouseEvent
  ) => {
    if (subHead?.clickable === false) {
      setCurrentId(subBody.id);
      setCurrentOpenedModuleType('sub');
      setCurrentDetailModule(subModule);
      setFetchDetails(true);
      return;
    }

    if (
      subItemsClickable &&
      getAllowedPermissions(subModule, 'update')?.some((permission) =>
        permissions.includes(permission)
      ) &&
      defaultModalOnClick === 'update'
    ) {
      setCurrentId(subBody.id);
      setCurrentOpenedModuleType('sub');
      handleOpenUpdateModal(subModule);
    }

    if (
      subItemsClickable &&
      getAllowedPermissions(subModule, 'view')?.some((permission) =>
        permissions.includes(permission)
      ) &&
      defaultModalOnClick === 'details'
    ) {
      setPageLoading(true);
      e.preventDefault();

      if (detailItemData?.sub?.base_url) {
        push(`${detailItemData?.sub?.base_url}/${subBody.id}`);
      } else {
        push(`${pathname}/${body.id}`);
      }
    }
  };

  const getTooltipLabel = (
    module: ModuleType | undefined,
    isClickable: boolean | undefined
  ) => {
    if (
      isClickable &&
      getAllowedPermissions(module, 'view')?.some((permission) =>
        permissions.includes(permission)
      ) &&
      defaultModalOnClick === 'details'
    ) {
      return 'Click to show details';
    }
    if (
      isClickable &&
      getAllowedPermissions(module, 'update')?.some((permission) =>
        permissions.includes(permission)
      ) &&
      defaultModalOnClick === 'update'
    ) {
      return 'Click to update';
    }
    return undefined;
  };

  // Mobile card view for each row
  const renderMobileCard = (body: any, index: number) => {
    const visibleHeads =
      data.head?.filter((head) => typeof body[head.id] !== 'undefined') ?? [];

    return (
      <Card
        key={body.id}
        padding='sm'
        radius='md'
        withBorder
        sx={{
          cursor: mainItemsClickable ? 'pointer' : 'default',
          transition: 'box-shadow 150ms ease',
          '&:hover': mainItemsClickable
            ? { boxShadow: 'var(--mantine-shadow-sm)' }
            : undefined,
        }}
        onClick={(e) => {
          if (mainItemsClickable && visibleHeads.length > 0) {
            handleMainRowClick(body, visibleHeads[0], e);
          }
        }}
      >
        <Stack gap={6}>
          {visibleHeads.map((head, i) => (
            <Group
              key={`${body.id}-${head.id}`}
              justify='space-between'
              wrap='nowrap'
              gap='xs'
            >
              <Text
                component='span'
                size='xs'
                c='dimmed'
                fw={500}
                style={{ whiteSpace: 'nowrap' }}
              >
                {head.label}
              </Text>
              <Text
                component='span'
                size='xs'
                ta='right'
                style={{ wordBreak: 'break-word' }}
              >
                {renderDynamicTdContent(body[head.id])}
              </Text>
            </Group>
          ))}
        </Stack>

        {(hasSubBody || subModule) && (
          <Box mt='xs'>
            <Button
              size='compact-xs'
              variant='light'
              color='var(--mantine-color-secondary-7)'
              fullWidth
              rightSection={
                collapseStates[body.id ?? ''] ? (
                  <IconChevronUp size={12} />
                ) : (
                  <IconChevronDown size={12} />
                )
              }
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCollapse(body.id);
              }}
            >
              {collapseStates[body.id ?? ''] ? 'Hide' : 'Show'} {subButtonLabel}
            </Button>

            <Collapse in={collapseStates[body.id ?? '']}>
              <Stack gap='xs' mt='xs'>
                {body?.sub_body?.length === 0 && (
                  <Text size='xs' c='red.5' ta='center' py='xs'>
                    No data.
                  </Text>
                )}

                {body?.sub_body?.map((subBody: any) => (
                  <Card
                    key={subBody.id}
                    padding='xs'
                    radius='sm'
                    bg='var(--mantine-color-gray-0)'
                    withBorder
                    sx={{
                      cursor: subItemsClickable ? 'pointer' : 'default',
                      borderColor: 'var(--mantine-color-gray-3)',
                    }}
                    onClick={(e) => {
                      if (
                        subItemsClickable &&
                        data.subHead &&
                        data.subHead.length > 0
                      ) {
                        handleSubRowClick(body, subBody, data.subHead[0], e);
                      }
                    }}
                  >
                    <Stack gap={4}>
                      {data.subHead?.map(
                        (subHead) =>
                          subBody[subHead.id] && (
                            <Group
                              key={`${subBody.id}-${subHead.id}`}
                              justify='space-between'
                              wrap='nowrap'
                              gap='xs'
                            >
                              <Text
                                component='span'
                                size='xs'
                                c='dimmed'
                                fw={500}
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                {subHead.label}
                              </Text>
                              <Text
                                component='span'
                                size='xs'
                                ta='right'
                                style={{ wordBreak: 'break-word' }}
                              >
                                {renderDynamicTdContent(subBody[subHead.id])}
                              </Text>
                            </Group>
                          )
                      )}
                    </Stack>
                  </Card>
                ))}

                {showCreateSubItem &&
                  getAllowedPermissions(subModule, 'create')?.some(
                    (permission) => permissions.includes(permission)
                  ) && (
                    <Button
                      variant='light'
                      size='compact-xs'
                      color='var(--mantine-color-primary-8)'
                      leftSection={<IconPlus size={12} />}
                      radius='sm'
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentOpenedModuleType('sub');

                        if (defaultModalOnClick === 'details') {
                          setPageLoading(true);
                          e.preventDefault();

                          if (detailItemData?.sub?.base_url) {
                            push(
                              `${detailItemData?.sub?.base_url}/create?parent_id=${body.id}`
                            );
                          } else {
                            push(`${pathname}/create?parent_id=${body.id}`);
                          }
                        } else {
                          handleOpenCreateModal(body.id, subModule ?? null);
                        }
                      }}
                      fullWidth
                    >
                      Add {subButtonLabel}
                    </Button>
                  )}
              </Stack>
            </Collapse>
          </Box>
        )}
      </Card>
    );
  };

  const dynamicMainTable = () => {
    return (
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          borderRadius: 'var(--mantine-radius-md)',
          padding: 0,
          paddingBottom: '15px',
          border: '2px solid var(--mantine-color-primary-8)',
        }}
      >
        <Table
          verticalSpacing={'xs'}
          stickyHeaderOffset={lgScreenAndBelow ? 39 : 49}
          stickyHeader={!lgScreenAndBelow}
          highlightOnHover
          // withTableBorder
          sx={{
            borderRadius: '0.75em',
            border: 0,
            background: 'white',
          }}
        >
          <Table.Thead>
            <Table.Tr
              bg={'var(--mantine-color-primary-8)'}
              c={'white'}
              h={lgScreenAndBelow ? '2.25rem' : '2.75rem'}
            >
              {data.head?.map((head) => (
                <Table.Th
                  key={head.id}
                  w={head.width ?? undefined}
                  p={0}
                  ta={head.align ?? undefined}
                  bg={'var(--mantine-color-primary-8)'}
                  fz={lgScreenAndBelow ? 'xs' : 'sm'}
                  fw={600}
                >
                  {head.sortable ? (
                    <Button
                      size={lgScreenAndBelow ? 'compact-xs' : 'compact-sm'}
                      variant={'transparent'}
                      c={'var(--mantine-color-white-9)'}
                      m={0}
                      h={'auto'}
                      px={lgScreenAndBelow ? 8 : 12}
                      py={6}
                      ta={head.align ?? undefined}
                      justify={'left'}
                      fz={lgScreenAndBelow ? 'xs' : 'sm'}
                      fw={600}
                      sx={{
                        '&:hover': {
                          bg: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
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
                    <Box px={lgScreenAndBelow ? 8 : 12} py={6}>
                      {head.label}
                    </Box>
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading &&
              Array.from({ length: perPage }).map((_, i) => (
                <Table.Tr key={i}>
                  <Table.Td
                    colSpan={
                      (data.head?.length ?? 0) +
                      (hasSubBody || subModule ? 1 : 0)
                    }
                  >
                    <Skeleton height={40} radius='sm' />
                  </Table.Td>
                </Table.Tr>
              ))}

            {!loading && data.body?.length === 0 && (
              <Table.Tr>
                <Table.Td
                  c={'dimmed'}
                  ta={'center'}
                  colSpan={
                    (data.head?.length ?? 0) + (hasSubBody || subModule ? 1 : 0)
                  }
                  fz={'sm'}
                  h={'calc(100vh - 28em)'}
                >
                  <Stack align='center' gap='xs'>
                    <Text size='sm' c='dimmed'>
                      No data found.
                    </Text>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            )}

            {!loading &&
              tableBody?.map((body: any, index: number) => (
                <React.Fragment key={body.id}>
                  <Table.Tr
                    bg={'white'}
                    sx={{
                      cursor: mainItemsClickable ? 'pointer' : 'default',
                      borderBottom:
                        (hasSubBody || subModule) &&
                        collapseStates[body.id ?? '']
                          ? '2px solid var(--mantine-color-primary-3)'
                          : '1px solid var(--mantine-color-gray-2)',
                      transition: 'all 150ms ease',
                      '&:hover': {
                        backgroundColor: 'var(--mantine-color-gray-0)',
                      },
                    }}
                  >
                    {data.head?.map(
                      (head, i) =>
                        typeof body[head.id] !== 'undefined' && (
                          <Tooltip.Floating
                            key={`${body.id}-${body[head.id]}-${i}`}
                            fz={'xs'}
                            label={getTooltipLabel(
                              mainModule,
                              mainItemsClickable
                            )}
                            disabled={
                              !mainItemsClickable || head?.clickable === false
                            }
                          >
                            <Table.Td
                              fz={lgScreenAndBelow ? 'xs' : 'sm'}
                              py={8}
                              px={lgScreenAndBelow ? 10 : 12}
                              valign={'top'}
                              onClick={(e) => handleMainRowClick(body, head, e)}
                            >
                              {renderDynamicTdContent(body[head.id])}
                            </Table.Td>
                          </Tooltip.Floating>
                        )
                    )}

                    {(hasSubBody || subModule) && (
                      <Table.Td valign={'top'}>
                        <Button
                          variant='light'
                          fz={{ base: 10, lg: 11, xl: 'xs' }}
                          size={lgScreenAndBelow ? 'compact-xs' : 'xs'}
                          color={'var(--mantine-color-secondary-7)'}
                          rightSection={
                            collapseStates[body.id ?? ''] ? (
                              <IconChevronUp size={12} />
                            ) : (
                              <IconChevronDown size={12} />
                            )
                          }
                          radius='md'
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
                            ? '2px solid var(--mantine-color-primary-3)'
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
                                color={'var(--mantine-color-secondary-7)'}
                                size={lgScreenAndBelow ? 18 : 22}
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
                                <Table.Thead sx={{ zIndex: '2 !important' }}>
                                  <Table.Tr
                                    bg={'var(--mantine-color-secondary-7)'}
                                    c={'white'}
                                  >
                                    {data.subHead?.map((subHead) => (
                                      <Table.Th
                                        key={subHead.id}
                                        w={subHead.width}
                                        fw={600}
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
                                        c={'dimmed'}
                                        ta={'center'}
                                        colSpan={data.subHead?.length}
                                        fz={'sm'}
                                        py='md'
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
                                        transition:
                                          'background-color 150ms ease',
                                      }}
                                    >
                                      {data.subHead?.map(
                                        (subHead, subHeadIndex) =>
                                          subBody[subHead.id] && (
                                            <Tooltip.Floating
                                              key={`${subBody.id}-${subHeadIndex}`}
                                              fz={'xs'}
                                              label={getTooltipLabel(
                                                subModule,
                                                subItemsClickable
                                              )}
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
                                                py={10}
                                                px={
                                                  lgScreenAndBelow ? 'xs' : 'sm'
                                                }
                                                onClick={(e) =>
                                                  handleSubRowClick(
                                                    body,
                                                    subBody,
                                                    subHead,
                                                    e
                                                  )
                                                }
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
                                              '1px dashed var(--mantine-color-gray-4)'
                                            }
                                            h={40}
                                            size={'xs'}
                                            color={
                                              'var(--mantine-color-primary-8)'
                                            }
                                            leftSection={<IconPlus size={12} />}
                                            radius={'sm'}
                                            onClick={(e) => {
                                              setCurrentOpenedModuleType('sub');

                                              if (
                                                defaultModalOnClick ===
                                                'details'
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
      </Box>
    );
  };

  return (
    <Stack gap='sm'>
      {showTableActions && (
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
      )}

      {isMobile ? (
        // Mobile card layout
        <Stack gap='xs'>
          {loading &&
            Array.from({ length: perPage }).map((_, i) => (
              <Skeleton key={i} height={80} radius='md' />
            ))}

          {!loading && data.body?.length === 0 && (
            <Paper p='xl' radius='md' withBorder ta='center'>
              <Text size='sm' c='dimmed'>
                No data found.
              </Text>
            </Paper>
          )}

          {!loading &&
            tableBody?.map((body: any, index: number) =>
              renderMobileCard(body, index)
            )}
        </Stack>
      ) : lgScreenAndBelow ? (
        <Table.ScrollContainer
          minWidth={900}
          maxHeight={'calc(100vh - 21.5em)'}
        >
          {dynamicMainTable()}
        </Table.ScrollContainer>
      ) : (
        dynamicMainTable()
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

      <Divider my='md' />

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
