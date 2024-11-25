'use client';

import { Modal, Button, Group } from '@mantine/core';
import { ModalProps } from '@/types/GenericTypes';
import useAuth from '@/hooks/useAuth';
import { IconLogout2 } from '@tabler/icons-react';

export function ModalClient({type, title, open, handleClose}: ModalProps) {
  const { loading, logout } = useAuth();

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

      <Group mt="lg" justify="flex-end">
        <Button variant="default" onClick={handleClose}>
          Close
        </Button>
        <Button 
          loading={loading}
          loaderProps={{ type: 'dots' }}
          color="red" 
          onClick={logout}
          autoContrast
        >
          <IconLogout2 size={18} />&nbsp;Logout
        </Button>
      </Group>
    </Modal>
  );
}