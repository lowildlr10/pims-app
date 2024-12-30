'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import { ActionIcon, Select } from '@mantine/core';
import { Button, Card, Collapse, Flex, Group, Pagination, Paper, ScrollArea, Skeleton, Stack, Table, Text } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconPencil, IconPlus, IconSearch } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'department_name',
      label: 'Department',
      width: '70%'
    }, 
    {
      id: 'head',
      label: 'Department Head',
      width: '25%'
    }, 
    {
      id: 'show-sections',
      label: '',
      width: '5%'
    },
  ],
  body: [],
};

const DepartmentSectionClient = ({user, permissions}: DepartmentSectionProps) => {
  const [collapseStates, setCollapseStates] = useState<CollapseType>({})
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnSort, setColumnSort] = useState('department_name');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(defaultTableData ?? {});
  const [subTableHeader] = useState<TableHeader[]>([
    {
      id: 'section_name',
      label: 'Section',
      width: '70%'
    },
    {
      id: 'head',
      label: 'Section Head',
      width: '30%'
    }
  ]);

  const { data, isLoading } = useSWR<DepartmentResponse>(
    [
      `/accounts/departments`,
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
    ]: any) =>
      API.get(url, {
        search,
        page,
        per_page: perPage,
        column_sort: columnSort,
        sort_direction: sortDirection,
        paginated
      }),
    {
      refreshInterval: API_REFRESH_INTERVAL,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    setTableData((prevState) => ({
      ...prevState,
      body: data?.data ?? [],
    }));

    setCollapseStates({
      [data?.data[0]?.id as string]: true
    });
  }, [data]);

  const handleToggleCollapse = (id: string | undefined) => {
    if (!id) return;

    setCollapseStates({
      ...collapseStates,
      [id]: !collapseStates[id]
    })
  }

  return (
    <Stack>
      <Paper p={'sm'}>
        <Group justify={'space-between'}>
          <Button 
            size={'xs'}
            radius="xl"
            color={'var(--mantine-color-primary-9)'}
            leftSection={
              <IconPencil size={14} />
            }
          >Create</Button>

          <ActionIcon 
            variant={'outline'}
            size="md" 
            radius="xl" 
            color={'var(--mantine-color-primary-9)'}
          ><IconSearch size={14} stroke={3} />
          </ActionIcon>
        </Group>
      </Paper>

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
            <Table.Tr 
              bg={'var(--mantine-color-primary-9)'}
              c={'white'}
            >
              {tableData.head?.map(head => (
                <Table.Th 
                  key={head.id} 
                  w={head.width ?? undefined}
                >{head.label}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading && Array.from({ length: perPage }).map((_, i) => (
              <Table.Tr key={i}>
                <Table.Td colSpan={tableData.head?.length}>
                  <Skeleton height={30} radius="sm" />
                </Table.Td>
              </Table.Tr>
            ))}

            {!isLoading && tableData.body?.map((body: DepartmentType) => (
              <React.Fragment key={body.department_name}>
                <Table.Tr sx={{ cursor: 'pointer' }}>
                  <Table.Td fw={500}>
                    {body.department_name}
                  </Table.Td>
                  <Table.Td fw={500}>
                    {body?.head ? `${body?.head.firstname} ${body?.head.lastname}` : '-' }
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size={'xs'}
                      variant="light"
                      color={'var(--mantine-color-secondary-9)'}
                      rightSection={collapseStates[body.id ?? ''] ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />}
                      onClick={() => handleToggleCollapse(body.id)}
                    >
                      {collapseStates[body.id ?? ''] ? 'Hide' : 'Show'} Sections
                    </Button>
                  </Table.Td>
                </Table.Tr>

                {(typeof body?.sections !== 'undefined' && body?.sections?.length > 0) && (
                  <Table.Tr>
                    <Table.Td 
                      bg={'var(--mantine-color-tertiary-0)'} 
                      colSpan={tableData.head?.length} p={collapseStates[body.id ?? ''] ? undefined : 0}
                    >
                      <Collapse in={collapseStates[body.id ?? '']}>
                        <Table 
                          bg={'white'}  
                          verticalSpacing={'xs'} 
                          highlightOnHover 
                          withTableBorder 
                        >
                          <Table.Thead>
                            <Table.Tr bg={'var(--mantine-color-tertiary-8)'} c={'white'}>
                              {subTableHeader?.map(head => (
                                <Table.Th key={head.id} w={head.width}>{head.label}</Table.Th>
                              ))}
                            </Table.Tr>
                          </Table.Thead>

                          <Table.Tbody>
                            {body?.sections?.map(section => (
                              <Table.Tr key={section.section_name} sx={{ cursor: 'pointer' }}>
                                <Table.Td>{section.section_name}</Table.Td>
                                <Table.Td>{section?.head ? `${section?.head.firstname} ${section?.head.lastname}` : '-' }</Table.Td>
                              </Table.Tr>
                            ))}

                            <Table.Tr>
                              <Table.Td bg={'white'} colSpan={subTableHeader.length}>
                                <Button 
                                  size={'xs'} 
                                  color={'var(--mantine-color-primary-9)'}
                                  variant="outline"
                                  leftSection={<IconPlus size={12} />} 
                                  fullWidth
                                >Add Section</Button>
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

      <Paper p={'md'}>
        <Group justify={'space-between'}>
          <Group>
            <Text size="sm">Result Per Page</Text>
            <Select
              size={'xs'}
              w={70}
              placeholder="Per Page"
              value={perPage.toString()}
              data={['10', '20', '50', '100']}
              onChange={(_value, option) => setPerPage(parseInt(_value ?? '10'))}
            />
            <Text size={'sm'}>{data?.from ?? '0'} - {data?.to ?? '0'} of {data?.total ?? '0'}</Text>
          </Group>

          <Pagination 
            value={page} 
            onChange={setPage} 
            total={data?.last_page ?? 0}
            size={'xs'} 
            radius="xl"
            color={'var(--mantine-color-primary-9)'} 
            withEdges 
          />
        </Group>
      </Paper>
    </Stack>
  );
}

export default DepartmentSectionClient;