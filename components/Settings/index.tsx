'use client';

import {
  Box,
  Card,
  Group,
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
  IconSettings2,
  IconUser,
  IconUserCog,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useMediaQuery } from '@mantine/hooks';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import PageHeader from '@/components/Generic/PageHeader';

interface SettingsSection {
  title: string;
  description: string;
  icon: any;
  link: string;
  color: string;
  permission: string | null;
}

interface SettingsClientProps {
  permissions?: string[];
}

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
    link: '/settings/libraries/account-classifications',
    color: 'orange',
    permission: 'lib-account-class:view',
  },
  {
    title: 'User Management',
    description: 'Manage users, roles, and access permissions',
    icon: IconUserCog,
    link: '/settings/user-managements/departments',
    color: 'violet',
    permission: 'account-department:view',
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

  return (
    <Stack gap='lg'>
      <SimpleGrid
        cols={{
          base: 1,
          sm: isMobile ? 1 : 2,
          lg: lgScreenAndBelow ? 2 : 3,
        }}
        spacing='md'
      >
        {filteredSections.map((section) => (
          <Link
            key={section.title}
            href={section.link}
            style={{ textDecoration: 'none' }}
          >
            <Card
              p={lgScreenAndBelow ? 'md' : 'lg'}
              radius='md'
              withBorder
              style={{
                transition: 'all 200ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 20px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor =
                  'var(--mantine-color-primary-4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor =
                  'var(--mantine-color-gray-3)';
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
          </Link>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default SettingsClient;
