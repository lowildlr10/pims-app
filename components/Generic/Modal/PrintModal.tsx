import {
  Button,
  Group,
  Modal,
  Stack,
} from '@mantine/core';
import React from 'react';
import { IconDownload, IconX } from '@tabler/icons-react';

const PrintModalClient = ({
  title,
  endpoint,
  opened,
  close
}: PrintModalProps) => {

  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={close}
      title={title ?? 'Print'}
      fullScreen={true}
      size={'md'}
      centered
    >
      <Stack mb={50}>
        <iframe
          src={endpoint}
          height='100%'
          width='100%'
          style={{
            height: 'calc(100vh - 8.2em)',
            border: '1px solid var(--mantine-color-tertiary-9)'
          }}
        ></iframe>
      </Stack>

      <Stack
        w={'100%'}
        bg={'white'}
        pos={'fixed'}
        bottom={0}
        right={0}
        align={'end'}
        p={15}
        sx={{ zIndex: 100 }}
      >
        <Group>
          <Button
            type={'button'}
            color={'var(--mantine-color-primary-9)'}
            size={'sm'}
            leftSection={<IconDownload size={18} />}
          >
            Download
          </Button>
          <Button
            variant={'outline'}
            size={'sm'}
            color={'var(--mantine-color-gray-8)'}
            leftSection={<IconX size={18} />}
            onClick={close}
          >
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default PrintModalClient;
