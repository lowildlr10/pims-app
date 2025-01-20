'use client';

import { Indicator } from '@mantine/core';
import { ActionIcon, Box, Menu } from '@mantine/core';
import {
  IconArrowsLeftRight,
  IconBellFilled,
  IconMessageCircle,
  IconPhoto,
  IconSettings,
} from '@tabler/icons-react';
import React from 'react';

const NotificationMenuButtonClient = () => {
  return (
    <Menu shadow={'md'} width={300}>
      <Menu.Target>
        <Box mx={'sm'}>
          <Indicator
            inline
            size={8}
            offset={7}
            position={'bottom-end'}
            color={'var(--mantine-color-red-7)'}
            processing
          >
            <ActionIcon size={'lg'} variant={'transparent'} color={'white'}>
              <IconBellFilled size={24} stroke={1.5} />
            </ActionIcon>
          </Indicator>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Notifications</Menu.Label>
        <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle size={14} />}>
          Messages
        </Menu.Item>
        <Menu.Item leftSection={<IconPhoto size={14} />}>Gallery</Menu.Item>

        <Menu.Divider />

        <Menu.Item leftSection={<IconArrowsLeftRight size={14} />}>
          Show All
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NotificationMenuButtonClient;
