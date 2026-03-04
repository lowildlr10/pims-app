'use client';

import {
  Box,
  Divider,
  Group,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { Stack } from '@mantine/core';
import { Paper } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import { DirectoryPathClient } from '../DirectoryPath';
import PageHeader from '../PageHeader';

type MainContainerProps = {
  secondaryTtile?: string;
  title?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  permissions?: string[];
};

const MainContainerClient = ({
  secondaryTtile,
  title,
  children,
  permissions,
  icon,
  actions,
}: MainContainerProps) => {
  const theme = useMantineTheme();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Paper
      shadow='sm'
      p={lgScreenAndBelow ? 'md' : 'xl'}
      mih={lgScreenAndBelow ? 'calc(100vh - 45px)' : 'calc(100vh - 50px)'}
    >
      {title && (
        <PageHeader
          title={title}
          subtitle={secondaryTtile || ''}
          icon={icon}
          background={theme.colors.primary[8]}
          textColor='white'
          actions={actions}
        />
      )}

      {title && (
        <Box mt='md'>
          <DirectoryPathClient permissions={permissions} />
        </Box>
      )}

      {!title && <DirectoryPathClient permissions={permissions} />}

      <Divider my='lg' />

      {children}
    </Paper>
  );
};

export default MainContainerClient;
