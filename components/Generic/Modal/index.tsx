'use client';

import { Modal, Button, Group } from '@mantine/core';
import useAuth from '@/hooks/useAuth';
import { IconLogout2 } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';

export function ModalClient({ type, title, open, handleClose }: ModalProps) {
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
      {/* Modal content */}

      <Group mt='lg' justify='flex-end'>
        <Button variant='default' onClick={handleClose}>
          Close
        </Button>
        <Button
          loading={loading}
          loaderProps={{ type: 'dots' }}
          color='red'
          onClick={logout}
          autoContrast
        >
          <IconLogout2 size={18} />
          &nbsp;Logout
        </Button>
      </Group>
    </Modal>
  );
}
