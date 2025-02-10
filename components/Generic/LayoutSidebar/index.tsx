'use client';

import {
  AppShell,
  Burger,
  Group,
  Image,
  Loader,
  ScrollArea
} from '@mantine/core';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useDisclosure } from '@mantine/hooks';
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
import { useEffect, useState } from 'react';
import UserModalClient from '../Modal/UserModal';
import classes from '@/styles/generic/sidebar.module.css';
import { Text } from '@mantine/core';
import NotificationMenuButtonClient from '../NotificationMenuButton';

const defaultMenu: LinksGroupProps[] = [
  { label: 'Loading...', icon: Loader, link: '/' },
];

const defaultMainMenus: LinksGroupProps[] = [
  { label: 'Dashboard', icon: IconGauge, link: '/' },
  {
    label: 'Procurement',
    allowedPermissions: [
      'super:*',
      'head:*',
      'pr:*',
      'rfq:*',
      'aoq:*',
      'po:*',
      'iar:*',
      'ors:*',
      'dv:*',
      'pr:view',
      'rfq:view',
      'aoq:view',
      'po:view',
      'iar:view',
      'ors:view',
      'dv:view',
    ],
    icon: IconShoppingCart,
    initiallyOpened: true,
    links: [
      {
        label: 'Purchase Requests',
        allowedPermissions: ['super:*', 'head:*', 'pr:*', 'pr:view'],
        link: '/procurement/pr',
      },
      {
        label: 'Request for Quotations',
        allowedPermissions: ['super:*', 'head:*', 'rfq:*', 'rfq:view'],
        link: '/procurement/rfq',
      },
      {
        label: 'Abstract of Quotations',
        allowedPermissions: ['super:*', 'head:*', 'aoq:*', 'aoq:view'],
        link: '/procurement/aoq',
      },
      {
        label: 'Purchase/Job Orders',
        allowedPermissions: ['super:*', 'head:*', 'po:*', 'po:view'],
        link: '/procurement/po',
      },
      {
        label: 'Inspection and Acceptance Report',
        allowedPermissions: ['super:*', 'head:*', 'iar:*', 'iar:view'],
        link: '/procurement/iar',
      },
      {
        label: 'Obligation Request and Status',
        allowedPermissions: ['super:*', 'head:*', 'ors:*', 'ors:view'],
        link: '/procurement/ors',
      },
      {
        label: 'Disbursement Voucher',
        allowedPermissions: ['super:*', 'head:*', 'dv:*', 'dv:view'],
        link: '/procurement/dv',
      },
    ],
  },
  {
    label: 'Inventory',
    allowedPermissions: ['super:*', 'head:*', 'inventory:*', 'inventory:view'],
    icon: IconBuildingWarehouse,
    initiallyOpened: false,
    links: [
      {
        label: 'Supplies',
        allowedPermissions: [
          'super:*',
          'head:*',
          'inventory:*',
          'inventory:view',
        ],
        link: '/inventory/supplies',
      },
      {
        label: 'Issuances',
        allowedPermissions: [
          'super:*',
          'head:*',
          'inventory:*',
          'inventory:view',
        ],
        link: '/inventory/issuances',
      },
    ],
  },
  {
    label: 'Payment',
    allowedPermissions: [
      'super:*',
      'head:*',
      'check:*',
      'deposit:*',
      'check:view',
      'deposit:view',
    ],
    icon: IconCash,
    initiallyOpened: false,
    links: [
      {
        label: 'Check',
        allowedPermissions: ['super:*', 'head:*', 'check:*', 'check:view'],
        link: '/payment/check',
      },
      {
        label: 'Bank Deposit',
        allowedPermissions: ['super:*', 'head:*', 'deposit:*', 'deposit:view'],
        link: '/payment/deposit',
      },
    ],
  },
  { label: 'Settings', icon: IconSettings2, link: '/settings' },
];

