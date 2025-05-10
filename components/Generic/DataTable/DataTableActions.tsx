'use client';

import React, { useEffect, useState } from 'react';
import { ActionIcon, Button, Group, Paper, Tooltip } from '@mantine/core';
import { IconPencilPlus, IconRefresh, IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import SearchModalClient from '../Modal/SearchModal';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { usePathname } from 'next/navigation';

const DataTableActionsClient = ({
  permissions,
  search,
  mainModule,
  showSearch,
  showCreate,
  setSearch,
  handleOpenCreateModal,
}: DataTableActionsProps) => {
  const pathname = usePathname();
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [
    searchModalOpened,
    { open: openSearchModal, close: closeSearchModal },
  ] = useDisclosure(false);

  useEffect(() => {
    setCurrentSearch(search);
  }, [search]);

  return (
    <Paper p={'sm'} shadow={'sm'} bg={'var(--mantine-color-gray-0)'}>
      <Group justify={'space-between'}>
        {showCreate &&
        getAllowedPermissions(mainModule, 'create')?.some((permission) =>
          permissions.includes(permission)
        ) ? (
          <Button
            size={'xs'}
            radius='sm'
            color={'var(--mantine-color-primary-9)'}
            leftSection={<IconPencilPlus size={14} />}
            onClick={() =>
              handleOpenCreateModal &&
              handleOpenCreateModal(null, mainModule ?? null)
            }
          >
            Create
          </Button>
        ) : (
          <div></div>
        )}

        <Group>
          {showSearch && (
            <Tooltip label={'Search'} withArrow>
              {search ? (
                <Button
                  variant={'outline'}
                  radius={'xl'}
                  color={'var(--mantine-color-primary-9)'}
                  size={'xs'}
                  leftSection={<IconSearch size={14} stroke={3} />}
                  onClick={openSearchModal}
                >
                  &quot;
                  {currentSearch !== undefined && currentSearch.length > 10
                    ? currentSearch.slice(0, 10) + '....'
                    : currentSearch}
                  &quot;
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
            </Tooltip>
          )}

          <Tooltip label={'Refresh'} withArrow>
            <ActionIcon
              variant={'outline'}
              size='md'
              radius='xl'
              color={'var(--mantine-color-primary-9)'}
              loading={refreshLoading}
              onClick={() => {
                setRefreshLoading(true);
                window.location.href = pathname;
              }}
            >
              <IconRefresh size={14} stroke={3} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {showSearch && (
        <SearchModalClient
          search={currentSearch ?? ''}
          opened={searchModalOpened}
          close={closeSearchModal}
          setSearch={setSearch}
        />
      )}
    </Paper>
  );
};

export default DataTableActionsClient;
