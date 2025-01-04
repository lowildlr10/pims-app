import { Modal } from '@mantine/core';
import React from 'react';

const UpdateModalClient = ({
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
      title={title ?? 'Update'}
      fullScreen={fullscreen}
    ></Modal>
  );
};

export default UpdateModalClient;