const defaultSettingsMenus: LinksGroupProps[] = [
  { label: 'User Profile', icon: IconUser, link: '/settings' },
  {
    label: 'Company Profile',
    allowedPermissions: ['super:*', 'head:*', 'company:*', 'company:view'],
    icon: IconSitemap,
    link: '/settings/company-profile',
  },
  {
    label: 'Library',
    icon: IconLibrary,
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-bid-committee:*',
      'lib-fund-source:*',
      'lib-item-class:*',
      'lib-mfo-pap:*',
      'lib-mode-proc:*',
      'lib-paper-size:*',
      'lib-responsibility-center:*',
      'lib-signatory:*',
      'lib-supplier:*',
      'lib-uacs-class:*',
      'lib-uacs-code:*',
      'lib-unit-issue:*',
      'lib-bid-committee:view',
      'lib-fund-source:view',
      'lib-item-class:view',
      'lib-mfo-pap:view',
      'lib-mode-proc:view',
      'lib-paper-size:view',
      'lib-responsibility-center:view',
      'lib-signatory:view',
      'lib-supplier:view',
      'lib-uacs-class:view',
      'lib-uacs-code:view',
      'lib-unit-issue:view',
    ],
    initiallyOpened: false,
    links: [
      {
        label: 'Bids and Awards Committees',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-bid-committee:*',
          'lib-bid-committee:view',
        ],
        link: '/settings/library/bids-awards-committees',
      },
      {
        label: 'Funding Soruces/Projects',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-fund-source:*',
          'lib-fund-source:view',
        ],
        link: '/settings/library/funding-sources',
      },
      {
        label: 'Item Classifications',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-item-class:*',
          'lib-item-class:view',
        ],
        link: '/settings/library/item-classifications',
      },
      {
        label: 'MFO/PAP',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-mfo-pap:*',
          'lib-mfo-pap:view',
        ],
        link: '/settings/library/mfo-pap',
      },
      {
        label: 'Modes of Procurement',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-mode-proc:*',
          'lib-mode-proc:view',
        ],
        link: '/settings/library/modes-procurement',
      },
      {
        label: 'Print Paper Sizes',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-paper-size:*',
          'lib-paper-size:view',
        ],
        link: '/settings/library/paper-sizes',
      },
      {
        label: 'Responsibility Centers',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-responsibility-center:*',
          'lib-responsibility-center:view',
        ],
        link: '/settings/library/responsibility-centers',
      },
      {
        label: 'Signatories',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-signatory:*',
          'lib-signatory:view',
        ],
        link: '/settings/library/signatories',
      },
      {
        label: 'Suppliers',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-supplier:*',
          'lib-supplier:view',
        ],
        link: '/settings/library/suppliers',
      },
      {
        label: 'UACS Code Classifications',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-uacs-class:*',
          'lib-uacs-class:view',
        ],
        link: '/settings/library/uacs-code-classifications',
      },
      {
        label: 'UACS Object Codes',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-uacs-code:*',
          'lib-uacs-code:view',
        ],
        link: '/settings/library/uacs-object-codes',
      },
      {
        label: 'Unit of Issues',
        allowedPermissions: [
          'super:*',
          'head:*',
          'lib-unit-issue:*',
          'lib-unit-issue:view',
        ],
        link: '/settings/library/unit-issues',
      },
    ],
  },
  {
    label: 'User Management',
    allowedPermissions: [
      'super:*',
      'head:*',
      'account-division:*',
      'account-section:*',
      'account-role:*',
      'account-user:*',
      'account-division:view',
      'account-section:view',
      'account-role:view',
      'account-user:view',
    ],
    icon: IconUserCog,
    initiallyOpened: false,
    links: [
      {
        label: 'Division and Sections',
        allowedPermissions: [
          'super:*',
          'head:*',
          'account-division:*',
          'account-division:view',
        ],
        link: '/settings/user-management/divisions',
      },
      {
        label: 'Roles',
        allowedPermissions: [
          'super:*',
          'head:*',
          'account-role:*',
          'account-role:view',
        ],
        link: '/settings/user-management/roles',
      },
      {
        label: 'Users',
        allowedPermissions: [
          'super:*',
          'head:*',
          'account-user:*',
          'account-user:view',
        ],
        link: '/settings/user-management/users',
      },
    ],
  },
  {
    label: 'System Logs',
    allowedPermissions: ['super:*', 'system-log:*', 'system-log:view'],
    icon: IconLogs,
    link: '/settings/system-log',
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
  const [menus, setMenus] = useState<LinksGroupProps[]>(defaultMenu);
  const links = menus.map((item) => (
    <LinksGroupClient {...item} key={item.label} permissions={permissions} />
  ));
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
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
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      mih={{ base: 'auto', lg: '100vh' }}
      padding='md'
      transitionDuration={300}
      transitionTimingFunction='ease'
    >
      <AppShell.Header bg={'var(--mantine-color-primary-9)'} c={'white'}>
        <Group h='100%' px='md' justify={'space-between'}>
          <Group>
            <Burger 
              color={'white'}
              opened={mobileOpened} 
              onClick={toggleMobile} 
              hiddenFrom={'md'} 
              size={'sm'} 
            />
            <Burger 
              color={'white'}
              opened={desktopOpened} 
              onClick={toggleDesktop} 
              visibleFrom={'md'} 
              size={'sm'} 
            />
            <Group>
              <Image
                width={30}
                height={30}
                src={company?.company_logo ?? '/images/logo-fallback.png'}
                alt={company?.company_name ?? 'Company'}
              />
              <Text size={'lg'} fw={400}>
                Procurement System
              </Text>
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
          [u.smallerThan('lg')] : {
            transform: 
              `${mobileOpened 
                ? 'translateX(calc(var(--app-shell-navbar-width) * 0))' 
                : 'translateX(calc(var(--app-shell-navbar-width) * -1))'
              } !important`
          }
        })}>
        <AppShell.Section className={classes.links} grow my="md" component={ScrollArea}>
          <div className={classes.linksInner}>{links}</div>
        </AppShell.Section>

        <AppShell.Section className={classes.footer}>
          <UserButtonClient user={user} handleOpen={open} />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main bg={'var(--mantine-color-gray-1)'}>
        {children}
        <ProgressBar
          height={'2.5px'}
          color={'var(--mantine-color-secondary-3)'}
          options={{ showSpinner: false }}
          shallowRouting
        />
        <UserModalClient
          title={user.fullname ?? 'User'}
          open={opened}
          handleClose={close}
        />
      </AppShell.Main>
    </AppShell>
  );
}
