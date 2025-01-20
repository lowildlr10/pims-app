'use client';

import React from 'react';
import dayjs from 'dayjs';
import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import LoginFormClient from './LoginForm';
import LoginLogoClient from './LoginLogo';
import Image from 'next/image';

const LoginClient = ({ company }: LoginProps) => {
  return (
    <Box p={0} m={0}>
      <Flex direction={'row'} mih={'100vh'} w={'100%'}>
        <Stack
          bg={'var(--mantine-color-primary-9)'}
          c={'var(--mantine-color-white)'}
          opacity={company?.login_background ? 0.9 : 1}
          w={'40%'}
          gap={0}
          justify={'center'}
          align={'center'}
        >
          <LoginLogoClient
            companyName={company?.company_name ?? 'Company'}
            logoUrl={company?.company_logo ?? '/images/logo-fallback.png'}
          />

          <Divider
            size={'sm'}
            bg={'var(--mantine-color-white)'}
            c={'var(--mantine-color-white)'}
            w={'80%'}
            mt={15}
            mb={30}
          />

          <Stack align={'center'} justify={'center'}>
            <Title order={1} fw={600}>
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
            style={{
              position: 'absolute',
              bottom: '0px',
              marginBottom: '10px',
            }}
          >
            <Text c='dimmed' size={'sm'} mt='10%'>
              @ {dayjs().year()} ALL RIGHTS RESERVED
            </Text>
          </footer>
        </Stack>
      </Flex>

      {company?.login_background && (
        <Box sx={{ zIndex: -100 }}>
          <Image
            src={company?.login_background ?? undefined}
            alt={'Background Image'}
            loading={'lazy'}
            style={{
              zIndex: -100,
              objectFit: 'cover',
            }}
            fill
          />
        </Box>
      )}
    </Box>
  );
};

export default LoginClient;
