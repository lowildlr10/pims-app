'use client';

import { AppShell, Burger, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import { LinksGroupClient } from '../NavbarLinksGroup';
import classes from '@/styles/generic/sidebar.module.css';
import { LayoutSidebarProps } from '@/types/generic/LayoutSidebarTypes';
import { IconGauge, IconNotes } from '@tabler/icons-react';
import { LinksGroupProps } from '@/types/generic/LinksGroupTypes';
import { UserButtonClient } from '../UserButton';

const defaultMenus: LinksGroupProps[] = [
  { label: 'Dashboard', icon: IconGauge, link: '/' },
  {
    label: 'Procurement',
    module: 'procurement',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Purchase Requests', module: 'pr', link: '/procurement/pr' },
      { label: 'Request for Quotations', module: 'rfq', link: '/procurement/rfq' },
      { label: 'Abstract of Quotations', module: 'aoq', link: '/procurement/aoq' },
      { label: 'Purchase/Job Orders', module: 'po', link: '/procurement/po' },
      { label: 'Inspection and Acceptance Report', module: 'iar', link: '/procurement/iar' },
      { label: 'Obligation Request and Status', module: 'ors', link: '/procurement/ors' },
      { label: 'Disbursement Voucher', module: 'dv', link: '/procurement/dv' },
    ],
  },
  {
    label: 'Inventory',
    module: 'inventory',
    icon: IconNotes,
    initiallyOpened: false,
    links: [
      { label: 'Requisition and Issue Slip', module: 'ris', link: '/inventory/ris' },
      { label: 'Inventory Custodian Slip', module: 'ics', link: '/inventory/ics' },
      { label: 'Aknowledgement Receipt of Equipment', module: 'are', link: '/inventory/are' },
    ],
  },
  {
    label: 'Payment',
    module: 'payment',
    icon: IconNotes,
    initiallyOpened: false,
    links: [
      { label: 'Check', module: 'check', link: '/payment/check' },
      { label: 'Bank Deposit', module: 'deposit', link: '/payment/deposit' },
    ],
  },
  { label: 'Settings', icon: IconGauge, link: '/settings' },
]

export function LayoutSidebarClient({ children }: LayoutSidebarProps) {
  const links = defaultMenus.map((item) => <LinksGroupClient {...item} key={item.label} />);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      mih={'100vh'}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <MantineLogo size={30} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>

        <div className={classes.footer}>
          <UserButtonClient />
        </div>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}