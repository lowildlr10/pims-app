'use client';

import { Box, Divider, Flex, ScrollArea, Stack } from '@mantine/core';
import React, { useState } from 'react';
import { IconSignature, IconUserCog } from '@tabler/icons-react';
import UserProfileFormClient from './UserProfileForm';
import SignatureFormClient from './SignatureForm';
import { Tabs } from '@mantine/core';
import AvatarFormClient from './AvatarForm';

const UserProfileClient = ({ user }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState<string | null>('information');

  return (
    <Flex
      direction={{
        base: 'column',
        lg: 'row',
      }}
    >
      <Stack
        align={'center'}
        justify={'flex-start'}
        p={'md'}
        w={{ base: '100%', lg: '25%' }}
      >
        <Box mb={10}>
          <AvatarFormClient user={user} />
        </Box>

        <Divider size={'sm'} w={'100%'} my={20} />

        <Tabs
          orientation={'vertical'}
          value={activeTab}
          onChange={setActiveTab}
          sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <Tabs.List>
            <Tabs.Tab
              py={10}
              fz={'md'}
              value='information'
              leftSection={<IconUserCog size='1rem' stroke={1.5} />}
            >
              User Information
            </Tabs.Tab>
            <Tabs.Tab
              py={10}
              fz={'md'}
              value='signature'
              leftSection={<IconSignature size='1rem' stroke={1.5} />}
            >
              Signature
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Stack>
      <Stack
        align={'center'}
        justify={'top'}
        p={'md'}
        w={{ md: '100%', lg: '75%' }}
      >
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.Panel value={'information'}>
            <ScrollArea h={{ md: '100%', lg: 'calc(100vh - 18em)' }}>
              <UserProfileFormClient user={user} />
            </ScrollArea>
          </Tabs.Panel>
          <Tabs.Panel value='signature'>
            <SignatureFormClient user={user} />
          </Tabs.Panel>
        </Tabs>
        <ScrollArea></ScrollArea>
      </Stack>
    </Flex>
  );
};

export default UserProfileClient;
