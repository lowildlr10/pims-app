import Helper from '@/utils/Helpers';
import { Badge, Loader, Tooltip } from '@mantine/core';
import {
  IconCashBanknoteMove,
  IconChecks,
  IconFileIsr,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from '@tabler/icons-react';
import React from 'react';

const StatusClient = ({
  size = 'md',
  status,
}: DisbursementVoucherStatusProps) => {
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

    case 'pending':
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

    case 'for_payment':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-orange-7)'}
            variant={'light'}
            leftSection={<IconCashBanknoteMove size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'disapproved':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-red-9)'}
            variant={'light'}
            leftSection={<IconThumbDownFilled size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'paid':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-9)'}
            variant={'light'}
            leftSection={<IconChecks size={18} stroke={1.5} />}
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
