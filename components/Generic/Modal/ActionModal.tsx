'use client';

import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import {
  Button,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconArrowBack,
  IconArrowForward,
  IconAwardFilled,
  IconCancel,
  IconCheck,
  IconDiscountCheckFilled,
  IconPackageImport,
  IconShoppingCartSearch,
  IconThumbDownFilled,
  IconThumbUpFilled,
  IconTruckDelivery,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import CustomLoadingOverlay from '../CustomLoadingOverlay';

const ActionModalClient = ({
  title,
  children,
  color,
  actionType,
  buttonLabel,
  endpoint,
  redirect,
  size = 'md',
  fullScreen,
  opened,
  close,
  stack,
  updateTable,
  requiresPayload = false,
}: ActionModalProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalFullScreen, setModalFullScreen] = useState(fullScreen);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if ((!fullScreen && lgScreenAndBelow) || fullScreen)
      setModalFullScreen(true);

    if (!fullScreen && !lgScreenAndBelow) setModalFullScreen(false);
  }, [fullScreen, lgScreenAndBelow]);

  const handleAction = (uncontrolledPayload?: object) => {
    setLoading(true);

    API.put(endpoint, uncontrolledPayload ?? {})
      .then((res) => {
        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });

        if (updateTable) updateTable(null);

        setLoading(false);

        close();

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
      case 'pending':
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

      case 'issue':
        return (
          <IconArrowForward
            color={'var(--mantine-color-yellow-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'receive':
        return (
          <IconArrowBack
            color={'var(--mantine-color-green-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'complete':
        return (
          <IconCheck
            color={'var(--mantine-color-green-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'award':
        return (
          <IconAwardFilled
            color={'var(--mantine-color-lime-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'receive':
        return (
          <IconArrowBack
            color={'var(--mantine-color-green-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'for_delivery':
        return (
          <IconTruckDelivery
            color={'var(--mantine-color-yellow-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'delivered':
        return (
          <IconPackageImport
            color={'var(--mantine-color-green-3)'}
            size={18}
            stroke={1.5}
          />
        );

      case 'inspect':
        return (
          <IconShoppingCartSearch
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
      size={size}
      fullScreen={modalFullScreen}
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <CustomLoadingOverlay visible={loading} pos={'absolute'} />

      {opened && (
        <Stack mb={70} px={'sm'}>
          {isValidElement(children) && formRef
            ? cloneElement(
                children as ReactElement<any> & { ref?: React.Ref<any> },
                {
                  ref: formRef,
                  handleAction,
                }
              )
            : children}
        </Stack>
      )}

      <Stack
        w={'100%'}
        bg={'white'}
        pos={'fixed'}
        bottom={0}
        right={0}
        align={'end'}
        p={15}
        sx={{ zIndex: 1001 }}
      >
        <Group>
          <Button
            type={'button'}
            color={color ?? 'var(--mantine-color-primary-9)'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            leftSection={dynamicButtonIcon(actionType)}
            loading={loading}
            loaderProps={{ type: 'dots' }}
            onClick={() =>
              requiresPayload && formRef?.current
                ? formRef?.current.requestSubmit()
                : handleAction()
            }
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
