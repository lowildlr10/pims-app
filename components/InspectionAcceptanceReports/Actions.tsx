import { Loader } from '@mantine/core';
import { Menu } from '@mantine/core';
import {
  IconArrowLeftDashed,
  IconArrowRightDashed,
  IconShoppingCartSearch,
} from '@tabler/icons-react';
import React from 'react';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import InspectContent from './ActionModalContents/InspectContent';

const NavigationMenus = ({
  id,
  permissions,
  status,
}: {
  id: string;
  permissions?: string[];
  status: InspectionAcceptanceReportStatus;
}) => {
  const pathname = usePathname();

  return (
    <>
      <Menu.Item
        leftSection={
          <IconArrowLeftDashed
            color={'var(--mantine-color-primary-9)'}
            size={18}
            stroke={1.5}
          />
        }
        component={Link}
        href={`/procurement/po?search=${id}`}
      >
        Navigate to PO/JO
      </Menu.Item>

      {['supply:*', ...getAllowedPermissions('ors', 'view')].some(
        (permission) => permissions?.includes(permission)
      ) &&
        ['inspected', 'partially_completed', 'completed'].includes(status) &&
        pathname === '/procurement/iar' && (
          <Menu.Item
            leftSection={
              <IconArrowRightDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/ors?search=${id}`}
          >
            Navigate to ORS
          </Menu.Item>
        )}
      {['supply:*', ...getAllowedPermissions('ors', 'view')].some(
        (permission) => permissions?.includes(permission)
      ) &&
        ['inspected', 'partially_completed', 'completed'].includes(status) &&
        pathname === '/procurement/iar' && (
          <Menu.Item
            leftSection={
              <IconArrowRightDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/inventories/supplies?search=${id}`}
          >
            Navigate to Inventory Supply
          </Menu.Item>
        )}
    </>
  );
};

const ActionsClient = ({
  permissions,
  id,
  status,
  documentType,
  handleOpenActionModal,
}: InspectionAcceptanceReportActionProps) => {
  return (
    <>
      {status === 'draft' &&
        ['supply:*', ...getAllowedPermissions('iar', 'pending')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <Loader size={12} color={'var(--mantine-color-gray-7)'} />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'pending',
                'Pending IAR',
                'Are you sure you want to set this Inspection and Acceptance Report to pending?',
                'var(--mantine-color-gray-7)',
                'Set to Pending',
                `/inspection-acceptance-reports/${id}/pending`
              )
            }
          >
            Pending for Inspection
          </Menu.Item>
        )}

      {status === 'pending' &&
        ['supply:*', ...getAllowedPermissions('iar', 'inspect')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconShoppingCartSearch
                color={'var(--mantine-color-green-9)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'inspect',
                documentType === 'po'
                  ? 'Inspect and Create Property & Supplies'
                  : 'Inspect',
                <InspectContent id={id} documentType={documentType} />,
                'var(--mantine-color-green-7)',
                'Inspect',
                `/inspection-acceptance-reports/${id}/inspect`,
                undefined,
                documentType === 'po',
                undefined,
                documentType === 'po'
              )
            }
          >
            Inspect
          </Menu.Item>
        )}

      {['inspected'].includes(status) && (
        <>
          <Menu.Item color={'var(--mantine-color-gray-5)'}>
            No available action
          </Menu.Item>
        </>
      )}

      <Menu.Divider />
      <Menu.Label>Navigation</Menu.Label>
      <NavigationMenus id={id} permissions={permissions} status={status} />
    </>
  );
};

export default ActionsClient;
