'use client';

import React, { useEffect, useState } from 'react';
import { Box, Image, Loader, Stack, Text, Title } from '@mantine/core';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';

const LoginLogoClient = ({ company }: LoginLogoProps) => {
  const [logo, setLogo] = useState('images/logo-fallback.png');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Helper.empty(company) || Helper.empty(company?.company_logo)) return;

    setLoading(true);

    let retries = 3;

    const fetch = () => {
      API.get('/media', {
        type: 'logo',
        parent_id: company.id,
      })
        .then((res) => {
          const logoImage = res?.data ?? undefined;
          setLogo(logoImage);
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
    <Stack justify='center' align='center' gap='sm'>
      <Box
        h={{ base: 90, sm: 110, md: 130, lg: 150 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <Loader color='var(--mantine-color-tertiary-0)' type='bars' />
        ) : (
          <Image
            src={logo}
            radius='md'
            h={{ base: 90, sm: 110, md: 130, lg: 150 }}
            w='auto'
            fit='contain'
            draggable={false}
            alt={company?.company_name ?? 'Logo'}
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
            }}
          />
        )}
      </Box>

      <Stack gap={2} align='center'>
        <Title
          order={3}
          fz={{ base: 'h5', sm: 'h4', lg: 'h4' }}
          ta='center'
          fw={700}
        >
          {company?.company_name?.toUpperCase()}
        </Title>
        {company?.address && (
          <Text
            size='xs'
            ta='center'
            style={{ opacity: 0.65 }}
            maw={260}
            lh={1.4}
          >
            {company.address}
          </Text>
        )}
      </Stack>
    </Stack>
  );
};

export default LoginLogoClient;
