'use client';

import React from 'react';
import { Image, Stack, Title } from '@mantine/core';

const LoginLogoClient = ({ logoUrl, companyName }: LoginLogoProps) => {
  return (
    <Stack justify={'center'} align={'center'} h={300}>
      <Image
        src={logoUrl ?? undefined}
        radius={'md'}
        h={300}
        w={'auto'}
        fit={'contain'}
        draggable={false}
        my={4}
        alt={companyName}
      />
      <Title order={3}>{companyName.toUpperCase()}</Title>
    </Stack>
  );
};

export default LoginLogoClient;
