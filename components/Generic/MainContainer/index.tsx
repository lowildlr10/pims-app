'use client';

import { Divider, Group, Text, Title } from '@mantine/core';
import { Stack } from '@mantine/core';
import { Paper } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import { DirectoryPathClient } from '../DirectoryPath';

const MainContainerClient = ({
  secondaryTtile,
  title,
  children,
  permissions,
}: MainContainerProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    // <Paper shadow='sm' p='xl' h={{ base: '100%', lg: 'calc(100vh - 6em)' }}>
    <Paper shadow='sm' p='xl'>
      <Group>
        <Stack gap={0}>
          {secondaryTtile && (
            <Text size={lgScreenAndBelow ? 'sm' : 'md'} c={'gray'}>
              {secondaryTtile}
            </Text>
          )}

          <Title
            order={
              lgScreenAndBelow
                ? secondaryTtile
                  ? 5
                  : 4
                : secondaryTtile
                  ? 4
                  : 3
            }
            fw={600}
          >
            {title}
          </Title>
          <DirectoryPathClient permissions={permissions} />
        </Stack>
      </Group>

      <Divider my={20} />

      {children}
    </Paper>
  );
};

export default MainContainerClient;
