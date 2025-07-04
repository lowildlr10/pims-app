'use client';

import { useEffect, useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Collapse,
  Flex,
  Group,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import classes from '@/styles/generic/navbarlinksgroup.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nprogress } from '@mantine/nprogress';

export function LinksGroupClient({
  icon: Icon,
  label,
  permissions,
  allowedPermissions,
  initiallyOpened,
  link,
  links,
}: LinksGroupProps) {
  const pathname = usePathname();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map(
    (link) =>
      (link?.allowedPermissions?.some((permission) =>
        permissions?.includes(permission)
      ) ||
        !allowedPermissions) && (
        <Anchor
          component={Link}
          className={classes.link}
          href={link.link ?? '#'}
          key={link.label}
          underline={'never'}
          bg={
            pathname === link.link
              ? 'var(--mantine-color-tertiary-1)'
              : undefined
          }
          c={pathname === link.link ? 'black' : undefined}
          fz={{ base: 'sm', lg: 13, xl: 'sm' }}
          prefetch={false}
          onNavigate={(e) => pathname !== link.link && nprogress.start()}
        >
          {link.label}
        </Anchor>
      )
  );

  useEffect(() => {
    (hasLinks ? links : []).forEach(
      (link) => link.link === pathname && setOpened(true)
    );
  }, [hasLinks, links, pathname]);

  return (
    (allowedPermissions?.some((permission) =>
      permissions?.includes(permission)
    ) ||
      !allowedPermissions) && (
      <>
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          className={classes.control}
          bg={pathname === link ? 'var(--mantine-color-tertiary-1)' : undefined}
        >
          <Anchor
            component={Link}
            href={link ?? '#'}
            underline={'never'}
            c={'inherit'}
            fz={{ base: 'sm', lg: 13, xl: 'sm' }}
            prefetch={false}
            onNavigate={(e) =>
              !hasLinks && pathname !== link && nprogress.start()
            }
          >
            <Group justify='space-between' gap={0}>
              <Flex align={'center'}>
                <ThemeIcon
                  color={'var(--mantine-color-primary-9)'}
                  variant='light'
                  size={30}
                >
                  <Icon size={18} />
                </ThemeIcon>
                <Box ml='md'>{label}</Box>
              </Flex>
              {hasLinks && (
                <IconChevronRight
                  className={classes.chevron}
                  stroke={1.5}
                  size={16}
                  style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
                />
              )}
            </Group>
          </Anchor>
        </UnstyledButton>
        {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
      </>
    )
  );
}
