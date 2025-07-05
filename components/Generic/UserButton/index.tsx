'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { Avatar, Group, Loader, Text, UnstyledButton } from '@mantine/core';
import classes from '@/styles/generic/userbutton.module.css';
import { useMediaQuery } from '@mantine/hooks';
import { useMediaAsset } from '@/hooks/useMediaAsset';

export function UserButtonClient({ user, handleOpen }: UserButtonProps) {
  const { media: avatar, loading } = useMediaAsset({
    type: 'avatar',
    user,
  });

  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');

  return (
    <UnstyledButton
      className={classes.user}
      onClick={handleOpen}
      p={{ base: 'sm', lg: 'xs', xl: 'md' }}
    >
      <Group>
        {loading ? (
          <Loader
            color={'var(--mantine-color-tertiary-0)'}
            type={'bars'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
          />
        ) : (
          <Avatar src={avatar ?? undefined} radius='xl' />
        )}

        <div style={{ flex: 1 }}>
          <Text fz={{ base: 'sm', lg: 13, xl: 'sm' }} size='sm' fw={500}>
            {user?.fullname}
          </Text>

          <Text fz={{ base: 'xs', lg: 11, xl: 'xs' }} c='dimmed' size='xs'>
            {user?.position?.position_name}
          </Text>
        </div>

        <IconChevronRight size={14} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}
