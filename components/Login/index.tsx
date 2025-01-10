'use client';

import React from 'react';
import { Divider, Flex, Stack, Text, Title } from '@mantine/core';
import LoginFormClient from './LoginForm';
import LoginLogoClient from './LoginLogo';

const LoginClient = () => {
  return (
    <Flex direction={'row'} mih={'100vh'} w={'100%'}>
      <Stack
        bg={'var(--mantine-color-primary-9)'}
        c={'var(--mantine-color-white)'}
        w={'40%'}
        gap={0}
        justify={'center'}
        align={'center'}
      >
        <LoginLogoClient
          companyName='LGU - ATOK'
          logoUrl='/images/atok-logo.png'
        />

        <Divider
          size={'md'}
          bg={'var(--mantine-color-white)'}
          c={'var(--mantine-color-white)'}
          w={'80%'}
          mb={30}
        />

        <Stack align={'center'} justify={'center'}>
          <Title order={1} fw={800}>
            PROCUREMENT SYSTEM
          </Title>
          <Text size={'md'}>v1.0.0</Text>
        </Stack>
      </Stack>
      <Stack
        bg={'var(--mantine-color-white)'}
        w={'60%'}
        justify={'center'}
        align={'center'}
      >
        <LoginFormClient />
        <footer
          style={{ position: 'absolute', bottom: '0px', marginBottom: '10px' }}
        >
          <Text c='dimmed' size='11px' mt='10%'>
            @ 2024 ALL RIGHTS RESERVED
          </Text>
        </footer>
      </Stack>
    </Flex>
  );
};

export default LoginClient;
