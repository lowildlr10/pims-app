import { Modal } from '@mantine/core';
import React from 'react';

const CreateModalClient = ({
  title,
  url,
  data,
  opened,
  fullscreen,
  close,
}: CreateModalProps) => {
  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={close}
      title={title ?? 'Create'}
      fullScreen={fullscreen}
    ></Modal>
  );
};

export default CreateModalClient;
