import {
  Box,
  Button,
  Group,
  Menu,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import PurchaseRequestContentClient from './CreateUpdateContent/PurchaseRequestContent';
import {
  IconActivity,
  IconHandFinger,
  IconPencil,
  IconPrinter,
  IconX,
} from '@tabler/icons-react';
import PurchaseRequestStatusClient from '@/components/PurchaseRequests/Status';
import PurchaseRequestActionsClient from '@/components/PurchaseRequests/Actions';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import ActionModalClient from './ActionModal';
import RequestQuotionContentClient from './CreateUpdateContent/RequestQuotionContent';
import RequestQuotationStatusClient from '@/components/RequestQuotations/Status';
import RequestQuotationActionsClient from '@/components/RequestQuotations/Actions';

const DetailActionsClient = ({
  permissions,
  data,
  content,
  hasStatus,
  status,
  stack,
  updateTable,
}: DetailActionProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [
    actionModalOpened,
    { open: openActionModal, close: closeActionModal },
  ] = useDisclosure(false);
  const [actionType, setActionType] = useState<ActionType>();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('var(--mantine-color-primary-9)');
  const [buttonLabel, setButtonLabel] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [currentStatus, setCurrentStatus] = useState(status);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const handleOpenActionModal = (
    actionType: ActionType,
    title: string,
    message: string,
    color: string,
    buttonLabel: string,
    endpoint: string
  ) => {
    setActionType(actionType);
    setTitle(title);
    setMessage(message);
    setColor(color);
    setButtonLabel(buttonLabel);
    setEndpoint(endpoint);

    openActionModal();
  };

  const dynamicStatus = (content?: ModuleType) => {
    switch (content) {
      case 'pr':
        return (
          <PurchaseRequestStatusClient
            size={lgScreenAndBelow ? 'sm' : 'lg'}
            status={(currentStatus as PurchaseRequestStatus) ?? ''}
          />
        );
      case 'rfq':
        return (
          <RequestQuotationStatusClient
            size={lgScreenAndBelow ? 'sm' : 'lg'}
            status={(currentStatus as RequestQuotationStatus) ?? ''}
          />
        );
      default:
        return <>-</>;
    }
  };

  const dynamicActions = (content?: ModuleType) => {
    return (
      <Menu offset={6} shadow={'md'} width={300} withArrow>
        <Menu.Target>
          <Button
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            color={'var(--mantine-color-secondary-9)'}
            rightSection={<IconHandFinger size={18} stroke={1.5} />}
          >
            Actions
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Actions</Menu.Label>
          {content === 'pr' && (
            <PurchaseRequestActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              status={data?.status}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'rfq' && (
            <RequestQuotationActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              status={data?.status}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          <Menu.Divider />

          <Menu.Label>Activity</Menu.Label>
          <Menu.Item
            leftSection={<IconActivity size={18} stroke={1.5} />}
            onClick={() => {
              stack.close('detail-modal');
              stack.open('log-modal');
            }}
          >
            Document Logs
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  return (
    <Paper w={'100%'} py={'sm'} px={'lg'} shadow={'sm'}>
      <Group justify={'space-between'}>
        {hasStatus ? (
          <Group>
            <Text
              size={lgScreenAndBelow ? 'sm' : 'md'}
              fw={700}
              tt={'uppercase'}
            >
              Status:
            </Text>
            {dynamicStatus(content)}
          </Group>
        ) : (
          <Box></Box>
        )}

        <Stack>
          {dynamicActions(content)}

          <ActionModalClient
            title={title}
            message={message}
            color={color}
            actionType={actionType}
            buttonLabel={buttonLabel}
            endpoint={endpoint}
            opened={actionModalOpened}
            close={closeActionModal}
            stack={stack}
            updateTable={updateTable}
          />
        </Stack>
      </Group>
    </Paper>
  );
};

const DetailModalClient = ({
  user,
  permissions,
  title,
  data,
  opened,
  content,
  close,
  stack,
  updateTable,
  showPrint,
  showEdit,
}: DetailModalProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [currentData, setCurrentData] = useState(data);
  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    let isEditable = true;

    switch (content) {
      case 'pr':
        isEditable = [
          'draft',
          'disapproved',
          'pending',
          'approved_cash_available',
          'approved',
        ].includes(currentData?.status ?? '');

        if (
          showEdit &&
          isEditable &&
          !['super:*', 'supply:*'].some((permission) =>
            permissions?.includes(permission)
          ) &&
          user?.id !== data?.requested_by_id
        ) {
          setShowEditButton(false);
        } else {
          setShowEditButton(isEditable);
        }
        break;

      case 'rfq':
        isEditable = ['draft', 'canvassing'].includes(
          currentData?.status ?? ''
        );

        if (showEdit && isEditable) {
          setShowEditButton(true);
        } else {
          setShowEditButton(false);
        }
        break;

      default:
        setShowEditButton(true);
        break;
    }
  }, [content, currentData]);

  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={close}
      title={title ?? 'Details'}
      size={'md'}
      fullScreen={true}
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <Stack
        w={'100%'}
        bg={'white'}
        pos={'fixed'}
        top={50}
        left={0}
        p={15}
        align={'end'}
        sx={{ zIndex: 100 }}
      >
        <DetailActionsClient
          permissions={permissions ?? []}
          data={currentData}
          content={content}
          status={data?.status ?? ''}
          stack={stack}
          updateTable={updateTable}
          hasStatus
        />
      </Stack>

      <Stack p={'md'} my={70}>
        <Paper shadow={'lg'} p={0}>
          {opened && content === 'pr' && (
            <PurchaseRequestContentClient data={currentData} readOnly />
          )}

          {opened && content === 'rfq' && (
            <RequestQuotionContentClient data={currentData} readOnly />
          )}
        </Paper>
      </Stack>

      <Stack
        w={'100%'}
        bg={'white'}
        pos={'fixed'}
        bottom={0}
        left={0}
        align={'end'}
        p={15}
        sx={{ zIndex: 100 }}
      >
        <Group>
          {showPrint && (
            <Button
              type={'button'}
              color={'var(--mantine-color-primary-9)'}
              size={lgScreenAndBelow ? 'xs' : 'sm'}
              leftSection={<IconPrinter size={18} />}
              onClick={() => {
                stack.close('detail-modal');
                stack.open('print-modal');
              }}
            >
              Print
            </Button>
          )}

          {showEditButton && (
            <Button
              variant={'outline'}
              type={'button'}
              color={'var(--mantine-color-primary-9)'}
              size={lgScreenAndBelow ? 'xs' : 'sm'}
              leftSection={<IconPencil size={18} />}
              onClick={() => {
                stack.close('detail-modal');
                stack.open('update-modal');
              }}
            >
              Edit
            </Button>
          )}

          <Button
            variant={'outline'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
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

export default DetailModalClient;
