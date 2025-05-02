import Helper from '@/utils/Helpers';
import { Badge, Loader, Tooltip } from '@mantine/core';
import {
  IconArrowForward,
  IconFileIsr,
  IconPackageImport,
  IconThumbUpFilled,
  IconTruckDelivery,
} from '@tabler/icons-react';
import React from 'react';

const StatusClient = ({
  size = 'md',
  status,
}: InspectionAcceptanceReportStatusProps) => {
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

    case 'inspected':
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

    case 'partially_accepted':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-yellow-9)'}
            variant={'light'}
            leftSection={<IconArrowForward size={18} stroke={1.5} />}
          >
            {Helper.formatStringHasUnderscores(status)}
          </Badge>
        </Tooltip>
      );

    case 'accepted':
      return (
        <Tooltip label={Helper.formatStringHasUnderscores(status)}>
          <Badge
            size={size}
            color={'var(--mantine-color-yellow-9)'}
            variant={'light'}
            leftSection={<IconTruckDelivery size={18} stroke={1.5} />}
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
