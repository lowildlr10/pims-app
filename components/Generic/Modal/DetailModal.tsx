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
import React, { useEffect, useRef, useState } from 'react';
import PurchaseRequestContentClient from '../../PurchaseRequests/Form';
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
import RequestQuotionContentClient from '../../RequestQuotations/Form';
import RequestQuotationStatusClient from '@/components/RequestQuotations/Status';
import RequestQuotationActionsClient from '@/components/RequestQuotations/Actions';
import AbstractQuotationStatusClient from '@/components/AbstractQuotations/Status';
import AbstractQuotationActionsClient from '@/components/AbstractQuotations/Actions';
import PurchaseOrderStatusClient from '@/components/PurchaseOrders/Status';
import PurchaseOrderActionsClient from '@/components/PurchaseOrders/Actions';
import AbstractQuotionContentClient from '../../AbstractQuotations/Form';
import PurchaseOrderContentClient from '@/components/PurchaseOrders/Form';
import InspectionAcceptanceReportContentClient from '@/components/InspectionAcceptanceReports/Form';
import InspectionAcceptanceReportActionsClient from '@/components/InspectionAcceptanceReports/Actions';
import InspectionAcceptanceReportStatusClient from '@/components/InspectionAcceptanceReports/Status';

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
  const [children, setChildren] = useState<React.ReactNode>();
  const [color, setColor] = useState('var(--mantine-color-primary-9)');
  const [buttonLabel, setButtonLabel] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [redirect, setRedirect] = useState<string>();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  const [fullScreen, setFullScreen] = useState<boolean>();
  const [requiresPayload, setRequiresPayload] = useState<boolean>();

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const handleOpenActionModal = (
    actionType: ActionType,
    title: string,
    children: React.ReactNode,
    color: string,
    buttonLabel: string,
    endpoint: string,
    redirect?: string,
    requiresPayload?: boolean,
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    fullScreen?: boolean
  ) => {
    setActionType(actionType);
    setTitle(title);
    setChildren(children);
    setColor(color);
    setButtonLabel(buttonLabel);
    setEndpoint(endpoint);
    setRedirect(redirect);
    setRequiresPayload(requiresPayload);
    setSize(size);
    setFullScreen(fullScreen);

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
      case 'aoq':
        return (
          <AbstractQuotationStatusClient
            size={lgScreenAndBelow ? 'sm' : 'lg'}
            status={(currentStatus as AbstractQuotationStatus) ?? ''}
          />
        );
      case 'po':
        return (
          <PurchaseOrderStatusClient
            size={lgScreenAndBelow ? 'sm' : 'lg'}
            status={(currentStatus as PurchaseOrderStatus) ?? ''}
          />
        );
      case 'iar':
        return (
          <InspectionAcceptanceReportStatusClient
            size={lgScreenAndBelow ? 'sm' : 'lg'}
            status={(currentStatus as InspectionAcceptanceReportStatus) ?? ''}
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
            rightSection={<IconHandFinger size={18} />}
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

          {content === 'aoq' && (
            <AbstractQuotationActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              status={data?.status}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'po' && (
            <PurchaseOrderActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              status={data?.status}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'iar' && (
            <InspectionAcceptanceReportActionsClient
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
            color={color}
            actionType={actionType}
            buttonLabel={buttonLabel}
            endpoint={endpoint}
            redirect={redirect}
            size={size}
            fullScreen={fullScreen}
            opened={actionModalOpened}
            close={closeActionModal}
            stack={stack}
            updateTable={updateTable}
            requiresPayload={requiresPayload}
          >
            {children}
          </ActionModalClient>
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
        isEditable = ['draft', 'canvassing', 'completed'].includes(
          currentData?.status ?? ''
        );

        if (showEdit && isEditable) {
          setShowEditButton(true);
        } else {
          setShowEditButton(false);
        }
        break;

      case 'aoq':
        isEditable = ['draft', 'pending'].includes(currentData?.status ?? '');

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
      {opened && (
        <Stack
          w={'100%'}
          bg={'white'}
          pos={'fixed'}
          top={50}
          left={0}
          p={15}
          align={'end'}
          sx={{ zIndex: 1001 }}
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
      )}

      <Stack p={'md'} my={70}>
        <Paper shadow={'lg'} p={0}>
          {opened && content === 'pr' && (
            <PurchaseRequestContentClient data={currentData} readOnly />
          )}

          {opened && content === 'rfq' && (
            <RequestQuotionContentClient data={currentData} readOnly />
          )}

          {opened && content === 'aoq' && (
            <AbstractQuotionContentClient data={currentData} readOnly />
          )}

          {opened && content === 'po' && (
            <PurchaseOrderContentClient data={currentData} readOnly />
          )}

          {opened && content === 'iar' && (
            <InspectionAcceptanceReportContentClient
              data={currentData}
              readOnly
            />
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
        sx={{ zIndex: 1001 }}
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
