import { useState } from 'react';
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

export function LinksGroupClient({
  icon: Icon,
  label,
  permissions,
  allowedPermissions,
  initiallyOpened,
  link,
  links,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map(
    (link) =>
      (link?.allowedPermissions?.some((permission) =>
        permissions.includes(permission)
      ) ||
        !allowedPermissions) && (
        <Anchor
          component={Link}
          className={classes.link}
          href={link.link ?? '#'}
          key={link.label}
          underline={'never'}
          onClick={(event) => event.preventDefault()}
        >
          {link.label}
        </Anchor>
      )
  );

  return (
    (allowedPermissions?.some((permission) =>
      permissions.includes(permission)
    ) ||
      !allowedPermissions) && (
      <>
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          className={classes.control}
        >
          <Anchor
            component={Link}
            href={link ?? '#'}
            underline={'never'}
            c={'inherit'}
          >
            <Group justify='space-between' gap={0}>
              <Flex align={'center'}>
                <ThemeIcon variant='light' size={30}>
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
