'use client';

import {
  INVENTORY_LINKS,
  PAYMENT_LINKS,
  PROCUREMENT_LINKS,
} from '@/config/menus';
import { Breadcrumbs, Anchor } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { nprogress } from '@mantine/nprogress';
import { IconCaretRightFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuLinkProps = Link & {
  pathname: string;
  allowed: boolean;
};

const procurementLinks = PROCUREMENT_LINKS;
const inventoryLinks = INVENTORY_LINKS;
const paymentLinks = PAYMENT_LINKS;

const MenuLink = ({ label, link, pathname, allowed }: MenuLinkProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

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
      prefetch={false}
      onNavigate={(e) => pathname !== link && nprogress.start()}
    >
      {label}
    </Anchor>
  );
};

export function DirectoryPathClient({ permissions }: DirectoryPathProps) {
  const pathname = usePathname();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

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

  const renderInventoryMenuContent =
    /^\/inventories\/[^/]+$/.test(pathname) &&
    inventoryLinks.map((item) => {
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

  // const renderPaymentMenuContent =
  //   /^\/payments\/[^/]+$/.test(pathname) &&
  //   paymentLinks.map((item) => {
  //     const allowed = item.allowedPermissions?.some((permission) =>
  //       permissions?.includes(permission)
  //     );

  //     return (
  //       <MenuLink
  //         key={item.link}
  //         label={item.label}
  //         link={item.link}
  //         allowed={allowed}
  //         pathname={pathname}
  //       />
  //     );
  //   });

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
        {renderInventoryMenuContent}
        {/* {renderPaymentMenuContent} */}
      </Breadcrumbs>
    </>
  );
}
