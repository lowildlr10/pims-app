'use client';

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import LoginFormClient from './LoginForm';
import LoginLogoClient from './LoginLogo';
import Image from 'next/image';
import { useScrollIntoView } from '@mantine/hooks';
import { Button } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Helper from '@/utils/Helpers';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';

const LoginClient = ({ company }: LoginProps) => {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const [background, setBackground] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Helper.empty(company) || Helper.empty(company?.login_background))
      return;

    setLoading(true);

    let retries = 3;

    const fetch = () => {
      API.get('/media', {
        type: 'login-background',
        parent_id: company.id,
      })
        .then((res) => {
          const backgroundImage = res?.data?.data ?? undefined;
          setBackground(backgroundImage);
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
  }, [company]);

  return (
    <Box p={0} m={0}>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        mih={{ base: 'auto', lg: '100vh' }}
        w={'100%'}
      >
        <Stack
          bg={'var(--mantine-color-primary-9)'}
          c={'var(--mantine-color-white)'}
          opacity={background ? 0.9 : 1}
          w={{ base: '100vw', lg: '40%' }}
          gap={'sm'}
          justify={'center'}
          align={'center'}
          h={{ base: '100vh', lg: undefined }}
        >
          <LoginLogoClient company={company} />

          <Divider
            size={'sm'}
            bg={'var(--mantine-color-white)'}
            c={'var(--mantine-color-white)'}
            w={{ base: 220, sm: 300, lg: '80%' }}
          />

          <Stack align={'center'} justify={'center'}>
            <Title
              order={2}
              fw={600}
              fz={{ base: 'h4', sm: 'h3', md: 'h2', lg: 'h2', xl: 'h1' }}
              ta={'center'}
            >
              PROCUREMENT SYSTEM
            </Title>
            <Text fz={{ base: 'sm', lg: 'md' }}>v1.0.0</Text>
          </Stack>

          <Button
            display={{ lg: 'none' }}
            color={'var(--mantine-color-primary-7)'}
            rightSection={<IconArrowRight size={18} stroke={1.5} />}
            onClick={() =>
              scrollIntoView({
                alignment: 'center',
              })
            }
          >
            Login Now
          </Button>
        </Stack>
        <Stack
          bg={'var(--mantine-color-white)'}
          w={{ base: '100vw', lg: '60%' }}
          justify={'center'}
          align={'center'}
          h={{ base: '100vh', lg: undefined }}
          ref={targetRef}
        >
          <LoginFormClient />
          <Box
            pos={{ base: 'relative', lg: 'absolute' }}
            bottom={0}
            mb={{ base: 0, lg: 10 }}
          >
            <Text c='dimmed' size={'sm'} mt='10%'>
              @ {dayjs().year()} ALL RIGHTS RESERVED
            </Text>
          </Box>
        </Stack>
      </Flex>

      {background && (
        <Image
          src={background ?? undefined}
          alt={'Background Image'}
          loading={'lazy'}
          style={{
            zIndex: -100,
            objectFit: 'cover',
          }}
          fill
        />
      )}
    </Box>
  );
};

export default LoginClient;
