'use client';

import { Group, Pagination, Select, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

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
  const isMobile = useMediaQuery('(max-width: 600px)');
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Stack gap={isMobile ? 'xs' : 0}>
      <Group justify={'space-between'} wrap='wrap' gap='xs'>
        <Group gap='xs'>
          <Select
            size={'xs'}
            w={65}
            radius='md'
            placeholder='Per Page'
            value={perPage.toString()}
            data={['10', '20', '50', '100']}
            onChange={(_value) => {
              if (setPerPage) setPerPage(parseInt(_value ?? '10'));
              if (setPage) setPage(1);
            }}
          />
          <Text size='xs' c='dimmed'>
            {from.toString() ?? '0'} - {to.toString() ?? '0'} of{' '}
            {total.toString() ?? '0'}
          </Text>
        </Group>

        <Pagination
          value={page}
          onChange={setPage}
          total={lastPage ?? 0}
          size={lgScreenAndBelow ? 'xs' : 'sm'}
          radius='md'
          color={'var(--mantine-color-primary-9)'}
          withEdges
          siblings={isMobile ? 0 : 1}
          boundaries={isMobile ? 0 : 1}
        />
      </Group>
    </Stack>
  );
};

export default DataTablePaginationClient;
