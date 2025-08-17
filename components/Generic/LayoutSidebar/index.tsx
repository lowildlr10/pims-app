'use client';

import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  Loader,
  Overlay,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure, useHeadroom, useMediaQuery } from '@mantine/hooks';
import { LinksGroupClient } from '../NavbarLinksGroup';
import {
  IconArrowBack,
  IconBuildingWarehouse,
  IconGauge,
  IconLibrary,
  IconLogs,
  IconSettings2,
  IconShoppingCart,
  IconSitemap,
  IconUser,
  IconUserCog,
} from '@tabler/icons-react';
import { UserButtonClient } from '../UserButton';
import { useEffect, useState } from 'react';
import UserModalClient from '../Modal/UserModal';
import classes from '@/styles/generic/sidebar.module.css';
import { keyframes } from '@emotion/react';
import { NProgressClient } from '../NProgress';
import {
  INVENTORY_LINKS,
  PROCUREMENT_LINKS,
  PROCUREMENT_ALLOWED_PERMISSIONS,
  LIBRARY_ALLOWED_PERMISSIONS,
  INVENTORY_ALLOWED_PERMISSIONS,
  LIBRARY_LINKS,
  USER_MANAGEMENT_LINKS,
  USER_MANAGEMENT_ALLOWED_PERMISSIONS,
  COMPANY_PROFILE_ALLOWED_PERMISSIONS,
  SYSTEM_LOGS_ALLOWED_PERMISSIONS,
} from '@/config/menus';
import { useMediaAsset } from '@/hooks/useMediaAsset';
import NotificationMenuButtonClient from '../NotificationMenuButton';

const defaultMenu: LinksGroupProps[] = [
  { label: 'Loading...', icon: Loader, link: '/' },
];

const defaultMainMenus: LinksGroupProps[] = [
  { label: 'Dashboard', icon: IconGauge, link: '/' },
  {
    label: 'Procurement',
    allowedPermissions: PROCUREMENT_ALLOWED_PERMISSIONS,
    icon: IconShoppingCart,
    initiallyOpened: true,
    links: PROCUREMENT_LINKS,
  },
  {
    label: 'Inventory',
    allowedPermissions: INVENTORY_ALLOWED_PERMISSIONS,
    icon: IconBuildingWarehouse,
    initiallyOpened: false,
    links: INVENTORY_LINKS,
  },
  { label: 'Settings', icon: IconSettings2, link: '/settings/user-profile' },
];

const defaultSettingsMenus: LinksGroupProps[] = [
  { label: 'User Profile', icon: IconUser, link: '/settings/user-profile' },
  {
    label: 'Company Profile',
    allowedPermissions: COMPANY_PROFILE_ALLOWED_PERMISSIONS,
    icon: IconSitemap,
    link: '/settings/company-profile',
  },
  {
    label: 'Library',
    icon: IconLibrary,
    allowedPermissions: LIBRARY_ALLOWED_PERMISSIONS,
    initiallyOpened: false,
    links: LIBRARY_LINKS,
  },
  {
    label: 'User Management',
    allowedPermissions: USER_MANAGEMENT_ALLOWED_PERMISSIONS,
    icon: IconUserCog,
    initiallyOpened: false,
    links: USER_MANAGEMENT_LINKS,
  },
  {
    label: 'System Logs',
    allowedPermissions: SYSTEM_LOGS_ALLOWED_PERMISSIONS,
    icon: IconLogs,
    link: '/settings/system-logs',
  },
  { label: 'Exit', icon: IconArrowBack, link: '/' },
];

