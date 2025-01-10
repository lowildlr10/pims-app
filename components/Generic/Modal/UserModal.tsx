'use client';

import { Modal, Button, Group } from '@mantine/core';
import useAuth from '@/hooks/useAuth';
import { IconArrowRight, IconLogout2, IconUser } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UserModalClient = ({ title, open, handleClose }: UserModalProps) => {
  const router = useRouter();
  const { loading, message, error, logout } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!message) return;

    notifications.show({
      title: error ? 'Failed!' : 'Success!',
      message: message,
      color: error ? 'red' : 'green',
      autoClose: 3000,
      position: 'top-right',
    });
  }, [loading]);

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      title={title}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Group mt='lg' justify='flex-end'>
        <Button variant='default' onClick={handleClose}>
          Close
        </Button>
        <Button
          loading={loading}
          loaderProps={{ type: 'dots' }}
          color={'var(--mantine-color-red-9)'}
          leftSection={<IconLogout2 size={18} />}
          onClick={logout}
          autoContrast
        >
          Logout
        </Button>
        <Button
          color={'var(--mantine-color-primary-9)'}
          onClick={() => {
            router.push('/settings');
            handleClose();
          }}
          leftSection={<IconUser size={18} />}
          rightSection={<IconArrowRight size={18} />}
          autoContrast
        >
          Profile
        </Button>
      </Group>
    </Modal>
  );
};

export default UserModalClient;
