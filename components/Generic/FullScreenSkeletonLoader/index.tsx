'use client';

import { Flex, Skeleton } from '@mantine/core';
import React from 'react';

const FullScreenSkeletonLoaderClient = () => {
  return (
    <Flex
      direction='column'
      justify='center'
      align='center'
      w={'100%'}
      h={'calc(100vh - 25em)'}
    >
      <Skeleton height={40} width='60%' radius='md' mb='xl' />
      <Skeleton height={20} width='80%' radius='md' mb='sm' />
      <Skeleton height={20} width='75%' radius='md' mb='sm' />
      <Skeleton height={20} width='90%' radius='md' mb='sm' />
      <Skeleton height={20} width='85%' radius='md' />
    </Flex>
  );
};

export default FullScreenSkeletonLoaderClient;
