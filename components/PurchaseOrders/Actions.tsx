import { Loader } from '@mantine/core';
import { Menu } from '@mantine/core';
import {
  IconArrowBack,
  IconArrowForward,
  IconArrowRightDashed,
  IconPackageImport,
  IconThumbUpFilled,
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
  status: PurchaseOrderStatus;
}) => {
  const pathname = usePathname();

  return (
    <>
      {['supply:*', ...getAllowedPermissions('iar', 'view')].some(
        (permission) => permissions?.includes(permission)
      ) &&
        [
          'for_inspection',
          'for_obligation',
          'for_disbursement',
          'for_payment',
          'completed',
        ].includes(status) &&
        pathname === '/procurement/po' && (
          <Menu.Item
            leftSection={
              <IconArrowRightDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/iar?search=${id}`}
          >
            Navigate to IAR
          </Menu.Item>
        )}
    </>
  );
};

const ActionsClient = ({
  permissions,
  id,
  status,
  handleOpenActionModal,
}: PurchaseOrderActionProps) => {
  return (
    <>
      {status === 'draft' &&
        ['supply:*', ...getAllowedPermissions('po', 'pending')].some(
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
                'Pending PO/JO',
                'Are you sure you want to set this Purchase/Job Order to pending?',
                'var(--mantine-color-gray-7)',
                'Set to Pending',
                `/purchase-orders/${id}/pending`
              )
            }
          >
            Pending for Approval
          </Menu.Item>
        )}

      {status === 'pending' &&
        ['supply:*', ...getAllowedPermissions('po', 'approve')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconThumbUpFilled
                color={'var(--mantine-color-green-9)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'approve',
                'Approve PO/JO',
                'Are you sure you want to approve this Purchase/Job?',
                'var(--mantine-color-green-7)',
                'Approve',
                `/purchase-orders/${id}/approve`
              )
            }
          >
            Approve
          </Menu.Item>
        )}

      {status === 'approved' &&
        ['supply:*', ...getAllowedPermissions('po', 'issue')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconArrowForward
                color={'var(--mantine-color-yellow-9)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'issue',
                'Issue PO/JO',
                'Are you sure you want to issue this Purchase/Job to supplier?',
                'var(--mantine-color-yellow-7)',
                'Issue',
                `/purchase-orders/${id}/issue`
              )
            }
          >
            Issue to Supplier
          </Menu.Item>
        )}

      {status === 'issued' &&
        ['supply:*', ...getAllowedPermissions('po', 'receive')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconArrowBack
                color={'var(--mantine-color-green-9)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'receive',
                'Receive Back PO/JO',
                'Are you sure you want to receive this Purchase/Job from supplier and set to "For Delivery"?',
                'var(--mantine-color-green-7)',
                'Receive',
                `/purchase-orders/${id}/receive`
              )
            }
          >
            Receive
          </Menu.Item>
        )}

      {status === 'for_delivery' &&
        ['supply:*', ...getAllowedPermissions('po', 'for-inspection')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconPackageImport
                color={'var(--mantine-color-green-9)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'delivered',
                'PO/JO Delivered',
                'Are you sure you want to set this Purchase/Job to "Delivered"?',
                'var(--mantine-color-green-7)',
                'Delivered',
                `/purchase-orders/${id}/delivered`
              )
            }
          >
            Delivered
          </Menu.Item>
        )}

      {[
        'delivered',
        'for_inspection',
        'for_obligation',
        'for_disbursement',
        'for_payment',
        'completed',
      ].includes(status) && (
        <>
          <Menu.Item color={'var(--mantine-color-gray-5)'}>
            No available action
          </Menu.Item>

          <Menu.Divider />
          <Menu.Label>Navigation</Menu.Label>
          <NavigationMenus id={id} permissions={permissions} status={status} />
        </>
      )}
    </>
  );
};

export default ActionsClient;
