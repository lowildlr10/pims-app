import Helper from '@/utils/Helpers';
import { Badge, Loader, Tooltip } from '@mantine/core';
import { IconCancel, IconCheck, IconFileIsr } from '@tabler/icons-react';
import React from 'react';

const StatusClient = ({ size = 'md', status }: RequestQuotationStatusProps) => {
  switch (status) {
    case 'draft':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-gray-9)'}
            variant={'light'}
            leftSection={<IconFileIsr size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'canvassing':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-gray-7)'}
            variant={'light'}
            leftSection={
              <Loader size={12} color={'var(--mantine-color-gray-7)'} />
            }
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'completed':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-9)'}
            variant={'light'}
            leftSection={<IconCheck size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'cancelled':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-red-7)'}
            variant={'light'}
            leftSection={<IconCancel size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    default:
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status ?? '-')}>
          <Badge
            size={size}
            color={'var(--mantine-color-gray-9)'}
            variant={'light'}
          >
            {Helper.formatStringHasUnderscores(status ?? '-')}
          </Badge>
        </Tooltip>
      );
  }
};

export default StatusClient;
