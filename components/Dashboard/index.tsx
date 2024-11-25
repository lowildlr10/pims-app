'use client';

import { Divider, Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';

const DashboardClient = ({ user }: DashboardProps) => {
  return (
    <Stack p={20}>
      <Group>
        <Stack gap={0}>
          <Text c={'gray'}>Welcome Back,</Text>
          <Title order={3} fw={600}>
            {user.fullname}
          </Title>
        </Stack>
      </Group>

      <Divider />
    </Stack>
  );
};

export default DashboardClient;
