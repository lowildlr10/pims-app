'use client';

import {
  Box,
  Container,
  Flex,
  Paper,
  SegmentedControl,
  Stack,
  Title,
} from '@mantine/core';
import React, { useState } from 'react';
import { IconSignature, IconUserCog } from '@tabler/icons-react';
import UserProfileFormClient from './UserProfileForm';
import SignatureFormClient from './SignatureForm';
import SingleImageUploadClient from '../Generic/SingleImageUpload';
import { useMediaAsset } from '@/hooks/useMediaAsset';

const UserProfileClient = ({ user }: UserProfileProps) => {
  const { media: avatar, clearCache: clearAvatarCache } = useMediaAsset({
    type: 'avatar',
    user,
  });

  const [activeTab, setActiveTab] = useState<string | undefined>('information');

  return (
    <Container size='xl' py='md'>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap='lg'
        align='flex-start'
      >
        <Stack
          align='center'
          w={{ base: '100%', md: 280 }}
          style={{ flexShrink: 0 }}
        >
          <Paper
            p='xl'
            radius='md'
            w='100%'
            style={{
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Stack align='center' gap='md'>
              <SingleImageUploadClient
                image={avatar ?? ''}
                postUrl={'/media'}
                params={{ type: 'avatar', parent_id: user.id }}
                type={'avatar'}
                clearImageCache={clearAvatarCache}
              />

              <Box ta='center'>
                <Title order={4} fw={600}>
                  {user.fullname}
                </Title>
                <Title order={6} c='dimmed' fw={400}>
                  {user.position?.position_name}
                </Title>
              </Box>
            </Stack>
          </Paper>
        </Stack>

        <Box flex={1} w={{ base: '100%', md: 'auto' }}>
          <Paper
            radius='md'
            p={{ base: 'md', sm: 'lg', md: 'xl' }}
            style={{
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
            }}
          >
            <SegmentedControl
              fullWidth
              value={activeTab}
              onChange={setActiveTab}
              data={[
                {
                  label: (
                    <Flex align='center' gap='xs' justify='center'>
                      <IconUserCog size={18} />
                      <span>Information</span>
                    </Flex>
                  ),
                  value: 'information',
                },
                {
                  label: (
                    <Flex align='center' gap='xs' justify='center'>
                      <IconSignature size={18} />
                      <span>Signature</span>
                    </Flex>
                  ),
                  value: 'signature',
                },
              ]}
              mb='lg'
              styles={{
                root: {
                  backgroundColor: 'var(--mantine-color-gray-1)',
                },
              }}
            />

            {activeTab === 'information' && (
              <UserProfileFormClient user={user} />
            )}
            {activeTab === 'signature' && <SignatureFormClient user={user} />}
          </Paper>
        </Box>
      </Flex>
    </Container>
  );
};

export default UserProfileClient;
