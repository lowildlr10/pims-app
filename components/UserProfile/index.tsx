'use client';

import { Box, Divider, Flex, ScrollArea, Stack } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconSignature, IconUserCog } from '@tabler/icons-react';
import UserProfileFormClient from './UserProfileForm';
import SignatureFormClient from './SignatureForm';
import { Tabs } from '@mantine/core';
import SingleImageUploadClient from '../Generic/SingleImageUpload';
import { useViewportSize } from '@mantine/hooks';

const UserProfileClient = ({ user }: UserProfileProps) => {
  const { height, width } = useViewportSize();
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
          <SingleImageUploadClient
            image={user.avatar ?? ''}
            postUrl={`/media/${user.id}`}
            params={{ update_type: 'user-avatar' }}
            type={'avatar'}
          />
        </Box>

        <Divider size={'sm'} w={'100%'} my={20} />

        <Tabs
          color={'var(--mantine-color-primary-9)'}
          orientation={width === 0 || width > 1199 ? 'vertical' : 'horizontal'}
          w={'100%'}
          value={activeTab}
          onChange={setActiveTab}
        >
          <Tabs.List w={width === 0 || width > 1199 ? '100%' : 'auto'} fw={500}>
            <Tabs.Tab
              py={10}
              fz={'md'}
              value='information'
              bg={
                activeTab === 'information'
                  ? 'var(--mantine-color-secondary-1)'
                  : undefined
              }
              leftSection={<IconUserCog size={18} stroke={1.5} />}
            >
              User Information
            </Tabs.Tab>
            <Tabs.Tab
              py={10}
              fz={'md'}
              value='signature'
              bg={
                activeTab === 'signature'
                  ? 'var(--mantine-color-secondary-1)'
                  : undefined
              }
              leftSection={<IconSignature size={18} stroke={1.5} />}
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
        <Tabs value={activeTab} onChange={setActiveTab} w={'100%'}>
          <Tabs.Panel value={'information'}>
            <ScrollArea
              h={{ md: '100%', lg: 'calc(100vh - 16.5em)' }}
              px={{ base: 'md', lg: 'xl' }}
            >
              <UserProfileFormClient user={user} />
            </ScrollArea>
          </Tabs.Panel>
          <Tabs.Panel value='signature'>
            <ScrollArea
              h={{ md: '100%', lg: 'calc(100vh - 18em)' }}
              px={{ base: 'md', lg: 100 }}
            >
              <SignatureFormClient user={user} />
            </ScrollArea>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Flex>
  );
};

export default UserProfileClient;
