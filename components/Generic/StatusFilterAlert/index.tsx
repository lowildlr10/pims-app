'use client';

import Helper from '@/utils/Helpers';
import { Alert, Button, Group, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconInfoCircle, IconSquareXFilled } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import React from 'react';

const StatusFilterALert = ({ status }: { status: string }) => {
  const pathname = usePathname();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Alert
      variant='light'
      color='var(--mantine-color-primary-9)'
      radius='xs'
      title='Showing records with status:'
      mb='md'
      icon={<IconInfoCircle size={20} />}
    >
      <Group align='center' gap={5}>
        {status.split(',').map((s, i) => (
          <Text key={i} fw={500} size={lgScreenAndBelow ? 'xs' : 'sm'}>
            {Helper.formatStringHasUnderscores(s)}
            {i < status.split(',').length - 1 ? ', ' : ''}
          </Text>
        ))}
        &nbsp;
        <Button
          variant='light'
          color='var(--mantine-color-red-7)'
          size={'compact-xs'}
          onClick={() => (window.location.href = pathname)}
          px={6}
          radius='sm'
          leftSection={<IconSquareXFilled size={15} />}
        >
          Clear
        </Button>
      </Group>
    </Alert>
  );
};

export default StatusFilterALert;
