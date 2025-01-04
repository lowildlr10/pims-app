'use client';

import React, { useEffect, useState } from 'react';
import { ActionIcon, Button, Group, Paper } from '@mantine/core';
import { IconPencil, IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import SearchModalClient from '../Modal/SearchModal';
import CreateModalClient from '../Modal/CreateModal';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const DataTableActionsClient = ({
  permissions,
  search,
  module,
  showSearch,
  setSearch,
}: DataTableActionsProps) => {
  const [
    searchModalOpened,
    { open: openSearchModal, close: closeSearchModal },
  ] = useDisclosure(false);
  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);
  const [createModalTitle, setCreateModalTitle] = useState('Create');

  useEffect(() => {
    if (!module) return;

    switch (module) {
      case 'account-department':
        setCreateModalTitle('Create Department');
        break;

      case 'account-role':
        setCreateModalTitle('Create Role');
        break;

      case 'account-user':
        setCreateModalTitle('Create User');
        break;

      default:
        setCreateModalTitle('Create');
        break;
    }
  }, [module]);

  return (
    <Paper p={'sm'}>
      <Group justify={'space-between'}>
        {getAllowedPermissions(module, 'create')?.some((permission) =>
          permissions.includes(permission)
        ) ? (
          <Button
            size={'xs'}
            radius='sm'
            color={'var(--mantine-color-primary-9)'}
            leftSection={<IconPencil size={14} />}
            onClick={() => openCreateModal()}
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

      <CreateModalClient
        title={createModalTitle}
        url={'#'}
        data={[]}
        opened={createModalOpened}
        close={closeCreateModal}
      />

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
