'use client';

import { AppShell, Burger, Group, Image, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LinksGroupClient } from '../NavbarLinksGroup';
import {
  IconArrowBack,
  IconBuildingWarehouse,
  IconCash,
  IconGauge,
  IconLibrary,
  IconLoader,
  IconSettings2,
  IconShoppingCart,
  IconSitemap,
  IconUser,
  IconUserCog,
} from '@tabler/icons-react';
import { UserButtonClient } from '../UserButton';
import { useEffect, useState } from 'react';
import { ModalClient } from '../Modal';
import classes from '@/styles/generic/sidebar.module.css';
import { Text } from '@mantine/core';

const defaultMenu: LinksGroupProps[] = [
  { label: 'Loading...', icon: IconLoader, link: '/' },
];

const defaultMainMenus: LinksGroupProps[] = [
  { label: 'Dashboard', icon: IconGauge, link: '/' },
  {
    label: 'Procurement',
    allowedPermissions: [
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
        allowedPermissions: ['pr:*', 'pr:view'],
        link: '/procurement/pr',
      },
      {
        label: 'Request for Quotations',
        allowedPermissions: ['rfq:*', 'rfq:view'],
        link: '/procurement/rfq',
      },
      {
        label: 'Abstract of Quotations',
        allowedPermissions: ['aoq:*', 'aoq:view'],
        link: '/procurement/aoq',
      },
      {
        label: 'Purchase/Job Orders',
        allowedPermissions: ['po:*', 'po:view'],
        link: '/procurement/po',
      },
      {
        label: 'Inspection and Acceptance Report',
        allowedPermissions: ['iar:*', 'iar:view'],
        link: '/procurement/iar',
      },
      {
        label: 'Obligation Request and Status',
        allowedPermissions: ['ors:*', 'ors:view'],
        link: '/procurement/ors',
      },
      {
        label: 'Disbursement Voucher',
        allowedPermissions: ['dv:*', 'dv:view'],
        link: '/procurement/dv',
      },
    ],
  },
  {
    label: 'Inventory',
    allowedPermissions: [
      'ris:*',
      'ics:*',
      'are:*',
      'ris:view',
      'ics:view',
      'are:view',
    ],
    icon: IconBuildingWarehouse,
    initiallyOpened: false,
    links: [
      {
        label: 'Requisition and Issue Slip',
        allowedPermissions: ['ris:*', 'ris:view'],
        link: '/inventory/ris',
      },
      {
        label: 'Inventory Custodian Slip',
        allowedPermissions: ['ics:*', 'ics:view'],
        link: '/inventory/ics',
      },
      {
        label: 'Aknowledgement Receipt of Equipment',
        allowedPermissions: ['are:*', 'are:view'],
        link: '/inventory/are',
      },
    ],
  },
  {
    label: 'Payment',
    allowedPermissions: ['check:*', 'deposit:*', 'check:view', 'deposit:view'],
    icon: IconCash,
    initiallyOpened: false,
    links: [
      {
        label: 'Check',
        allowedPermissions: ['check:*', 'check:view'],
        link: '/payment/check',
      },
      {
        label: 'Bank Deposit',
        allowedPermissions: ['deposit:*', 'deposit:view'],
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
    allowedPermissions: ['company:*', 'company:view'],
    icon: IconSitemap,
    link: '/settings/company-profile',
  },
  {
    label: 'Library',
    icon: IconLibrary,
    initiallyOpened: false,
    links: [
      {
        label: 'Inventory Classifications',
        allowedPermissions: ['inv-class:view'],
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'MFO PAP',
        allowedPermissions: ['inv-class:view'],
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Modes of Procurement',
        allowedPermissions: ['inv-class:view'],
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Funding Soruces',
        allowedPermissions: ['inv-class:view'],
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Signatories',
        allowedPermissions: ['inv-class:view'],
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Suppliers',
        allowedPermissions: ['inv-class:view'],
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'UACS Object Codes',
        allowedPermissions: ['inv-class:view'],
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Unit of Issues',
        allowedPermissions: ['inv-class:view'],
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Paper Sizes',
        allowedPermissions: ['inv-class:view'],
        link: '/settings/library/inventory-classifications',
      },
    ],
  },
  {
    label: 'User Management',
    allowedPermissions: [
      'account-department:view',
      'account-section:view',
      'account-role:view',
      'account-user:view',
    ],
    icon: IconUserCog,
    initiallyOpened: false,
    links: [
      {
        label: 'Departments',
        allowedPermissions: ['account-department:view'],
        link: '/settings/accounts/departments',
      },
      {
        label: 'Sections',
        allowedPermissions: ['account-section:view'],
        link: '/settings/accounts/sections',
      },
      {
        label: 'Roles',
        allowedPermissions: ['account-role:view'],
        link: '/settings/accounts/roles',
      },
      {
        label: 'Users',
        allowedPermissions: ['account-user:view'],
        link: '/settings/accounts/users',
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
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom='sm'
            size='sm'
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom='sm'
            size='sm'
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

        <ModalClient
          type='primary'
          title={user.fullname}
          open={opened}
          handleClose={close}
        />
      </AppShell.Navbar>
      <AppShell.Main bg={'var(--mantine-color-gray-1)'}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
