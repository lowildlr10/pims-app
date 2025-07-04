'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { Avatar, Group, Loader, Text, UnstyledButton } from '@mantine/core';
import classes from '@/styles/generic/userbutton.module.css';
import { useEffect, useState } from 'react';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { useMediaQuery } from '@mantine/hooks';
import Helper from '@/utils/Helpers';

export function UserButtonClient({ user, handleOpen }: UserButtonProps) {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Helper.empty(user) || Helper.empty(user?.avatar)) return;

    setLoading(true);

    let retries = 3;

    const fetch = () => {
      API.get('/media', {
        type: 'avatar',
        parent_id: user.id,
      })
        .then((res) => {
          const logo = res?.data?.data ?? undefined;
          setAvatar(logo);
        })
        .catch(() => {
          if (retries > 0) {
            retries -= 1;
            fetch();
          } else {
            notify({
              title: 'Failed',
              message: 'Failed after multiple retries',
              color: 'red',
            });
            setLoading(false);
          }
        })
        .finally(() => setLoading(false));
    };

    fetch();
  }, [user]);

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
