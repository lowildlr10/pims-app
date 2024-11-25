'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import classes from '@/styles/generic/userbutton.module.css';
import { UserButtonProps } from '@/types/GenericTypes';

export function UserButtonClient({ user, handleOpen }: UserButtonProps) {
  return (
    <UnstyledButton className={classes.user} onClick={handleOpen}>
      <Group>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
          radius="xl"
        />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {user.fullname}
          </Text>

          <Text c="dimmed" size="xs">
            {user.position.position_name}
          </Text>
        </div>

        <IconChevronRight size={14} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}