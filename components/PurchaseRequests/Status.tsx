import Helper from '@/utils/Helpers';
import { Badge, Loader, Tooltip } from '@mantine/core';
import {
  IconAwardFilled,
  IconCancel,
  IconDiscountCheckFilled,
  IconFileDollar,
  IconFileIsr,
  IconFileSearch,
  IconThumbDownFilled,
  IconThumbUp,
} from '@tabler/icons-react';
import React from 'react';

const Status = ({ status }: PurchaseRequestStatusProps) => {
  switch (status) {
    case 'draft':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={'md'}
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
            size={'md'}
            color={'var(--mantine-color-gray-7)'}
            variant={'light'}
            leftSection={
              <Loader size={16} color={'var(--mantine-color-gray-7)'} />
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
            size={'md'}
            color={'var(--mantine-color-green-7)'}
            variant={'light'}
            leftSection={<IconDiscountCheckFilled size={18} stroke={1.5} />}
          >
            {'Signed - Cash Available'}
          </Badge>
        </Tooltip>
      );

    case 'approved':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={'md'}
            color={'var(--mantine-color-green-9)'}
            variant={'light'}
            leftSection={<IconThumbUp size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'disapproved':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={'md'}
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
            size={'md'}
            color={'var(--mantine-color-gray-9)'}
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
            size={'md'}
            color={'var(--mantine-color-blue-7)'}
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
            size={'md'}
            color={'var(--mantine-color-blue-7)'}
            variant={'light'}
            leftSection={<IconFileDollar size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'for_po':
      return (
        <Tooltip label={'For PO/JO'}>
          <Badge
            size={'md'}
            color={'var(--mantine-color-lime-9)'}
            variant={'light'}
            leftSection={<IconAwardFilled size={18} stroke={1.5} />}
          >
            {'For PO/JO'}
          </Badge>
        </Tooltip>
      );

    default:
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status ?? '-')}>
          <Badge
            size={'md'}
            color={'var(--mantine-color-gray-9)'}
            variant={'light'}
          >
            {Helper.formatStringHasUnderscores(status ?? '-')}
          </Badge>
        </Tooltip>
      );
  }
};

export default Status;
