import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { Menu } from '@mantine/core';
import { IconTableShare } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

const ActionsClient = ({
  permissions,
  id,
  status,
  handleOpenActionModal,
}: InventorySupplyActionProps) => {
  return (
    <>
      {status === 'in-stock' &&
      ['supply:*', ...getAllowedPermissions('inv-issuance', 'create')].some(
        (permission) => permissions?.includes(permission)
      ) ? (
        <Menu.Item
          component={Link}
          href={'/inventories/issuances'}
          leftSection={
            <IconTableShare
              color={'var(--mantine-color-primary-9)'}
              size={18}
              stroke={1.5}
            />
          }
        >
          Create Issuance
        </Menu.Item>
      ) : (
        <Menu.Item color={'var(--mantine-color-gray-5)'}>
          No available action
        </Menu.Item>
      )}

      {status === 'out-of-stock' && (
        <Menu.Item color={'var(--mantine-color-gray-5)'}>
          No available action
        </Menu.Item>
      )}
    </>
  );
};

export default ActionsClient;
