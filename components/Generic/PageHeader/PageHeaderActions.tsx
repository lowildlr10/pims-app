'use client';

import React, { useEffect, useState } from 'react';
import { ActionIcon, Button, Group, Menu, Tooltip } from '@mantine/core';
import { IconPencilPlus, IconRefresh, IconSearch } from '@tabler/icons-react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import SearchModalClient from '../Modal/SearchModal';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface PageHeaderActionsProps {
  permissions?: string[];
  search?: string;
  mainModule?: string;
  showSearch?: boolean;
  showCreate?: boolean;
  createMenus?: Array<{
    label: string;
    value: string;
    moduleType?: string;
  }>;
  createPermissions?: string[];
  setPageLoading?: (loading: boolean) => void;
  setSearch?: (search: string) => void;
  defaultModalOnClick?: 'update' | 'details';
  handleOpenCreateModal?: (
    value: string | null,
    moduleType: string | null,
    extraData?: any
  ) => void;
}

const PageHeaderActionsClient = ({
  permissions = [],
  search,
  mainModule,
  showSearch = true,
  showCreate = true,
  createMenus = [],
  createPermissions,
  setPageLoading,
  setSearch,
  defaultModalOnClick = 'update',
  handleOpenCreateModal,
}: PageHeaderActionsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [
    searchModalOpened,
    { open: openSearchModal, close: closeSearchModal },
  ] = useDisclosure(false);

  useEffect(() => {
    setCurrentSearch(search);
  }, [search]);

  const handleSetSearch = (value: string) => {
    if (setSearch) setSearch(value);
    router.replace(`${pathname}?search=${encodeURIComponent(value)}`, {
      scroll: false,
    });
  };

  return (
    <Group gap='xs'>
      {showCreate &&
      [
        ...(createPermissions ??
          getAllowedPermissions(mainModule as any, 'create') ??
          []),
      ].some((permission) => permissions?.includes(permission)) ? (
        <>
          {createMenus && createMenus.length > 0 ? (
            <Menu width={350} position='bottom-start'>
              <Menu.Target>
                <Button
                  variant='white'
                  color='dark'
                  leftSection={<IconPencilPlus size={15} stroke={1.5} />}
                  size='sm'
                >
                  Create
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {createMenus.map((menu) => (
                  <React.Fragment key={menu.label}>
                    {defaultModalOnClick === 'update' && (
                      <Menu.Item
                        onClick={() =>
                          handleOpenCreateModal &&
                          handleOpenCreateModal(
                            menu.value,
                            menu.moduleType || null,
                            {
                              document_type: menu?.value,
                            }
                          )
                        }
                      >
                        {menu.label}
                      </Menu.Item>
                    )}

                    {defaultModalOnClick === 'details' && (
                      <Menu.Item
                        href={`${pathname}/create?type=${menu.value}`}
                        component={Link}
                        onClick={() => setPageLoading?.(true)}
                      >
                        {menu.label}
                      </Menu.Item>
                    )}
                  </React.Fragment>
                ))}
              </Menu.Dropdown>
            </Menu>
          ) : (
            <>
              {defaultModalOnClick === 'update' && (
                <Button
                  variant='white'
                  color='dark'
                  leftSection={<IconPencilPlus size={15} stroke={1.5} />}
                  size='sm'
                  onClick={() =>
                    handleOpenCreateModal &&
                    handleOpenCreateModal(null, mainModule || null)
                  }
                >
                  Create
                </Button>
              )}

              {defaultModalOnClick === 'details' && (
                <Button
                  href={`${pathname}/create`}
                  variant='white'
                  color='dark'
                  leftSection={<IconPencilPlus size={15} stroke={1.5} />}
                  size='sm'
                  component={Link}
                  onClick={() => setPageLoading?.(true)}
                >
                  Create
                </Button>
              )}
            </>
          )}
        </>
      ) : null}

      {showSearch && (
        <Tooltip label='Search' withArrow>
          <Button
            variant='white'
            color='dark'
            leftSection={<IconSearch size={15} stroke={1.5} />}
            size='sm'
            onClick={openSearchModal}
          >
            {currentSearch && currentSearch.length > 0
              ? currentSearch.length > 15
                ? currentSearch.slice(0, 15) + '...'
                : currentSearch
              : 'Search'}
          </Button>
        </Tooltip>
      )}

      <Tooltip label='Refresh' withArrow>
        <ActionIcon
          variant='white'
          color='dark'
          size='lg'
          loading={refreshLoading}
          onClick={() => {
            setRefreshLoading(true);
            window.location.reload();
          }}
        >
          <IconRefresh size={18} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      {showSearch && (
        <SearchModalClient
          search={currentSearch || ''}
          opened={searchModalOpened}
          close={closeSearchModal}
          setSearch={handleSetSearch}
        />
      )}
    </Group>
  );
};

export default PageHeaderActionsClient;
