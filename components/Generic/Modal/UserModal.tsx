'use client';

import { Modal, Button, Group } from '@mantine/core';
import useAuth from '@/hooks/useAuth';
import { IconArrowRight, IconLogout2, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';
import { notify } from '@/libs/Notification';

const UserModalClient = ({ title, open, handleClose }: UserModalProps) => {
  const router = useRouter();
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const { loading, message, error, logout } = useAuth();
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!message) return;
    if (!error) setLoggedOut(true);

    notify({
      title: error ? 'Failed!' : 'Success!',
      message: message,
      color: error ? 'red' : 'green',
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
          size={lgScreenAndBelow ? 'xs' : 'sm'}
          loading={loading || loggedOut}
          loaderProps={{ type: 'dots' }}
          color={'var(--mantine-color-red-9)'}
          leftSection={<IconLogout2 size={18} />}
          variant={'outline'}
          onClick={logout}
          autoContrast
          disabled={loggedOut}
        >
          Logout
        </Button>
        <Button
          size={lgScreenAndBelow ? 'xs' : 'sm'}
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
