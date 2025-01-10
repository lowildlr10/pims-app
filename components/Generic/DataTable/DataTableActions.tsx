'use client';

import React from 'react';
import { ActionIcon, Button, Group, Paper } from '@mantine/core';
import { IconPencilPlus, IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import SearchModalClient from '../Modal/SearchModal';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const DataTableActionsClient = ({
  permissions,
  search,
  module,
  showSearch,
  showCreate,
  setSearch,
  handleOpenCreateModal,
}: DataTableActionsProps) => {
  const [
    searchModalOpened,
    { open: openSearchModal, close: closeSearchModal },
  ] = useDisclosure(false);

  return (
    <Paper p={'sm'}>
      <Group justify={'space-between'}>
        {showCreate &&
        getAllowedPermissions(module, 'create')?.some((permission) =>
          permissions.includes(permission)
        ) ? (
          <Button
            size={'xs'}
            radius='sm'
            color={'var(--mantine-color-primary-9)'}
            leftSection={<IconPencilPlus size={14} />}
            onClick={() =>
              handleOpenCreateModal &&
              handleOpenCreateModal(null, module ?? null)
            }
          >
            Create
          </Button>
        ) : (
          <div></div>
        )}

        {showSearch && (
          <>
            {search ? (
              <Button
                variant={'outline'}
                radius={'xl'}
                color={'var(--mantine-color-primary-9)'}
                size={'xs'}
                leftSection={<IconSearch size={14} stroke={3} />}
                onClick={openSearchModal}
              >
                &quot;{search}&quot;
              </Button>
            ) : (
              <ActionIcon
                variant={'outline'}
                size='md'
                radius='xl'
                color={'var(--mantine-color-primary-9)'}
                onClick={openSearchModal}
              >
                <IconSearch size={14} stroke={3} />
              </ActionIcon>
            )}
          </>
        )}
      </Group>

      {showSearch && (
        <SearchModalClient
          search={search ?? ''}
          opened={searchModalOpened}
          close={closeSearchModal}
          setSearch={setSearch}
        />
      )}
    </Paper>
  );
};

export default DataTableActionsClient;
