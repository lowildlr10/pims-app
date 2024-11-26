'use client';

import {
  Avatar,
  Box,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Title,
} from '@mantine/core';
import React, { useState } from 'react';
import { IconSignature, IconUserCog } from '@tabler/icons-react';
import UserProfileFormClient from './UserProfileForm';
import SignatureFormClient from './SignatureForm';
import { Tabs } from '@mantine/core';

const UserProfileClient = ({ user }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState<string | null>('information');

  return (
    <Stack p={20}>
      <Group>
        <Stack gap={0}>
          <Title order={2} fw={600}>
            Profile
          </Title>
        </Stack>
      </Group>

      <Divider />

      <Paper shadow='xs' p='xl'>
        <Flex>
          <Stack align={'center'} justify={'flex-start'} p={'md'} w={'25%'}>
            <Box mb={10}>
              <Avatar size={250} />
            </Box>

            <Divider size={'sm'} w={'100%'} my={20} />

            <Tabs
              orientation='vertical'
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
          <Stack align={'center'} justify={'top'} p={'md'} w={'75%'}>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.Panel value={'information'}>
                <ScrollArea>
                  <UserProfileFormClient user={user} />
                </ScrollArea>
              </Tabs.Panel>
              <Tabs.Panel value='signature'>
                <SignatureFormClient />
              </Tabs.Panel>
            </Tabs>
            <ScrollArea></ScrollArea>
          </Stack>
        </Flex>
      </Paper>
    </Stack>
  );
};

export default UserProfileClient;
