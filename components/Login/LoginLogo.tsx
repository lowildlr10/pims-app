'use client';

import React, { useEffect, useState } from 'react';
import { Image, Loader, Stack, Title } from '@mantine/core';
import { Box } from '@mantine/core';
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
          const logoImage = res?.data?.data ?? undefined;
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
    <Stack justify={'center'} align={'center'}>
      <Box h={{ base: 100, sm: 120, md: 150, lg: 200 }}>
        {loading ? (
          <Loader color={'var(--mantine-color-tertiary-0)'} type={'bars'} />
        ) : (
          <Image
            src={logo}
            radius={'md'}
            h={{ base: 100, sm: 120, md: 150, lg: 200 }}
            w={'auto'}
            fit={'contain'}
            draggable={false}
            alt={company?.company_name}
          />
        )}
      </Box>

      <Title order={3} fz={{ base: 'h5', sm: 'h4', lg: 'h3' }}>
        {company?.company_name?.toUpperCase()}
      </Title>
    </Stack>
  );
};

export default LoginLogoClient;
