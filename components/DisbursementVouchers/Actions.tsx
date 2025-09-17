import { Loader } from '@mantine/core';
import { Menu } from '@mantine/core';
import {
  IconArrowLeftDashed,
  IconCashBanknoteMove,
  IconChecks,
  IconThumbDownFilled,
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
  status: DisbursementVoucherStatus;
}) => {
  const pathname = usePathname();

  return (
    <>
      {['budget:*', ...getAllowedPermissions('obr', 'view')].some(
        (permission) => permissions?.includes(permission)
      ) &&
        pathname.includes('/procurement/dv') && (
          <Menu.Item
            leftSection={
              <IconArrowLeftDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/obr?search=${poId}`}
          >
            Navigate to OBR
          </Menu.Item>
        )}
    </>
  );
};

const DvActionsClient = ({
  permissions,
  id,
  poId,
  status,
  handleOpenActionModal,
}: DisbursementVoucherActionProps) => {
  return (
    <>
      {status === 'draft' &&
        ['accountant:*', ...getAllowedPermissions('dv', 'pending')].some(
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
                'Pending Disbursement',
                'Are you sure you want to set this Disbursement Voucher to pending?',
                'var(--mantine-color-gray-7)',
                'Set to Pending',
                `/disbursement-vouchers/${id}/pending`
              )
            }
          >
            Pending for Disbursement
          </Menu.Item>
        )}

      {status === 'pending' &&
        ['accountant:*', ...getAllowedPermissions('dv', 'disburse')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconCashBanknoteMove
                color={'var(--mantine-color-orange-7)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'disburse',
                'Disburse DV',
                'Are you sure you want to disburse this Disbursement Voucher?',
                'var(--mantine-color-orange-7)',
                'Disburse',
                `/disbursement-vouchers/${id}/disburse`
              )
            }
          >
            Disburse
          </Menu.Item>
        )}

      {status === 'pending' &&
        ['accountant:*', ...getAllowedPermissions('dv', 'disapprove')].some(
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
                `/disbursement-vouchers/${id}/disapprove`,
                undefined,
                true
              )
            }
          >
            Disapprove
          </Menu.Item>
        )}

      {status === 'for_payment' &&
        ['accountant:*', ...getAllowedPermissions('dv', 'paid')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconChecks
                color={'var(--mantine-color-green-9)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'paid',
                'Paid DV',
                'Are you sure you want to set this Disbursement Voucher to "Paid"?',
                'var(--mantine-color-green-9)',
                'Paid',
                `/disbursement-vouchers/${id}/paid`
              )
            }
          >
            Paid
          </Menu.Item>
        )}

      {['disapproved', 'paid'].includes(status) && (
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
}: DisbursementVoucherActionProps) => {
  const pathname = usePathname();

  return (
    <>
      {pathname.includes('/procurement/dv') && (
        <DvActionsClient
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
