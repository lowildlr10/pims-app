import { Divider, Group, Text, Title } from '@mantine/core';
import { Stack } from '@mantine/core';
import { Paper } from '@mantine/core';
import React from 'react';

const MainContainerClient = ({
  secondaryTtile,
  title,
  children,
}: MainContainerProps) => {
  return (
    <Paper shadow='sm' p='xl' h={'calc(100vh - 6em)'}>
      <Group>
        <Stack gap={0}>
          {secondaryTtile && <Text c={'gray'}>{secondaryTtile}</Text>}

          <Title order={secondaryTtile ? 3 : 2} fw={600}>
            {title}
          </Title>
        </Stack>
      </Group>

      <Divider my={20} />

      {children}
    </Paper>
  );
};

export default MainContainerClient;
