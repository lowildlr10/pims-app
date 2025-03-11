import { Loader } from '@mantine/core';
import { Menu } from '@mantine/core';
import { IconCancel, IconCheck } from '@tabler/icons-react';
import React from 'react';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const ActionsClient = ({
  permissions,
  id,
  status,
  handleOpenActionModal,
}: AbstractQuotationActionProps) => {
  return (
    <>
      {status === 'draft' &&
        ['supply:*', ...getAllowedPermissions('aoq', 'pending')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <Loader size={12} color={'var(--mantine-color-gray-7)'} />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'pending_abstract',
                'Pending Abstract',
                'Are you sure you want to set this Abstract of Bids and Quotation to pending?',
                'var(--mantine-color-gray-7)',
                'Set to Pending',
                `/abstract-quotations/${id}/pending`
              )
            }
          >
            Set to Pending
          </Menu.Item>
        )}

      {status === 'pending' &&
        ['supply:*', ...getAllowedPermissions('rfq', 'complete')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconCheck
                color={'var(--mantine-color-green-9)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'approve_abstract',
                'Approve Abstract',
                'Are you sure you want to set this Abstract of Bids and Quotation to approved?',
                'var(--mantine-color-green-7)',
                'Approve',
                `/abstract-quotations/${id}/approve`
              )
            }
          >
            Approve
          </Menu.Item>
        )}

      {status === 'approved' && (
        <Menu.Item color={'var(--mantine-color-gray-5)'}>
          No available action
        </Menu.Item>
      )}
    </>
  );
};

export default ActionsClient;
