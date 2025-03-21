import Helper from '@/utils/Helpers';
import { Badge, Loader, Tooltip } from '@mantine/core';
import {
  IconAwardFilled,
  IconCancel,
  IconChecklist,
  IconDiscountCheckFilled,
  IconFileIsr,
  IconFileSearch,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from '@tabler/icons-react';
import React from 'react';

const StatusClient = ({ size = 'md', status }: PurchaseRequestStatusProps) => {
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

    case 'approved_cash_available':
      return (
        <Tooltip label={'Cash Available'}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-7)'}
            variant={'light'}
            leftSection={<IconDiscountCheckFilled size={18} stroke={1.5} />}
          >
            Approved - Cash Available
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
            leftSection={<IconThumbUpFilled size={18} stroke={1.5} />}
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

    case 'for_canvassing':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-7)'}
            variant={'light'}
            leftSection={<IconFileSearch size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'for_recanvassing':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-7)'}
            variant={'light'}
            leftSection={<IconFileSearch size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'for_abstract':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-7)'}
            variant={'light'}
            leftSection={<IconChecklist size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'partially_awarded':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-orange-9)'}
            variant={'light'}
            leftSection={<IconAwardFilled size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'awarded':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-green-9)'}
            variant={'light'}
            leftSection={<IconAwardFilled size={18} stroke={1.5} />}
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
