'use client';

import React from 'react';
import { Image, Stack, Title } from '@mantine/core';
import { Box } from '@mantine/core';

const LoginLogoClient = ({ logoUrl, companyName }: LoginLogoProps) => {
  return (
    <Stack justify={'center'} align={'center'}>
      <Box h={{ base: 100, sm: 120, md: 150, lg: 200 }}>
        <Image
          src={logoUrl ?? undefined}
          radius={'md'}
          h={{ base: 100, sm: 120, md: 150, lg: 200 }}
          w={'auto'}
          fit={'contain'}
          draggable={false}
          alt={companyName}
        />
      </Box>

      <Title order={3} fz={{ base: 'h5', sm: 'h4', lg: 'h3' }}>
        {companyName.toUpperCase()}
      </Title>
    </Stack>
  );
};

export default LoginLogoClient;
