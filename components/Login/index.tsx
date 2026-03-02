'use client';

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Badge,
  Box,
  Divider,
  Flex,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import LoginFormClient from './LoginForm';
import LoginLogoClient from './LoginLogo';
import { useScrollIntoView } from '@mantine/hooks';
import { Button } from '@mantine/core';
import {
  IconArrowDown,
  IconBox,
  IconBuildingWarehouse,
  IconShieldCheck,
} from '@tabler/icons-react';
import Helper from '@/utils/Helpers';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';

const FEATURES = [
  { icon: IconShieldCheck, label: 'Secure & Role-based Access' },
  { icon: IconBox, label: 'Real-time Inventory Tracking' },
  { icon: IconBuildingWarehouse, label: 'End-to-end Procurement Flow' },
];

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
          const backgroundImage = res?.data ?? undefined;
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
    <Box p={0} m={0} style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        mih={{ base: '100dvh', lg: '100vh' }}
        w='100%'
      >
        {/* ── Left Panel – Branding ── */}
        <Box
          pos='relative'
          w={{ base: '100%', lg: '42%' }}
          style={{
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: background
              ? 'color-mix(in srgb, var(--mantine-color-primary-9) 94%, transparent)'
              : 'var(--mantine-color-primary-9)',
            backdropFilter: background ? 'blur(2px)' : undefined,
          }}
        >
          {/* Decorative blobs */}
          <Box
            pos='absolute'
            style={{
              width: 380,
              height: 380,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              top: -120,
              right: -120,
              pointerEvents: 'none',
            }}
          />
          <Box
            pos='absolute'
            style={{
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              bottom: -60,
              left: -80,
              pointerEvents: 'none',
            }}
          />
          <Box
            pos='absolute'
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              bottom: 200,
              right: 30,
              pointerEvents: 'none',
            }}
          />

          <Stack
            c='var(--mantine-color-white)'
            w='100%'
            h={{ base: 'auto', lg: '100vh' }}
            py={{ base: 'xl', lg: 0 }}
            px={{ base: 'xl', sm: '3rem' }}
            gap='lg'
            justify='center'
            align='center'
            style={{ position: 'relative', zIndex: 1 }}
          >
            <LoginLogoClient company={company} />

            <Divider
              size='xs'
              w={160}
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}
            />

            <Stack align='center' gap='xs'>
              <Title
                fw={800}
                fz={{ base: 'h4', sm: 'h3', lg: 'h3' }}
                ta='center'
                lh={1.35}
                style={{ letterSpacing: '-0.01em' }}
              >
                PROCUREMENT &amp;
                <br />
                INVENTORY MANAGEMENT
                <br />
                SYSTEM
              </Title>

              <Badge
                variant='light'
                color='gray'
                size='sm'
                mt={4}
                style={{ opacity: 0.75 }}
              >
                v1.0.0
              </Badge>
            </Stack>

            {/* Feature highlights */}
            <Stack gap='sm' mt='md' w='100%' maw={270}>
              {FEATURES.map(({ icon: Icon, label }) => (
                <Flex key={label} align='center' gap='sm'>
                  <ThemeIcon
                    size='sm'
                    variant='white'
                    color='var(--mantine-color-primary-9)'
                    radius='xl'
                    style={{ opacity: 0.9, flexShrink: 0 }}
                  >
                    <Icon size={13} />
                  </ThemeIcon>
                  <Text size='sm' style={{ opacity: 0.85 }}>
                    {label}
                  </Text>
                </Flex>
              ))}
            </Stack>

            {/* Mobile scroll-to-form button */}
            <Button
              display={{ lg: 'none' }}
              size='md'
              variant='white'
              color='var(--mantine-color-primary-9)'
              rightSection={<IconArrowDown size={16} stroke={2} />}
              onClick={() => scrollIntoView({ alignment: 'center' })}
              mt='sm'
              radius='xl'
              fw={600}
            >
              Sign In
            </Button>
          </Stack>
        </Box>

        {/* ── Right Panel – Form ── */}
        <Flex
          w={{ base: '100%', lg: '58%' }}
          mih={{ base: 'auto', lg: '100vh' }}
          py={{ base: 'xl', lg: 0 }}
          px={{ base: 'md', sm: 'xl' }}
          justify='center'
          align='center'
          direction='column'
          ref={targetRef}
          style={{
            position: 'relative',
            backgroundColor: background
              ? 'color-mix(in srgb, var(--mantine-color-gray-0) 94%, transparent)'
              : 'var(--mantine-color-gray-0)',
            backdropFilter: background ? 'blur(2px)' : undefined,
          }}
        >
          <LoginFormClient />

          <Text
            pos={{ base: 'relative', lg: 'absolute' }}
            bottom={{ base: 0, lg: 24 }}
            mt={{ base: 'xl', lg: 0 }}
            c='dimmed'
            size='xs'
            ta='center'
          >
            &copy; {dayjs().year()} All Rights Reserved
          </Text>
        </Flex>
      </Flex>

      {background && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -100,
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
    </Box>
  );
};

export default LoginClient;
