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
    module: 'procurement',
    icon: IconShoppingCart,
    initiallyOpened: true,
    links: [
      { label: 'Purchase Requests', module: 'pr', link: '/procurement/pr' },
      {
        label: 'Request for Quotations',
        module: 'rfq',
        link: '/procurement/rfq',
      },
      {
        label: 'Abstract of Quotations',
        module: 'aoq',
        link: '/procurement/aoq',
      },
      { label: 'Purchase/Job Orders', module: 'po', link: '/procurement/po' },
      {
        label: 'Inspection and Acceptance Report',
        module: 'iar',
        link: '/procurement/iar',
      },
      {
        label: 'Obligation Request and Status',
        module: 'ors',
        link: '/procurement/ors',
      },
      { label: 'Disbursement Voucher', module: 'dv', link: '/procurement/dv' },
    ],
  },
  {
    label: 'Inventory',
    module: 'inventory',
    icon: IconBuildingWarehouse,
    initiallyOpened: false,
    links: [
      {
        label: 'Requisition and Issue Slip',
        module: 'ris',
        link: '/inventory/ris',
      },
      {
        label: 'Inventory Custodian Slip',
        module: 'ics',
        link: '/inventory/ics',
      },
      {
        label: 'Aknowledgement Receipt of Equipment',
        module: 'are',
        link: '/inventory/are',
      },
    ],
  },
  {
    label: 'Payment',
    module: 'payment',
    icon: IconCash,
    initiallyOpened: false,
    links: [
      { label: 'Check', module: 'check', link: '/payment/check' },
      { label: 'Bank Deposit', module: 'deposit', link: '/payment/deposit' },
    ],
  },
  { label: 'Settings', icon: IconSettings2, link: '/settings' },
];

const defaultSettingsMenus: LinksGroupProps[] = [
  { label: 'User Profile', icon: IconUser, link: '/settings' },
  {
    label: 'Company Profile',
    module: 'company',
    icon: IconSitemap,
    link: '/settings/company-profile',
  },
  {
    label: 'Library',
    module: 'library',
    icon: IconLibrary,
    initiallyOpened: false,
    links: [
      {
        label: 'Inventory Classifications',
        module: 'lib-inv-class',
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'MFO PAP',
        module: 'lib-inv-class',
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Modes of Procurement',
        module: 'lib-inv-class',
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Funding Soruces',
        module: 'lib-inv-class',
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Signatories',
        module: 'lib-inv-class',
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Suppliers',
        module: 'lib-inv-class',
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'UACS Object Codes',
        module: 'lib-inv-class',
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Unit of Issues',
        module: 'lib-inv-class',
        link: '/settings/library/inventory-classifications',
      },
      {
        label: 'Paper Sizes',
        module: 'lib-inv-class',
        link: '/settings/library/inventory-classifications',
      },
    ],
  },
  {
    label: 'User Management',
    module: 'user-management',
    icon: IconUserCog,
    initiallyOpened: false,
    links: [
      {
        label: 'Departments',
        module: 'check',
        link: '/settings/accounts/departments',
      },
      {
        label: 'Sections',
        module: 'check',
        link: '/settings/accounts/sections',
      },
      { label: 'Roles', module: 'deposit', link: '/settings/accounts/roles' },
      { label: 'Users', module: 'check', link: '/settings/accounts/users' },
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
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
