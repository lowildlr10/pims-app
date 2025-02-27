'use client';

import { Divider, Group, Text, Title } from '@mantine/core';
import { Stack } from '@mantine/core';
import { Paper } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

const MainContainerClient = ({
  secondaryTtile,
  title,
  children,
}: MainContainerProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');

  return (
    <Paper shadow='sm' p='xl' h={{ base: '100%', lg: 'calc(100vh - 6em)' }}>
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
        </Stack>
      </Group>

      <Divider my={20} />

      {children}
    </Paper>
  );
};

export default MainContainerClient;
