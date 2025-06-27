import { Loader } from '@mantine/core';
import { Menu } from '@mantine/core';
import {
  IconArrowLeftDashed,
  IconCancel,
  IconPackages,
} from '@tabler/icons-react';
import React from 'react';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavigationMenus = ({
  id,
  permissions,
  status,
}: {
  id: string;
  permissions?: string[];
  status: InventoryIssuanceStatus;
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
        href={`/inventories/supplies?search=${id}`}
      >
        Navigate to Property/Supplies
      </Menu.Item>
    </>
  );
};

const ActionsClient = ({
  permissions,
  id,
  status,
  handleOpenActionModal,
}: InventoryIssuanceActionProps) => {
  return (
    <>
      {status === 'draft' &&
        ['supply:*', ...getAllowedPermissions('inv-issuance', 'pending')].some(
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
                'Pending - For Issuance',
                'Are you sure you want to set this to pending - for issuance?',
                'var(--mantine-color-gray-7)',
                'Set to Pending',
                `/inventories/issuances/${id}/pending`
              )
            }
          >
            Pending - For Issuance
          </Menu.Item>
        )}

      {status === 'pending' &&
        ['supply:*', ...getAllowedPermissions('inv-issuance', 'issue')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconPackages
                color={'var(--mantine-color-green-9)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'issue',
                'Issue Property/Supplies to Recipient',
                'Are you sure you want to issue this property/supplies to recipient?',
                'var(--mantine-color-green-9)',
                'Issue',
                `/inventories/issuances/${id}/issue`
              )
            }
          >
            Issue to Recipient
          </Menu.Item>
        )}

      {status !== 'cancelled' &&
        ['supply:*', ...getAllowedPermissions('inv-issuance', 'cancel')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconCancel
                color={'var(--mantine-color-red-7)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'cancel',
                'Cancel Property/Supplies Issuance',
                'Are you sure you want to cancel this property/supplies issuance?',
                'var(--mantine-color-red-7)',
                'Cancel',
                `/inventories/issuances/${id}/cancel`
              )
            }
          >
            Cancel
          </Menu.Item>
        )}

      {['cancelled'].includes(status) && (
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
