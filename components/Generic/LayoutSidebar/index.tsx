'use client';

import {
  AppShell,
  Burger,
  Group,
  Image,
  Loader,
  ScrollArea,
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
        label: 'Requisition and Issue Slip',
        allowedPermissions: [
          'super:*',
          'head:*',
          'inventory:*',
          'inventory:view',
        ],
        link: '/inventory/ris',
      },
      {
        label: 'Inventory Custodian Slip',
        allowedPermissions: [
          'super:*',
          'head:*',
          'inventory:*',
          'inventory:view',
        ],
        link: '/inventory/ics',
      },
      {
        label: 'Aknowledgement Receipt of Equipment',
        allowedPermissions: [
          'super:*',
          'head:*',
          'inventory:*',
          'inventory:view',
        ],
        link: '/inventory/are',
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
    initiallyOpened: false,
    links: [
      {
        label: 'Funding Soruces/Projects',
        allowedPermissions: ['super:*', 'head:*', 'lib-fund-source:view'],
        link: '/settings/library/funding-sources',
      },
      {
        label: 'Item Classifications',
        allowedPermissions: ['super:*', 'head:*', 'lib-item-class:view'],
        link: '/settings/library/item-classifications',
      },
      {
        label: 'MFO/PAP',
        allowedPermissions: ['super:*', 'head:*', 'lib-mfo-pap:view'],
        link: '/settings/library/mfo-pap',
      },
      {
        label: 'Modes of Procurement',
        allowedPermissions: ['super:*', 'head:*', 'lib-mode-proc:view'],
        link: '/settings/library/modes-procurement',
      },
      {
        label: 'Print Paper Sizes',
        allowedPermissions: ['super:*', 'head:*', 'lib-paper-size:view'],
        link: '/settings/library/paper-sizes',
      },
      {
        label: 'Signatories',
        allowedPermissions: ['super:*', 'head:*', 'lib-signatory:view'],
        link: '/settings/library/signatories',
      },
      {
        label: 'Suppliers',
        allowedPermissions: ['super:*', 'head:*', 'lib-supplier:view'],
        link: '/settings/library/suppliers',
      },
      {
        label: 'UACS Object Codes',
        allowedPermissions: ['super:*', 'head:*', 'lib-uacs-code:view'],
        link: '/settings/library/uacs-object-codes',
      },
      {
        label: 'Unit of Issues',
        allowedPermissions: ['super:*', 'head:*', 'lib-unit-issue:view'],
        link: '/settings/library/unit-issues',
      },
    ],
  },
  {
    label: 'User Management',
    allowedPermissions: [
      'super:*',
      'head:*',
      'account-department:*',
      'account-section:*',
      'account-role:*',
      'account-user:*',
      'account-department:view',
      'account-section:view',
      'account-role:view',
      'account-user:view',
    ],
    icon: IconUserCog,
    initiallyOpened: false,
    links: [
      {
        label: 'Departments and Sections',
        allowedPermissions: [
          'super:*',
          'head:*',
          'account-department:*',
          'account-department:view',
        ],
        link: '/settings/user-management/departments',
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
  { label: 'Exit', icon: IconArrowBack, link: '/' },
];

export function LayoutSidebarClient({
  user,
  type,
  permissions,
  children,
}: LayoutSidebarProps) {
  const [menus, setMenus] = useState<LinksGroupProps[]>(defaultMenu);
  const links = menus.map((item) => (
    <LinksGroupClient {...item} key={item.label} permissions={permissions} />
  ));
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
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
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      mih={'100vh'}
      padding='md'
      transitionDuration={300}
      transitionTimingFunction='ease'
    >
      <AppShell.Header bg={'var(--mantine-color-primary-9)'} c={'white'}>
        <Group h='100%' px='md'>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom='sm'
            size='sm'
            color={'white'}
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom='sm'
            size='sm'
            color={'white'}
          />
          <Group>
            <Image
              width={30}
              height={30}
              src={'/images/atok-logo.png'}
              alt={'LGU-Atok'}
            />
            <Text size={'lg'} fw={400}>
              Procurement System
            </Text>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>

        <div className={classes.footer}>
          <UserButtonClient user={user} handleOpen={open} />
        </div>

        <UserModalClient
          title={user.fullname}
          open={opened}
          handleClose={close}
        />
      </AppShell.Navbar>
      <AppShell.Main bg={'var(--mantine-color-gray-1)'}>
        {children}
        <ProgressBar
          height={'4px'}
          color={'var(--mantine-color-secondary-0)'}
          options={{ showSpinner: false }}
          shallowRouting
        />
      </AppShell.Main>
    </AppShell>
  );
}
