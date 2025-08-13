import { Loader } from '@mantine/core';
import { Menu } from '@mantine/core';
import {
  IconArrowForward,
  IconArrowLeftDashed,
  IconArrowRightDashed,
  IconAwardFilled,
  IconCancel,
  IconChecklist,
  IconDiscountCheckFilled,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from '@tabler/icons-react';
import React from 'react';
import Link from 'next/link';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { usePathname } from 'next/navigation';
import DisapproveContent from './ActionModalContents/DisapproveContent';

const NavigationMenus = ({
  id,
  permissions,
  status,
}: {
  id: string;
  permissions?: string[];
  status: PurchaseRequestStatus;
}) => {
  const pathname = usePathname();

  return (
    <>
      {['supply:*', ...getAllowedPermissions('rfq', 'view')].some(
        (permission) => permissions?.includes(permission)
      ) &&
        [
          'approved',
          'for_canvassing',
          'for_recanvassing',
          'for_abstract',
          'partially_awarded',
          'awarded',
          'completed',
        ].includes(status) &&
        pathname.includes('/procurement/pr') && (
          <Menu.Item
            leftSection={
              <IconArrowRightDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/rfq?search=${id}`}
          >
            Navigate to RFQ
          </Menu.Item>
        )}

      {['supply:*', ...getAllowedPermissions('aoq', 'view')].some(
        (permission) => permissions?.includes(permission)
      ) &&
        [
          'for_recanvassing',
          'for_abstract',
          'partially_awarded',
          'awarded',
          'completed',
        ].includes(status) &&
        pathname.includes('/procurement/rfq') && (
          <Menu.Item
            leftSection={
              <IconArrowRightDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/aoq?search=${id}`}
          >
            Navigate to Abstract
          </Menu.Item>
        )}

      {['supply:*', ...getAllowedPermissions('po', 'view')].some((permission) =>
        permissions?.includes(permission)
      ) &&
        ['partially_awarded', 'awarded', 'completed'].includes(status) &&
        pathname.includes('/procurement/aoq') && (
          <Menu.Item
            leftSection={
              <IconArrowRightDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/po?search=${id}`}
          >
            Navigate to PO
          </Menu.Item>
        )}

      {['supply:*', ...getAllowedPermissions('pr', 'view')].some((permission) =>
        permissions?.includes(permission)
      ) &&
        [
          'approved',
          'for_canvassing',
          'for_recanvassing',
          'for_abstract',
          'partially_awarded',
          'awarded',
          'completed',
        ].includes(status) &&
        pathname.includes('/procurement/rfq') && (
          <Menu.Item
            leftSection={
              <IconArrowLeftDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/pr?search=${id}`}
          >
            Navigate back to PR
          </Menu.Item>
        )}

      {['supply:*', ...getAllowedPermissions('rfq', 'view')].some(
        (permission) => permissions?.includes(permission)
      ) &&
        [
          'for_recanvassing',
          'for_abstract',
          'partially_awarded',
          'awarded',
          'completed',
        ].includes(status) &&
        pathname.includes('/procurement/aoq') && (
          <Menu.Item
            leftSection={
              <IconArrowLeftDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/rfq?search=${id}`}
          >
            Navigate back to RFQ
          </Menu.Item>
        )}

      {['supply:*', ...getAllowedPermissions('aoq', 'view')].some(
        (permission) => permissions?.includes(permission)
      ) &&
        ['partially_awarded', 'awarded', 'completed'].includes(status) &&
        pathname.includes('/procurement/po') && (
          <Menu.Item
            leftSection={
              <IconArrowLeftDashed
                color={'var(--mantine-color-primary-9)'}
                size={18}
                stroke={1.5}
              />
            }
            component={Link}
            href={`/procurement/aoq?search=${id}`}
          >
            Navigate back to Abstract
          </Menu.Item>
        )}
    </>
  );
};

const PrActionsClient = ({
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
              <Loader size={12} color={'var(--mantine-color-gray-7)'} />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'pending',
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
          ...getAllowedPermissions('pr', 'approve-cash-available'),
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
                    <DisapproveContent />,
                    'var(--mantine-color-red-9)',
                    'Disapprove',
                    `/purchase-requests/${id}/disapprove`,
                    undefined,
                    true
                  )
                }
              >
                Disapprove
              </Menu.Item>
            )}
        </>
      )}
    </>
  );
};

const RfqActionsClient = ({
  permissions,
  id,
  status,
  handleOpenActionModal,
}: PurchaseRequestActionProps) => {
  return (
    <>
      {['for_canvassing', 'for_recanvassing'].includes(status) &&
        ['supply:*', ...getAllowedPermissions('pr', 'approve-rfq')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconChecklist
                color={'var(--mantine-color-green-7)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'approve',
                'Approve RFQs',
                `Are you sure you want to approve the 
                ${status === 'for_canvassing' ? 'RFQs' : 'new RFQs'} 
                for this Purchase Request for Abstract of Quotation?`,
                'var(--mantine-color-green-7)',
                'Approve',
                `/purchase-requests/${id}/approve-request-quotations`
              )
            }
          >
            {status === 'for_canvassing' && 'Approve RFQs'}
            {status === 'for_recanvassing' && 'Approve New RFQs'}
          </Menu.Item>
        )}

      {['approved', 'for_canvassing', 'for_recanvassing'].includes(status) &&
        ['supply:*', ...getAllowedPermissions('rfq', 'issue')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconArrowForward
                color={'var(--mantine-color-yellow-3)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'issue',
                'Issue All draft RFQ for Canvassing',
                'Are you sure you want to issue all draft Request for Quotation to "for canvassing"?',
                'var(--mantine-color-yellow-7)',
                'Issue',
                `/purchase-requests/${id}/issue-all-request-quotations`
              )
            }
          >
            Issue All RFQ for Canvassing
          </Menu.Item>
        )}
    </>
  );
};

const AoqActionsClient = ({
  permissions,
  id,
  status,
  handleOpenActionModal,
}: PurchaseRequestActionProps) => {
  return (
    <>
      {['for_abstract' /* , 'partially_awarded' */].includes(status) &&
        ['supply:*', ...getAllowedPermissions('pr', 'award-aoq')].some(
          (permission) => permissions?.includes(permission)
        ) && (
          <Menu.Item
            leftSection={
              <IconAwardFilled
                color={'var(--mantine-color-lime-9)'}
                size={18}
                stroke={1.5}
              />
            }
            onClick={() =>
              handleOpenActionModal &&
              handleOpenActionModal(
                'award',
                'Award Abstract',
                `Are you sure you want to proceed with awarding the approved Abstract of Quotation?`,
                'var(--mantine-color-green-7)',
                'Award',
                `/purchase-requests/${id}/award-abstract-quotations`
              )
            }
          >
            Award Abstract
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
}: PurchaseRequestActionProps) => {
  const pathname = usePathname();

  return (
    <>
      {pathname.includes('/procurement/pr') && (
        <PrActionsClient
          permissions={permissions}
          id={id}
          status={status}
          handleOpenActionModal={handleOpenActionModal}
        />
      )}

      {pathname.includes('/procurement/rfq') && (
        <RfqActionsClient
          permissions={permissions}
          id={id}
          status={status}
          handleOpenActionModal={handleOpenActionModal}
        />
      )}

      {pathname.includes('/procurement/aoq') && (
        <AoqActionsClient
          permissions={permissions}
          id={id}
          status={status}
          handleOpenActionModal={handleOpenActionModal}
        />
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
                `/purchase-requests/${id}/cancel`,
                `/procurement/pr?search=${id}`
              )
            }
          >
            Cancel PR
          </Menu.Item>
        )}

      {status === 'cancelled' && (
        <Menu.Item color={'var(--mantine-color-gray-5)'}>
          No available action
        </Menu.Item>
      )}

      {![
        'draft',
        'pending',
        'disapproved',
        'approved_cash_available',
        'cancelled',
      ].includes(status ?? '') && (
          <>
            <Menu.Divider />
            <Menu.Label>Navigation</Menu.Label>
            <NavigationMenus id={id} permissions={permissions} status={status} />
          </>
        )}
    </>
  );
};

export default ActionsClient;
