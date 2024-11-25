'use client';

import React from 'react';
// import NextImage from 'next/image';
import { LoginLogoProps } from '@/types/LoginTypes';
import { Image, Stack, Title } from '@mantine/core';

const LoginLogoClient = ({logoUrl, companyName}: LoginLogoProps) => {
  return (
    <Stack
      justify={'center'}
      align={'center'}
    >
      <Image 
        src={logoUrl} 
        radius="md"
        h={200}
        w="auto"
        fit="contain"
        alt={companyName} 
      />
      <Title order={3}>
        {companyName}
      </Title>
    </Stack>
  )
}

export default LoginLogoClient;