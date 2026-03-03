'use client';

import {
  Box,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBuilding,
  IconLibrary,
  IconLogs,
  IconUser,
  IconUserCog,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

interface SettingsSection {
  title: string;
  description: string;
  icon: any;
  link?: string;
  color: string;
  permission: string | null;
  isModal?: boolean;
}

interface LibraryItem {
  title: string;
  description: string;
  link: string;
  permission: string;
}

interface UserManagementItem {
  title: string;
  description: string;
  link: string;
  permission: string;
}

interface SettingsClientProps {
  permissions?: string[];
}

const libraryItems: LibraryItem[] = [
  {
    title: 'Account Classifications',
    description: 'Manage account classification master lists',
    link: '/settings/libraries/account-classifications',
    permission: 'lib-account-class:view',
  },
  {
    title: 'Accounts',
    description: 'Manage account master lists',
    link: '/settings/libraries/accounts',
    permission: 'lib-account:view',
  },
  {
    title: 'Bids and Awards Committees',
    description: 'Manage BAC members and configurations',
    link: '/settings/libraries/bids-awards-committees',
    permission: 'lib-bid-committee:view',
  },
  {
    title: 'Function, Program, Projects',
    description: 'Manage FPP master lists',
    link: '/settings/libraries/function-program-projects',
    permission: 'lib-fpp:view',
  },
  {
    title: 'Funding Sources',
    description: 'Manage funding source master lists',
    link: '/settings/libraries/funding-sources',
    permission: 'lib-fund-source:view',
  },
  {
    title: 'Item Classifications',
    description: 'Manage item classification master lists',
    link: '/settings/libraries/item-classifications',
    permission: 'lib-item-class:view',
  },
  {
    title: 'Modes of Procurement',
    description: 'Manage procurement method master lists',
    link: '/settings/libraries/modes-procurement',
    permission: 'lib-mode-proc:view',
  },
  {
    title: 'Paper Sizes',
    description: 'Manage print paper size configurations',
    link: '/settings/libraries/paper-sizes',
    permission: 'lib-paper-size:view',
  },
  {
    title: 'Responsibility Centers',
    description: 'Manage responsibility center master lists',
    link: '/settings/libraries/responsibility-centers',
    permission: 'lib-responsibility-center:view',
  },
  {
    title: 'Signatories',
    description: 'Manage signatory configurations',
    link: '/settings/libraries/signatories',
    permission: 'lib-signatory:view',
  },
  {
    title: 'Suppliers',
    description: 'Manage supplier/company master lists',
    link: '/settings/libraries/suppliers',
    permission: 'lib-supplier:view',
  },
  {
    title: 'Unit of Issues',
    description: 'Manage unit of issue master lists',
    link: '/settings/libraries/unit-issues',
    permission: 'lib-unit-issue:view',
  },
];

const userManagementItems: UserManagementItem[] = [
  {
    title: 'Departments',
    description: 'Manage department configurations',
    link: '/settings/user-managements/departments',
    permission: 'account-department:view',
  },
  {
    title: 'Sections',
    description: 'Manage section configurations',
    link: '/settings/user-managements/sections',
    permission: 'account-section:view',
  },
  {
    title: 'Users',
    description: 'Manage user accounts and access',
    link: '/settings/user-managements/users',
    permission: 'account-user:view',
  },
];

const settingsSections: SettingsSection[] = [
  {
    title: 'User Profile',
    description: 'Manage your account settings and preferences',
    icon: IconUser,
    link: '/settings/user-profile',
    color: 'blue',
    permission: null,
  },
  {
    title: 'Company Profile',
    description: 'Configure your organization details and information',
    icon: IconBuilding,
    link: '/settings/company-profile',
    color: 'teal',
    permission: 'company:view',
  },
  {
    title: 'Library',
    description: 'Manage reference data, master lists, and configurations',
    icon: IconLibrary,
    color: 'orange',
    permission: 'lib-account-class:view',
    isModal: true,
  },
  {
    title: 'User Management',
    description: 'Manage users, roles, and access permissions',
    icon: IconUserCog,
    color: 'violet',
    permission: 'account-department:view',
    isModal: true,
  },
  {
    title: 'System Logs',
    description: 'View system activity logs and audit trails',
    icon: IconLogs,
    link: '/settings/system-logs',
    color: 'red',
    permission: 'system-log:view',
  },
];

const SettingsClient = ({ permissions = [] }: SettingsClientProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const isMobile = useMediaQuery('(max-width: 600px)');

  const [libraryOpened, { open: openLibrary, close: closeLibrary }] =
    useDisclosure(false);
  const [
    userManagementOpened,
    { open: openUserManagement, close: closeUserManagement },
  ] = useDisclosure(false);

  const filteredSections = settingsSections.filter((section) => {
    if (!section.permission) return true;
    const [module, action] = section.permission.split(':');
    const allowedPermissions = getAllowedPermissions(
      module as ModuleType,
      action
    );
    return allowedPermissions?.some((p) =>
      p.includes(section.permission || '')
    );
  });

  const filterItemsByPermission = <T extends { permission: string }>(
    items: T[]
  ): T[] => {
    return items.filter((item) => {
      const [module, action] = item.permission.split(':');
      const allowedPermissions = getAllowedPermissions(
        module as ModuleType,
        action
      );
      return allowedPermissions?.some((p) => p.includes(item.permission));
    });
  };

  const filteredLibraryItems = filterItemsByPermission(libraryItems);
  const filteredUserManagementItems =
    filterItemsByPermission(userManagementItems);

  const handleSectionClick = (section: SettingsSection) => {
    if (section.isModal) {
      if (section.title === 'Library') {
        openLibrary();
      } else if (section.title === 'User Management') {
        openUserManagement();
      }
    }
  };

  const renderModalContent = (section: SettingsSection) => {
    const items =
      section.title === 'Library'
        ? filteredLibraryItems
        : filteredUserManagementItems;

    return (
      <Stack gap='sm'>
        {items.map((item: any) => (
          <Link
            key={item.title}
            href={item.link}
            style={{ textDecoration: 'none' }}
            onClick={closeLibrary}
          >
            <Card
              p='md'
              radius='md'
              withBorder
              style={{
                transition: 'all 200ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--mantine-color-primary-0)';
                e.currentTarget.style.borderColor =
                  'var(--mantine-color-primary-4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor =
                  'var(--mantine-color-gray-3)';
              }}
            >
              <Group align='flex-start' gap='sm'>
                <Box style={{ flex: 1 }}>
                  <Title order={6} fw={600} c='var(--mantine-color-gray-8)'>
                    {item.title}
                  </Title>
                  <Text size='xs' c='var(--mantine-color-gray-6)' mt={2}>
                    {item.description}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Link>
        ))}
        {items.length === 0 && (
          <Text c='dimmed' ta='center' py='lg'>
            No items available for your permissions
          </Text>
        )}
      </Stack>
    );
  };

  return (
    <>
      <Stack gap='lg'>
        <SimpleGrid
          cols={{
            base: 1,
            sm: isMobile ? 1 : 2,
            lg: lgScreenAndBelow ? 2 : 3,
          }}
          spacing='md'
        >
          {filteredSections.map((section) => {
            const content = (
              <Card
                p={lgScreenAndBelow ? 'md' : 'lg'}
                radius='md'
                withBorder
                style={{
                  transition: 'all 200ms ease',
                  cursor: section.isModal ? 'pointer' : 'default',
                }}
                onMouseEnter={(e) => {
                  if (!section.isModal) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 20px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor =
                      'var(--mantine-color-primary-4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!section.isModal) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor =
                      'var(--mantine-color-gray-3)';
                  }
                }}
              >
                <Group align='flex-start' gap='md'>
                  <ThemeIcon
                    size={lgScreenAndBelow ? 40 : 48}
                    radius='md'
                    variant='light'
                    color={section.color}
                  >
                    <section.icon
                      size={lgScreenAndBelow ? 18 : 22}
                      stroke={1.5}
                    />
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Title order={5} fw={600} c='var(--mantine-color-gray-8)'>
                      {section.title}
                    </Title>
                    <Text
                      size={isMobile ? 'xs' : 'sm'}
                      c='var(--mantine-color-gray-6)'
                      mt={4}
                    >
                      {section.description}
                    </Text>
                  </Box>
                </Group>
              </Card>
            );

            if (section.isModal) {
              return (
                <Box
                  key={section.title}
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                  onClick={() => handleSectionClick(section)}
                >
                  {content}
                </Box>
              );
            }

            return (
              <Link
                key={section.title}
                href={section.link || '#'}
                style={{ textDecoration: 'none' }}
              >
                {content}
              </Link>
            );
          })}
        </SimpleGrid>
      </Stack>

      <Modal
        opened={libraryOpened}
        onClose={closeLibrary}
        title='Library'
        size='lg'
        centered
      >
        {renderModalContent(
          settingsSections.find((s) => s.title === 'Library')!
        )}
      </Modal>

      <Modal
        opened={userManagementOpened}
        onClose={closeUserManagement}
        title='User Management'
        size='lg'
        centered
      >
        {renderModalContent(
          settingsSections.find((s) => s.title === 'User Management')!
        )}
      </Modal>
    </>
  );
};

export default SettingsClient;
