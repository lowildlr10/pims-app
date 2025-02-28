import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import {
  Button,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCancel,
  IconCheck,
  IconChecklist,
  IconDiscountCheckFilled,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ActionModalClient = ({
  title,
  message,
  color,
  actionType,
  buttonLabel,
  endpoint,
  redirect,
  opened,
  close,
  stack,
  updateTable,
}: ActionModalProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = () => {
    setLoading(true);

    API.put(endpoint)
      .then((res) => {
        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });

        if (updateTable) updateTable(res?.data?.data?.id, res?.data?.data);

        setLoading(false);

        if (stack) {
          close();
          stack.open('detail-modal');
        } else {
          close();
        }

        if (redirect) {
          setLoading(true);
          push(redirect);
        }
      })
      .catch((err) => {
        const errors = getErrors(err);

        errors.forEach((error) => {
          notify({
            title: 'Failed',
            message: error,
            color: 'red',
          });
        });

        setLoading(false);
      });
  };

  const dynamicButtonIcon = (actionType?: ActionType) => {
    switch (actionType) {
      case 'submit_approval':
        return <Loader size={18} color={'var(--mantine-color-gray-3)'} />;

      case 'approve_cash_available':
        return <IconDiscountCheckFilled size={18} stroke={1.5} />;

      case 'approve':
        return (
          <IconThumbUpFilled
            color={'var(--mantine-color-green-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'disapprove':
        return (
          <IconThumbDownFilled
            color={'var(--mantine-color-red-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'cancel':
        return (
          <IconCancel
            color={'var(--mantine-color-red-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'issue_canvassing':
        return <Loader size={18} color={'var(--mantine-color-gray-3)'} />;

      case 'canvass_complete':
        return (
          <IconCheck
            color={'var(--mantine-color-green-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'approve_rfq':
        return (
          <IconChecklist
            color={'var(--mantine-color-green-3)'}
            size={18}
            stroke={1.5}
          />
        );

      default:
        return <></>;
    }
  };

  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={close}
      title={title}
      size={'md'}
      centered
    >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <Stack mb={70} px={'sm'}>
        <Text>{message}</Text>
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
            color={color ?? 'var(--mantine-color-primary-9)'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            leftSection={dynamicButtonIcon(actionType)}
            loading={loading}
            loaderProps={{ type: 'dots' }}
            onClick={handleAction}
          >
            {buttonLabel}
          </Button>
          <Button
            variant={'outline'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            color={'var(--mantine-color-gray-8)'}
            leftSection={<IconCancel size={18} />}
            onClick={close}
          >
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ActionModalClient;
