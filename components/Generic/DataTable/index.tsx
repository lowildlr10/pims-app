'use client';

import React, { useEffect, useState } from 'react';
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

const DataTableClient = ({
  permissions,
  columnSort,
  sortDirection,
  search,
  showSearch,
  data,
  perPage,
  loading,
  page,
  lastPage,
  from,
  to,
  total,
  onChange,
}: DataTableProps) => {
  const [collapseStates, setCollapseStates] = useState<CollapseType>({});
  const [hasSubBody, setHasSubBody] = useState(false);
  const [tableSearch, setTableSearch] = useState(search);
  const [tablePage, setTablePage] = useState(page);
  const [tablePerPage, setTablePerPage] = useState(perPage);
  const [tableColumnSort, setTableColumnSort] = useState(columnSort);
  const [tableSortDirection, setTableSortDirection] = useState(sortDirection);

  useEffect(() => {
    data.body?.forEach((body: any) => {
      if (body?.subBody?.length > 0) setHasSubBody(true);
    });

    setCollapseStates({
      [data?.body[0]?.id as string]: true,
    });
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

  return (
    <Stack>
      <DataTableActionsClient
        permissions={permissions}
        search={tableSearch}
        setSearch={setTableSearch}
        showSearch={showSearch}
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
              data.body?.map((body: any) => (
                <React.Fragment key={body.id}>
                  <Table.Tr sx={{ cursor: 'pointer' }}>
                    {data.head?.map(
                      (head, i) =>
                        body[head.id] && (
                          <Table.Td key={`${body.id}-${body[head.id]}-${i}`} fw={500} onClick={() => alert(body.id)}>
                            {body[head.id]}
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
                          Sections
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
                                  key={subBody.section_name}
                                  sx={{ cursor: 'pointer' }}
                                >
                                  {data.subHead?.map(
                                    (subHead) =>
                                      subBody[subHead.id] && (
                                        <Table.Td
                                          key={subBody[subHead.id]}
                                          fw={500}
                                          onClick={() => alert(subBody.id)}
                                        >
                                          {subBody[subHead.id]}
                                        </Table.Td>
                                      )
                                  )}
                                </Table.Tr>
                              ))}

                              <Table.Tr>
                                <Table.Td
                                  bg={'white'}
                                  colSpan={data.head?.length}
                                >
                                  <Button
                                    size={'xs'}
                                    color={'var(--mantine-color-secondary-9)'}
                                    variant='outline'
                                    leftSection={<IconPlus size={12} />}
                                    fullWidth
                                  >
                                    Add
                                  </Button>
                                </Table.Td>
                              </Table.Tr>
                            </Table.Tbody>
                          </Table>
                        </Collapse>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </React.Fragment>
              ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

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
