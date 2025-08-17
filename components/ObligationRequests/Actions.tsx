import { Loader } from '@mantine/core';
import { Menu } from '@mantine/core';
import {
  IconArrowLeftDashed,
  IconArrowRightDashed,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from '@tabler/icons-react';
import React from 'react';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import DisapproveContent from './ActionModalContents/DisapproveContent';

const NavigationMenus = ({
  id,
  poId,
  permissions,
  status,
}: {
  id: string;
  poId: string;
  permissions?: string[];
  status: ObligationRequestStatus;
}) => {
  const pathname = usePathname();

  return (
    <>
      {['supply:*', ...getAllowedPermissions('iar', 'view')].some(
        (permission) => permissions?.includes(permission)
      ) &&
        pathname.includes('/procurement/obr') && (
          <Menu.Item
            leftSection={
              <IconArrowLeftDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/iar?search=${poId}`}
          >
            Navigate to IAR
          </Menu.Item>
        )}

      {status === 'obligated' &&
        ['accountant:*', ...getAllowedPermissions('dv', 'view')].some(
          (permission) => permissions?.includes(permission)
        ) &&
        pathname.includes('/procurement/obr') && (
          <Menu.Item
            leftSection={
              <IconArrowRightDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/dv?search=${poId}`}
          >
            Navigate to DV
          </Menu.Item>
        )}
    </>
  );
};

const ObrActionsClient = ({
  permissions,
  id,
  poId,
  status,
  handleOpenActionModal,
}: ObligationRequestActionProps) => {
  return (
    <>
      {status === 'draft' &&
        ['budget:*', ...getAllowedPermissions('obr', 'pending')].some(
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
                'Pending Obligation',
                'Are you sure you want to set this Obligation Request to pending?',
                'var(--mantine-color-gray-7)',
                'Set to Pending',
                `/obligation-requests/${id}/pending`
              )
            }
          >
            Pending for Obligation
          </Menu.Item>
        )}

      {status === 'pending' &&
        ['budget:*', ...getAllowedPermissions('obr', 'obligate')].some(
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
                'obligate',
                'Obligate OBR',
                'Are you sure you want to obligate this Obligation Request?',
                'var(--mantine-color-green-7)',
                'Obligate',
                `/obligation-requests/${id}/obligate`
              )
            }
          >
            Obligate
          </Menu.Item>
        )}

      {status === 'pending' &&
        ['budget:*', ...getAllowedPermissions('obr', 'disapprove')].some(
          (permission) => permissions?.includes(permission)
        ) && (
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
                <DisapproveContent />,
                'var(--mantine-color-red-9)',
                'Disapprove',
                `/obligation-requests/${id}/disapprove`,
                undefined,
                true
              )
            }
          >
            Disapprove
          </Menu.Item>
        )}

      {['disapproved', 'obligated'].includes(status) && (
        <Menu.Item color={'var(--mantine-color-gray-5)'}>
          No available action
        </Menu.Item>
      )}

      <Menu.Divider />
      <Menu.Label>Navigation</Menu.Label>
      <NavigationMenus
        id={id}
        poId={poId}
        permissions={permissions}
        status={status}
      />
    </>
  );
};

const ActionsClient = ({
  permissions,
  id,
  poId,
  status,
  handleOpenActionModal,
}: ObligationRequestActionProps) => {
  const pathname = usePathname();

  return (
    <>
      {pathname.includes('/procurement/obr') && (
        <ObrActionsClient
          permissions={permissions}
          id={id}
          poId={poId}
          status={status}
          handleOpenActionModal={handleOpenActionModal}
        />
      )}
    </>
  );
};

export default ActionsClient;
