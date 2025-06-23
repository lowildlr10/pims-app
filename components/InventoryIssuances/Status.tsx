import Helper from '@/utils/Helpers';
import { Badge, Tooltip } from '@mantine/core';
import { IconPackageOff, IconPackages } from '@tabler/icons-react';
import React from 'react';

const StatusClient = ({
  size = 'md',
  status,
}: InventoryIssuanceStatusProps) => {
  switch (status) {
    case 'draft':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-9)'}
            variant={'light'}
            leftSection={<IconPackages size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'approved':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-9)'}
            variant={'light'}
            leftSection={<IconPackages size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'pending':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-9)'}
            variant={'light'}
            leftSection={<IconPackages size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'issued':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-9)'}
            variant={'light'}
            leftSection={<IconPackages size={18} stroke={1.5} />}
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
