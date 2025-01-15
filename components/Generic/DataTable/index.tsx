'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  Button,
  Collapse,
  ScrollArea,
  Skeleton,
  Stack,
  Table,
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
import { useDisclosure } from '@mantine/hooks';
import UpdateModalClient from '../Modal/UpdateModal';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import CreateModalClient from '../Modal/CreateModal';

const DataTableClient = ({
  module,
  subModule,
  permissions,
  columnSort,
  sortDirection,
  search,
  enableCreateSubItem,
  enableUpdateSubItem,
  showSearch,
  showCreate,
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
  const [collapseStates, setCollapseStates] = useState<CollapseType>({});
  const [tableBody, setTableBody] = useState<any>(data.body);
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

  const [subButtonLabel, setSubButtonLabel] = useState('');

  useEffect(() => {
    data.body?.forEach((body: any) => {
      if (body?.subBody?.length > 0) setHasSubBody(true);
    });

    setCollapseStates({
      [data?.body[0]?.id as string]: true,
    });

    setTableBody(data.body);
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
    if (!module) return;

    switch (module) {
      case 'account-department':
        setSubButtonLabel('Sections');
        break;

      case 'lib-signatory':
        setSubButtonLabel('Details');
        break;

      default:
        break;
    }
  }, [module]);

  useEffect(() => {
    if (!subModule) return;

    switch (subModule) {
      case 'account-section':
        setCreateModalTitle('Add Section');
        setCreateEndpoint('/account/sections');
        break;
      case 'lib-signatory-detail':
        setCreateModalTitle('Add Details');
        setCreateEndpoint('#');
        break;

      default:
        break;
    }
  }, [subModule]);

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
            return row.id === payload.department_id
              ? {
                  ...row,
                  subBody: row.subBody.map((subRow: any) =>
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
            return row.id === payload.department_id
              ? { ...row, subBody: [...row.subBody, newRow] }
              : row;
          }
          return [...prev, newRow];
        }
      })
    );

    if (refreshData) refreshData({ ...tableBody, payload });
  };

  const handleOpenCreateModal = (
    parentId: string | null,
    module: ModuleType | null
  ) => {
    setCurrentCreateModule(module ?? undefined);

    switch (module) {
      case 'account-department':
        setCreateModalTitle('Create Department');
        setCreateEndpoint('/accounts/departments');
        break;
      case 'account-section':
        setFormData({ department_id: parentId });
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
      case 'lib-signatory':
        setCreateModalTitle('Create Signatory');
        setCreateEndpoint('/libraries/signatories');
        break;
      case 'lib-supplier':
        setCreateModalTitle('Create Supplier');
        setCreateEndpoint('/libraries/suppliers');
        break;
      case 'lib-uacs-classification':
        setCreateModalTitle('Create UACS Code Classification');
        setCreateEndpoint('/libraries/uacs-classifications');
        break;
      case 'lib-uacs-code':
        setCreateModalTitle('Create UACS Code');
        setCreateEndpoint('/libraries/uacs-codes');
        break;
      case 'lib-unit-issue':
        setCreateModalTitle('Create Unit of Issue');
        setCreateEndpoint('/libraries/unit-issues');
        break;
      default:
        break;
    }

    openCreateModal();
  };

  const handleOpenUpdateModal = (id: string, module: ModuleType | null) => {
    setFormData(tableBody?.find((form: any) => form.id === id));
    setCurrentUpdateModule(module ?? undefined);

    switch (module) {
      case 'account-department':
        setUpdateEndpoint(`/accounts/departments/${id}`);
        setUpdateModalTitle('Update Department');
        break;
      case 'account-section':
        const parentBody = tableBody?.find((body: any) =>
          body?.subBody.some((subBody: any) => subBody.id === id)
        );
        setUpdateEndpoint(`/accounts/sections/${id}`);
        setUpdateModalTitle('Update Section');
        setFormData(
          parentBody?.subBody.find((subBody: any) => subBody.id === id)
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
      case 'lib-signatory':
        setUpdateModalTitle('Update Signatory');
        setUpdateEndpoint(`/libraries/signatories/${id}`);
        break;
      case 'lib-supplier':
        setUpdateModalTitle('Update Supplier');
        setUpdateEndpoint(`/libraries/suppliers/${id}`);
        break;
      case 'lib-uacs-classification':
        setUpdateModalTitle('Update UACS Code Classification');
        setUpdateEndpoint(`/libraries/uacs-classifications/${id}`);
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

  const renderDynamicTdContent = (value: any): ReactNode => {
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number') {
      return `₱${value.toFixed(2)}`;
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
        module={module}
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
                      variant={'transparent'}
                      c={'var(--mantine-color-white-9)'}
                      m={0}
                      py={'var(--mantine-spacing-sm)'}
                      h={'auto'}
                      justify={'left'}
                      rightSection={
                        <>
                          {columnSort === head.id ? (
                            <>
                              {sortDirection === 'desc' ? (
                                <IconSortDescending2Filled size={18} />
                              ) : (
                                <IconSortAscending2Filled size={18} />
                              )}
                            </>
                          ) : (
                            <IconSortDescending2Filled size={18} />
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
                  >
                    No data.
                  </Table.Td>
                </Table.Tr>

                {Array.from({ length: perPage - 1 }).map((_, i) => (
                  <Table.Tr key={i}>
                    <Table.Td colSpan={data.head?.length} py={'lg'}></Table.Td>
                  </Table.Tr>
                ))}
              </>
            )}

            {!loading &&
              tableBody?.map((body: any) => (
                <React.Fragment key={body.id}>
                  <Table.Tr sx={{ cursor: 'pointer' }}>
                    {data.head?.map(
                      (head, i) =>
                        typeof body[head.id] !== 'undefined' && (
                          <Table.Td
                            valign={'top'}
                            key={`${body.id}-${body[head.id]}-${i}`}
                            // fw={500}
                            onClick={() =>
                              handleOpenUpdateModal(body.id, module ?? null)
                            }
                          >
                            {renderDynamicTdContent(body[head.id])}
                          </Table.Td>
                        )
                    )}

                    {hasSubBody && (
                      <Table.Td>
                        <Button
                          size={'xs'}
                          variant='light'
                          color={'var(--mantine-color-secondary-9)'}
                          rightSection={
                            collapseStates[body.id ?? ''] ? (
                              <IconArrowUp size={12} />
                            ) : (
                              <IconArrowDown size={12} />
                            )
                          }
                          onClick={() => handleToggleCollapse(body.id)}
                        >
                          {collapseStates[body.id ?? ''] ? 'Hide' : 'Show'}{' '}
                          {subButtonLabel}
                        </Button>
                      </Table.Td>
                    )}
                  </Table.Tr>

                  {hasSubBody && (
                    <Table.Tr>
                      <Table.Td
                        bg={'var(--mantine-color-tertiary-0)'}
                        colSpan={data.head?.length}
                        p={collapseStates[body.id ?? ''] ? undefined : 0}
                      >
                        <Collapse in={collapseStates[body.id ?? '']}>
                          <Table
                            bg={'white'}
                            verticalSpacing={'xs'}
                            highlightOnHover
                            withTableBorder
                          >
                            <Table.Thead>
                              <Table.Tr
                                bg={'var(--mantine-color-secondary-9)'}
                                c={'white'}
                              >
                                {data.subHead?.map((subHead) => (
                                  <Table.Th key={subHead.id} w={subHead.width}>
                                    {subHead.label}
                                  </Table.Th>
                                ))}
                              </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                              {body?.subBody?.map((subBody: any) => (
                                <Table.Tr
                                  key={subBody.id}
                                  sx={{
                                    cursor: enableUpdateSubItem
                                      ? 'pointer'
                                      : 'default',
                                  }}
                                >
                                  {data.subHead?.map(
                                    (subHead) =>
                                      subBody[subHead.id] && (
                                        <Table.Td
                                          key={subBody[subHead.id]}
                                          // fw={500}
                                          onClick={() =>
                                            enableUpdateSubItem &&
                                            handleOpenUpdateModal(
                                              subBody.id,
                                              subModule ?? null
                                            )
                                          }
                                        >
                                          {renderDynamicTdContent(
                                            subBody[subHead.id]
                                          )}
                                        </Table.Td>
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
                                    >
                                      <Button
                                        size={'xs'}
                                        color={
                                          'var(--mantine-color-secondary-9)'
                                        }
                                        variant='outline'
                                        leftSection={<IconPlus size={12} />}
                                        onClick={() =>
                                          handleOpenCreateModal(
                                            body.id,
                                            subModule ?? null
                                          )
                                        }
                                        fullWidth
                                      >
                                        Add
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

            {!loading &&
              Array.from({ length: perPage - data.body?.length }).map(
                (_, i) => (
                  <Table.Tr key={i}>
                    <Table.Td colSpan={data.head?.length} py={'lg'}>
                      <Stack h={9}></Stack>
                    </Table.Td>
                  </Table.Tr>
                )
              )}
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
          setFormData({});
          closeCreateModal();
        }}
        updateTable={handleUpdateTable}
      />

      <UpdateModalClient
        title={updateModalTitle}
        endpoint={updateEndpoint}
        data={formData}
        content={currentUpdateModule}
        fullscreen={updateModalFullscreen}
        opened={updateModalOpened}
        close={() => {
          setFormData({});
          closeUpdateModal();
        }}
        updateTable={handleUpdateTable}
      />

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
