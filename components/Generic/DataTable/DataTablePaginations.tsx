'use client';

import { Group, Pagination, Paper, Select, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

const DataTablePaginationClient = ({
  perPage,
  page,
  lastPage,
  from,
  to,
  total,
  setPage,
  setPerPage,
}: DataTablePaginationProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');

  return (
    <Paper p={'md'}>
      <Group justify={'space-between'}>
        <Group>
          <Text size={lgScreenAndBelow ? 'xs' : 'sm'}>Result Per Page</Text>
          <Select
            size={'xs'}
            w={70}
            placeholder='Per Page'
            value={perPage.toString()}
            data={['10', '20', '50', '100']}
            onChange={(_value, option) =>
              setPerPage && setPerPage(parseInt(_value ?? '10'))
            }
          />
          <Text size={lgScreenAndBelow ? 'xs' : 'sm'}>
            {from.toString() ?? '0'} - {to.toString() ?? '0'} of{' '}
            {total.toString() ?? '0'}
          </Text>
        </Group>

        <Pagination
          value={page}
          onChange={setPage}
          total={lastPage ?? 0}
          size={lgScreenAndBelow ? 'xs' : 'sm'}
          radius='xl'
          color={'var(--mantine-color-primary-9)'}
          withEdges
        />
      </Group>
    </Paper>
  );
};

export default DataTablePaginationClient;
