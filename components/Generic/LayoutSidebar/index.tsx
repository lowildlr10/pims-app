'use client';

import {
  AppShell,
  Avatar,
  Burger,
  Group,
  Loader,
  Overlay,
  ScrollArea,
  Title,
} from '@mantine/core';
import { useDisclosure, useHeadroom, useMediaQuery } from '@mantine/hooks';
import { LinksGroupClient } from '../NavbarLinksGroup';
import {
  IconArrowBack,
  IconBuildingWarehouse,
  IconCash,
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
import { useCallback, useEffect, useState } from 'react';
import UserModalClient from '../Modal/UserModal';
import classes from '@/styles/generic/sidebar.module.css';
import { keyframes } from '@emotion/react';
import { NProgressClient } from '../NProgress';
import {
  INVENTORY_LINKS,
  PROCUREMENT_LINKS,
  PAYMENT_LINKS,
  PROCUREMENT_ALLOWED_PERMISSIONS,
  LIBRARY_ALLOWED_PERMISSIONS,
  INVENTORY_ALLOWED_PERMISSIONS,
  PAYMENT_ALLOWED_PERMISSIONS,
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
  // {
  //   label: 'Payment',
  //   allowedPermissions: PAYMENT_ALLOWED_PERMISSIONS,
  //   icon: IconCash,
  //   initiallyOpened: false,
  //   links: PAYMENT_LINKS,
  // },
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

  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
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
        width: 300,
        breakpoint: 'md',
        collapsed: {
          mobile: !mobileOpened && pinned,
          desktop: !desktopOpened && pinned,
        },
      }}
      // mih={{ base: 'auto', lg: '100vh' }}
      padding={'sm'}
      transitionDuration={300}
      transitionTimingFunction='ease'
    >
      <AppShell.Header bg={'var(--mantine-color-primary-9)'} c={'white'}>
        <Group h='100%' px={'md'} justify={'space-between'}>
          <Group>
            <Burger
              color={'white'}
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom={'md'}
              size={lgScreenAndBelow ? 'xs' : 'sm'}
            />
            <Burger
              color={'white'}
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom={'md'}
              size={lgScreenAndBelow ? 'xs' : 'sm'}
            />
            <Group px={'xs'} gap={7} align={'center'}>
              {loading ? (
                <Loader
                  color={'var(--mantine-color-tertiary-0)'}
                  type={'bars'}
                  size={lgScreenAndBelow ? 'xs' : 'sm'}
                />
              ) : (
                <Avatar
                  variant={'filled'}
                  size={lgScreenAndBelow ? 'xs' : 'sm'}
                  radius={'xs'}
                  src={logo}
                  alt={company?.company_name ?? 'Company'}
                />
              )}

              <Title order={lgScreenAndBelow ? 5 : 3} fw={600}>
                PIMS
              </Title>
            </Group>
          </Group>

          <Group>
            <NotificationMenuButtonClient />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar
        p='md'
        sx={(theme, u) => ({
          transform: `${desktopOpened
            ? 'translateX(calc(var(--app-shell-navbar-width) * 0))'
            : 'translateX(calc(var(--app-shell-navbar-width) * -1))'
            } !important`,
          [u.smallerThan('md')]: {
            transform: `${mobileOpened
              ? 'translateX(calc(var(--app-shell-navbar-width) * 0))'
              : 'translateX(calc(var(--app-shell-navbar-width) * -1))'
              } !important`,
          },
        })}
      >
        {/* <AppShell.Section>LGU-ATOK</AppShell.Section> */}
        <AppShell.Section
          className={classes.links}
          grow
          my='md'
          component={ScrollArea}
        >
          <div className={classes.linksInner}>{links}</div>
        </AppShell.Section>

        <AppShell.Section className={classes.footer}>
          <UserButtonClient user={user} handleOpen={open} />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main bg={'var(--mantine-color-gray-4)'} pl={'sm'}>
        <Overlay
          color={'var(--mantine-color-black-7)'}
          backgroundOpacity={0.6}
          blur={2}
          zIndex={5}
          onClick={() => {
            toggleDesktop();
          }}
          display={{ base: 'none', lg: desktopOpened ? 'initial' : 'none' }}
          sx={{
            animation: desktopOpened
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
