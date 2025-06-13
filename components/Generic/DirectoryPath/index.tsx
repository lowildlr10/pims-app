'use client';

import { Breadcrumbs, Anchor } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCaretRightFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuLinkProps = Link & {
  pathname: string;
  allowed: boolean;
};

const procurementLinks = [
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
];

const MenuLink = ({ label, link, pathname, allowed }: MenuLinkProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');

  return (
    <Anchor
      href={allowed ? (pathname !== link ? link : '') : ''}
      component={Link}
      c={
        allowed
          ? pathname === link
            ? 'var(--mantine-color-primary-9)'
            : 'var(--mantine-color-primary-7)'
          : 'var(--mantine-color-gray-5)'
      }
      sx={{ cursor: allowed ? 'pointer' : 'not-allowed' }}
      fw={pathname === link ? 500 : 'normal'}
      fz={lgScreenAndBelow ? 'xs' : 'sm'}
    >
      {label}
    </Anchor>
  );
};

export function DirectoryPathClient({ permissions }: DirectoryPathProps) {
  const pathname = usePathname();
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');

  const renderProcurementMenuContent =
    /^\/procurement\/[^/]+$/.test(pathname) &&
    procurementLinks.map((item) => {
      const allowed = item.allowedPermissions?.some((permission) =>
        permissions?.includes(permission)
      );

      return (
        <MenuLink
          key={item.link}
          label={item.label}
          link={item.link}
          allowed={allowed}
          pathname={pathname}
        />
      );
    });

  return (
    <>
      <Breadcrumbs
        separator={
          <IconCaretRightFilled size={lgScreenAndBelow ? '1rem' : '0.65rem'} />
        }
        separatorMargin={lgScreenAndBelow ? 'xs' : 'sm'}
        mt={'xs'}
      >
        {renderProcurementMenuContent}
      </Breadcrumbs>
    </>
  );
}