export function LayoutSidebarClient({
  company,
  user,
  type,
  permissions,
  children,
}: LayoutSidebarProps) {
  const { media: logo, loading } = useMediaAsset({
    type: 'logo',
    company,
  });

  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [menus, setMenus] = useState<LinksGroupProps[]>(defaultMenu);
  const links = menus.map((item) => (
    <LinksGroupClient {...item} key={item.label} permissions={permissions} />
  ));
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const pinned = useHeadroom({ fixedAt: 120 });
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    switch (type) {
      case 'main':
        setMenus(defaultMainMenus);
        break;

      case 'settings':
        setMenus(defaultSettingsMenus);
        break;

      default:
        setMenus(defaultMainMenus);
        break;
    }
  }, [type]);

  return (
    <AppShell
      header={{ height: lgScreenAndBelow ? 50 : 60 }}
      navbar={{
        width: 320,
        breakpoint: 'md',
        collapsed: {
          mobile: !mobileOpened && pinned,
          desktop: !desktopOpened && pinned,
        },
      }}
      padding={'sm'}
      transitionDuration={300}
      transitionTimingFunction='ease'
      layout='alt'
    >
      <AppShell.Header
        bg={'var(--mantine-color-primary-9)'}
        c={'white'}
        bd={0}
        left={!desktopOpened ? 0 : undefined}
      >
        <Group h='100%' px={'md'} justify={'space-between'}>
          <Group>
            <Burger
              color={'white'}
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom={'md'}
              size={lgScreenAndBelow ? '0.95rem' : 'sm'}
            />
            <Burger
              color={'white'}
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom={'md'}
              size={lgScreenAndBelow ? '0.95rem' : 'sm'}
            />
          </Group>

          <Group>
            <NotificationMenuButtonClient />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar
        px={'md'}
        sx={(theme, u) => ({
          transform: `${
            desktopOpened
              ? 'translateX(calc(var(--app-shell-navbar-width) * 0))'
              : 'translateX(calc(var(--app-shell-navbar-width) * -1))'
          } !important`,
          [u.smallerThan('md')]: {
            transform: `${
              mobileOpened
                ? 'translateX(calc(var(--app-shell-navbar-width) * 0))'
                : 'translateX(calc(var(--app-shell-navbar-width) * -1))'
            } !important`,
          },
        })}
      >
        <AppShell.Section
          mx={'-16px'}
          py={'md'}
          px={'md'}
          sx={{
            borderBottom: '1px solid var(--mantine-color-gray-3)',
          }}
        >
          <Group wrap='nowrap' align='flex-start'>
            <Box>
              {loading ? (
                <Loader
                  color='var(--mantine-color-tertiary-0)'
                  type='bars'
                  size={mobileOpened ? '0.95rem' : 'sm'}
                />
              ) : (
                <Avatar
                  variant='filled'
                  size={mobileOpened ? 38 : 45}
                  radius='xs'
                  src={logo}
                  alt={company?.company_name ?? 'Company'}
                />
              )}
            </Box>

            <Stack gap={0} style={{ whiteSpace: 'nowrap' }}>
              <Tooltip label={company.company_name}>
                <Title
                  order={4}
                  c='var(--mantine-color-gray-7)'
                  fz={mobileOpened ? '0.9rem' : '1.05rem'}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: mobileOpened ? 'calc(100vw - 10em)' : '220px',
                  }}
                >
                  {company.company_name}
                </Title>
              </Tooltip>

              <Title
                order={6}
                c='var(--mantine-color-gray-6)'
                fz={mobileOpened ? '0.8rem' : '0.9rem'}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: mobileOpened ? 'calc(100vw - 10em)' : '220px',
                }}
              >
                {company.head?.fullname ?? company.company_type}
              </Title>
            </Stack>

            {mobileOpened && (
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom={'md'}
                size={mobileOpened ? '0.95rem' : 'sm'}
              />
            )}
          </Group>
        </AppShell.Section>

        <AppShell.Section
          mx={'-16px'}
          py={'xs'}
          sx={{
            borderBottom: '1px solid var(--mantine-color-gray-3)',
          }}
        >
          <Text
            size={'0.7rem'}
            c={'var(--mantine-color-gray-7)'}
            fs={'italic'}
            px={'xl'}
            ta={'center'}
          >
            Procurement and Inventory
            <br />
            Management System <small>v1.0.0</small>
          </Text>
        </AppShell.Section>

        <AppShell.Section
          className={classes.links}
          grow
          my={0}
          py={0}
          component={ScrollArea}
        >
          <Stack className={classes.linksInner} gap={0} py={0}>
            {links}
          </Stack>
        </AppShell.Section>

        <AppShell.Section className={classes.footer}>
          <UserButtonClient user={user} handleOpen={open} />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        bg={'var(--mantine-color-gray-4)'}
        p={lgScreenAndBelow ? '50px 0 0 0' : '60px 0 0 0'}
      >
        <Overlay
          color={'var(--mantine-color-black-7)'}
          backgroundOpacity={0.6}
          blur={2}
          zIndex={35}
          onClick={() => {
            toggleDesktop();
          }}
          display={{ base: 'none', sm: desktopOpened ? 'initial' : 'none' }}
          sx={{
            animation:
              desktopOpened || mobileOpened
                ? `${keyframes`
                0%,100% { opacity: 0 }
                100% { opacity: 1 }
              `} 0.2s linear`
                : `${keyframes`
                100%,0% { opacity: 1 }
                9% { opacity: 0 }
              `} 0.3s linear`,
            position: 'fixed',
          }}
        />
        {children}
        <NProgressClient />
        <UserModalClient
          title={user.fullname ?? 'User'}
          open={opened}
          handleClose={close}
        />
      </AppShell.Main>
    </AppShell>
  );
}
