import { Loader } from '@mantine/core';
import { Menu } from '@mantine/core';
import {
  IconArrowRightDashed,
  IconCancel,
  IconDiscountCheckFilled,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from '@tabler/icons-react';
import React from 'react';
import Link from 'next/link';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const ActionsClient = ({
  permissions,
  id,
  status,
  handleOpenActionModal,
}: PurchaseRequestActionProps) => {
  return (
    <>
      {status === 'draft' &&
        ['supply:*', ...getAllowedPermissions('pr', 'submit')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <Loader size={16} color={'var(--mantine-color-gray-7)'} />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'submit_approval',
                'Submit for Approval',
                'Are you sure you want to submit this Purchase Request for approval?',
                'var(--mantine-color-gray-7)',
                'Submit',
                `/purchase-requests/${id}/submit-approval`
              )
            }
          >
            Submit for Approval
          </Menu.Item>
        )}

      {status === 'pending' &&
        [
          'budget:*',
          'supply:*',
          ...getAllowedPermissions('pr', 'approve_cash_available'),
        ].some((permission) => permissions?.includes(permission)) && (
          <Menu.Item
            leftSection={
              <IconDiscountCheckFilled
                color={'var(--mantine-color-green-7)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'approve_cash_available',
                'Approve for Cash Availability',
                'Are you sure you want to approve this Purchase Request for cash availability?',
                'var(--mantine-color-green-7)',
                'Approve',
                `/purchase-requests/${id}/approve-cash-availability`
              )
            }
          >
            Approve for Cash Availability
          </Menu.Item>
        )}

      {status === 'approved_cash_available' && (
        <>
          {[
            'head:*',
            'supply:*',
            ...getAllowedPermissions('pr', 'approve'),
          ].some((permission) => permissions?.includes(permission)) && (
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
                  'Approve',
                  'Are you sure you want to approve this Purchase Request?',
                  'var(--mantine-color-green-9)',
                  'Approve',
                  `/purchase-requests/${id}/approve`
                )
              }
            >
              Approve
            </Menu.Item>
          )}

          {[
            'head:*',
            'supply:*',
            ...getAllowedPermissions('pr', 'disapprove'),
          ].some((permission) => permissions?.includes(permission)) && (
            <Menu.Item
              leftSection={
                <IconThumbDownFilled
                  color={'var(--mantine-color-red-9)'}
                  size={18}
                  stroke={1.5}
                />
              }
              onClick={() =>
                handleOpenActionModal &&
                handleOpenActionModal(
                  'disapprove',
                  'Disapprove',
                  'Are you sure you want to disapprove this Purchase Request?',
                  'var(--mantine-color-red-9)',
                  'Disapprove',
                  `/purchase-requests/${id}/disapprove`
                )
              }
            >
              Disapprove
            </Menu.Item>
          )}
        </>
      )}

      {['supply:*', ...getAllowedPermissions('rfq', 'view')].some(
        (permission) => permissions?.includes(permission)
      ) &&
        [
          'approved',
          'for_canvassing',
          'for_abstract',
          'for_po',
          'completed',
        ].includes(status) && (
          <Menu.Item
            rightSection={
              <IconArrowRightDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={'/procurement/rfq'}
          >
            Navigate to RFQ
          </Menu.Item>
        )}

      {status !== 'cancelled' &&
        ['supply:*', ...getAllowedPermissions('pr', 'cancel')].some(
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
                'Cancel',
                'Are you sure you want to cancel this Purchase Request?',
                'var(--mantine-color-red-7)',
                'Cancel',
                `/purchase-requests/${id}/cancel`
              )
            }
          >
            Cancel
          </Menu.Item>
        )}

      {status === 'cancelled' && (
        <Menu.Item color={'var(--mantine-color-gray-5)'}>
          No available action
        </Menu.Item>
      )}
    </>
  );
};

export default ActionsClient;
