'use client';

import { INVENTORY_LINKS, PROCUREMENT_LINKS } from '@/config/menus';
import { Breadcrumbs, Anchor, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { nprogress } from '@mantine/nprogress';
import { IconCaretRightFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { createRef, useEffect, useRef } from 'react';

type MenuLinkProps = Link & {
  pathname: string;
  allowed: boolean;
  anchorRef: React.RefObject<HTMLAnchorElement | null>;
};

const procurementLinks = PROCUREMENT_LINKS;
const inventoryLinks = INVENTORY_LINKS;

const MenuLink = ({
  label,
  link,
  pathname,
  allowed,
  anchorRef,
}: MenuLinkProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Anchor
      ref={anchorRef}
      data-active={pathname === link ? 'true' : undefined}
      href={allowed ? (pathname !== link ? link : '') : ''}
      component={Link}
      c={
        allowed
          ? pathname === link
            ? 'var(--mantine-color-primary-9)'
            : 'var(--mantine-color-primary-7)'
          : 'var(--mantine-color-gray-5)'
      }
      sx={{ cursor: allowed ? 'pointer' : 'not-allowed', textWrap: 'nowrap' }}
      fw={pathname === link ? 500 : 'normal'}
      fz={lgScreenAndBelow ? 'xs' : 'sm'}
      prefetch={false}
      onNavigate={(e) => {
        pathname !== link && nprogress.start();
      }}
    >
      {label}
    </Anchor>
  );
};

export function DirectoryPathClient({ permissions }: DirectoryPathProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  useEffect(() => {
    const activeMenu = document.querySelector('[data-active]');
    if (viewport.current && activeMenu instanceof HTMLElement) {
      const offset = activeMenu.offsetLeft;
      viewport.current.scrollTo({ left: offset - 16, behavior: 'auto' });
    }
  }, [pathname]);

  const renderProcurementMenuContent =
    /^\/procurement\/[^/]+$/.test(pathname) &&
    procurementLinks.map((item) => {
      const anchorRef = createRef<HTMLAnchorElement>();
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
          anchorRef={anchorRef}
        />
      );
    });

  const renderInventoryMenuContent =
    /^\/inventories\/[^/]+$/.test(pathname) &&
    inventoryLinks.map((item) => {
      const anchorRef = createRef<HTMLAnchorElement>();
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
          anchorRef={anchorRef}
        />
      );
    });

  return (
    <ScrollArea
      viewportRef={viewport}
      w={'94vw'}
      offsetScrollbars
      scrollbarSize={4}
      py={1}
    >
      <Breadcrumbs
        separator={
          <IconCaretRightFilled size={lgScreenAndBelow ? '1rem' : '0.65rem'} />
        }
        separatorMargin={lgScreenAndBelow ? 'xs' : 'sm'}
        mt={'xs'}
        sx={{ flexWrap: 'nowrap' }}
      >
        {renderProcurementMenuContent}
        {renderInventoryMenuContent}
      </Breadcrumbs>
    </ScrollArea>
  );
}
