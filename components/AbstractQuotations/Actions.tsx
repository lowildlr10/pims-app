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
}: RequestQuotationActionProps) => {
  return (
    <>
      {status === 'draft' &&
        ['supply:*', ...getAllowedPermissions('rfq', 'issue')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <Loader size={12} color={'var(--mantine-color-gray-7)'} />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'issue_canvassing',
                'Issue for Canvassing',
                'Are you sure you want to issue this Request for Quotation for canvassing?',
                'var(--mantine-color-gray-7)',
                'Issue',
                `/request-quotations/${id}/issue-canvassing`
              )
            }
          >
            Issue for Canvassing
          </Menu.Item>
        )}

      {status === 'canvassing' &&
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
                'canvass_complete',
                'Canvass Complete',
                'Are you sure you want to set this Request for Quotation to completed?',
                'var(--mantine-color-green-7)',
                'Complete',
                `/request-quotations/${id}/canvass-complete`
              )
            }
          >
            Completed
          </Menu.Item>
        )}

      {status !== 'cancelled' &&
        status !== 'completed' &&
        ['supply:*', ...getAllowedPermissions('rfq', 'cancel')].some(
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
                'Are you sure you want to cancel this Request for Quotation?',
                'var(--mantine-color-red-7)',
                'Cancel',
                `/request-quotations/${id}/cancel`
              )
            }
          >
            Cancel RFQ
          </Menu.Item>
        )}

      {(status === 'cancelled' || status === 'completed') && (
        <Menu.Item color={'var(--mantine-color-gray-5)'}>
          No available action
        </Menu.Item>
      )}
    </>
  );
};

export default ActionsClient;
