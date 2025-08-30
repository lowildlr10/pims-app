'use client';

import {
  ActionIcon,
  Box,
  Button,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import {
  IconActivity,
  IconLibrary,
  IconPencil,
  IconPrinter,
  IconX,
} from '@tabler/icons-react';
import PurchaseRequestFormClient from '../../../PurchaseRequests/Form';
import PurchaseRequestStatusClient from '@/components/PurchaseRequests/Status';
import PurchaseRequestActionsClient from '@/components/PurchaseRequests/Actions';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import ActionModalClient from '../../Modal/ActionModal';
import RequestQuotionFormClient from '../../../RequestQuotations/Form';
import RequestQuotationStatusClient from '@/components/RequestQuotations/Status';
import RequestQuotationActionsClient from '@/components/RequestQuotations/Actions';
import AbstractQuotationStatusClient from '@/components/AbstractQuotations/Status';
import AbstractQuotationActionsClient from '@/components/AbstractQuotations/Actions';
import PurchaseOrderStatusClient from '@/components/PurchaseOrders/Status';
import PurchaseOrderActionsClient from '@/components/PurchaseOrders/Actions';
import AbstractQuotionFormClient from '../../../AbstractQuotations/Form';
import PurchaseOrderFormClient from '@/components/PurchaseOrders/Form';
import InspectionAcceptanceReportFormClient from '@/components/InspectionAcceptanceReports/Form';
import InspectionAcceptanceReportActionsClient from '@/components/InspectionAcceptanceReports/Actions';
import InspectionAcceptanceReportStatusClient from '@/components/InspectionAcceptanceReports/Status';
import ObligationRequestFormClient from '@/components/ObligationRequests/Form';
import ObligationRequestActionsClient from '@/components/ObligationRequests/Actions';
import ObligationRequestStatusClient from '@/components/ObligationRequests/Status';
import DisbursementVoucherFormClient from '@/components/DisbursementVouchers/Form';
import DisbursementVoucherActionsClient from '@/components/DisbursementVouchers/Actions';
import DisbursementVoucherStatusClient from '@/components/DisbursementVouchers/Status';
import InventorySupplyFormClient from '@/components/InventorySupplies/Form';
import InventorySupplyStatusClient from '@/components/InventorySupplies/Status';
import InventorySupplyActionsClient from '@/components/InventorySupplies/Actions';
import RisFormClient from '../../../InventoryIssuances/Forms/RisForm';
import IcsFormClient from '../../../InventoryIssuances/Forms/IcsForm';
import AreFormClient from '../../../InventoryIssuances/Forms/AreForm';
import InventoryIssuanceStatusClient from '@/components/InventoryIssuances/Status';
import InventoryIssuanceActionsClient from '@/components/InventoryIssuances/Actions';
import { usePathname, useRouter } from 'next/navigation';
import API from '@/libs/API';
import { API_REFRESH_INTERVAL } from '@/config/intervals';
import useSWR from 'swr';
import PrintModalClient from '../../Modal/PrintModal';
import LogModalClient from '../../Modal/LogModal';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import CustomLoadingOverlay from '../../CustomLoadingOverlay';
import Helper from '@/utils/Helpers';
import FullScreenSkeletonLoaderClient from '../../FullScreenSkeletonLoader';

export const DetailActionsClient = ({
  permissions,
  data,
  content,
  hasStatus,
  showButtonLabel = true,
  buttonSize,
  buttonIconSize,
  display = 'bar',
  status,
  openLogModal,
  updateTable,
}: DetailActionProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
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
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  const [fullScreen, setFullScreen] = useState<boolean>();
  const [requiresPayload, setRequiresPayload] = useState<boolean>();
  const [currentStatus, setCurrentStatus] = useState(status);

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
      case 'obr':
        return (
          <ObligationRequestStatusClient
            size={lgScreenAndBelow ? 'sm' : 'lg'}
            status={(currentStatus as ObligationRequestStatus) ?? ''}
          />
        );
      case 'dv':
        return (
          <DisbursementVoucherStatusClient
            size={lgScreenAndBelow ? 'sm' : 'lg'}
            status={(currentStatus as DisbursementVoucherStatus) ?? ''}
          />
        );
      case 'inv-supply':
        return (
          <InventorySupplyStatusClient
            size={lgScreenAndBelow ? 'sm' : 'lg'}
            status={(currentStatus as InventorySupplyStatus) ?? ''}
          />
        );
      case 'inv-issuance':
        return (
          <InventoryIssuanceStatusClient
            size={lgScreenAndBelow ? 'sm' : 'lg'}
            status={(currentStatus as InventoryIssuanceStatus) ?? ''}
          />
        );
      default:
        return <>-</>;
    }
  };

  const dynamicActions = (content?: ModuleType) => {
    return (
      <Menu offset={6} shadow={'md'} width={400} withArrow>
        <Menu.Target>
          {showButtonLabel ? (
            <Button
              size={buttonSize ?? (lgScreenAndBelow ? 'xs' : 'sm')}
              color={'var(--mantine-color-secondary-9)'}
              rightSection={<IconLibrary size={lgScreenAndBelow ? 14 : 18} />}
            >
              Actions
            </Button>
          ) : (
            <ActionIcon
              size={buttonSize ?? (lgScreenAndBelow ? 'xs' : 'sm')}
              color={'var(--mantine-color-secondary-9)'}
            >
              <IconLibrary
                size={buttonIconSize ?? (lgScreenAndBelow ? 14 : 18)}
              />
            </ActionIcon>
          )}
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Actions</Menu.Label>
          {content === 'pr' && (
            <PurchaseRequestActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              status={data?.status ?? 'draft'}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'rfq' && (
            <RequestQuotationActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              status={data?.status ?? 'draft'}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'aoq' && (
            <AbstractQuotationActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              status={data?.status ?? 'draft'}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'po' && (
            <PurchaseOrderActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              status={data?.status ?? 'draft'}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'iar' && (
            <InspectionAcceptanceReportActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              poId={data?.purchase_order?.id ?? ''}
              status={data?.status ?? 'draft'}
              documentType={data?.purchase_order?.document_type ?? 'po'}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'obr' && (
            <ObligationRequestActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              poId={data?.purchase_order_id ?? ''}
              status={data?.status ?? 'draft'}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'dv' && (
            <DisbursementVoucherActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              poId={data?.purchase_order_id ?? ''}
              status={data?.status ?? 'draft'}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'inv-supply' && (
            <InventorySupplyActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              status={data?.status ?? 'out-of-stock'}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {content === 'inv-issuance' && (
            <InventoryIssuanceActionsClient
              permissions={permissions ?? []}
              id={data?.id ?? ''}
              status={data?.status ?? 'draft'}
              handleOpenActionModal={handleOpenActionModal}
            />
          )}

          {display === 'bar' && (
            <>
              <Menu.Divider />

              <Menu.Label>Activity</Menu.Label>
              <Menu.Item
                leftSection={<IconActivity size={18} stroke={1.5} />}
                onClick={openLogModal}
              >
                Audit Logs
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    );
  };

  return (
    <>
      {display === 'bar' && (
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
                updateTable={updateTable}
                requiresPayload={requiresPayload}
              >
                {children}
              </ActionModalClient>
            </Stack>
          </Group>
        </Paper>
      )}

      {display === 'button' && (
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
            updateTable={updateTable}
            requiresPayload={requiresPayload}
          >
            {children}
          </ActionModalClient>
        </Stack>
      )}
    </>
  );
};

const DetailClient = ({
  permissions,
  content,
  endpoint,
  printConfig,
  logConfig,
  backUrl,
}: DetailProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [pageLoading, setPageLoading] = useState(false);
  const [currentData, setCurrentData] = useState<FormDataType>();
  const [showPrintButton, setShowPrintButton] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);
  const [printModalOpened, { open: openPrintModal, close: closePrintModal }] =
    useDisclosure(false);
  const [logModalOpened, { open: openLogModal, close: closeLogModal }] =
    useDisclosure(false);
  const [printEndpoint, setPrintEndpoint] = useState(
    printConfig?.endpoint ?? ''
  );

  const {
    data,
    isLoading: detailLoading,
    mutate: refreshDetail,
  } = useSWR<DetailResponse>(
    [endpoint ?? null],
    ([url]: GeneralResponse) => API.get(url),
    {
      refreshInterval: API_REFRESH_INTERVAL,
      refreshWhenHidden: true,
      keepPreviousData: false,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    setCurrentData(data?.data?.data);
  }, [data]);

  useEffect(() => {
    setPrintEndpoint(printConfig?.endpoint ?? '');
  }, [printConfig?.endpoint]);

  const handleClose = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const status = currentData?.status;
    let hasPrintPermission = false;
    let hasEditPermission = false;

    switch (content) {
      case 'pr':
        hasPrintPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'print'),
        ].some((permission) => permissions?.includes(permission));
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setShowPrintButton(status !== 'cancelled' && hasPrintPermission);

        setShowEditButton(
          [
            'draft',
            'disapproved',
            'pending',
            'approved_cash_available',
            'approved',
          ].includes(status ?? '') && hasEditPermission
        );
        break;

      case 'rfq':
        hasPrintPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'print'),
        ].some((permission) => permissions?.includes(permission));
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setShowPrintButton(status !== 'cancelled' && hasPrintPermission);

        setShowEditButton(
          ['draft', 'canvassing', 'completed'].includes(status ?? '') &&
            hasEditPermission
        );
        break;

      case 'aoq':
        hasPrintPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'print'),
        ].some((permission) => permissions?.includes(permission));
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setShowPrintButton(status !== 'cancelled' && hasPrintPermission);

        setShowEditButton(
          ['draft', 'pending', 'approved'].includes(status ?? '') &&
            hasEditPermission
        );
        break;

      case 'po':
        hasPrintPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'print'),
        ].some((permission) => permissions?.includes(permission));
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setShowPrintButton(hasPrintPermission);

        setShowEditButton(
          ['draft', 'pending', 'approved'].includes(status ?? '') &&
            hasEditPermission
        );
        break;

      case 'iar':
        hasPrintPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'print'),
        ].some((permission) => permissions?.includes(permission));
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setShowPrintButton(hasPrintPermission);

        setShowEditButton(hasEditPermission);
        break;

      case 'obr':
        hasPrintPermission = [
          'budget:*',
          ...getAllowedPermissions(content, 'print'),
        ].some((permission) => permissions?.includes(permission));
        hasEditPermission = [
          'budget:*',
          ...getAllowedPermissions(content, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setShowPrintButton(hasPrintPermission);

        setShowEditButton(
          ['draft', 'pending', 'disapproved'].includes(status ?? '') &&
            hasEditPermission
        );
        break;

      case 'dv':
        hasPrintPermission = [
          'accountant:*',
          ...getAllowedPermissions(content, 'print'),
        ].some((permission) => permissions?.includes(permission));
        hasEditPermission = [
          'accountant:*',
          ...getAllowedPermissions(content, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setShowPrintButton(hasPrintPermission);

        setShowEditButton(
          ['draft', 'pending', 'disapproved'].includes(status ?? '') &&
            hasEditPermission
        );
        break;

      case 'inv-supply':
        hasPrintPermission = false;
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setShowPrintButton(hasPrintPermission);

        setShowEditButton(hasEditPermission);
        break;

      case 'inv-issuance':
        hasPrintPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'print'),
        ].some((permission) => permissions?.includes(permission));
        hasEditPermission = [
          'supply:*',
          ...getAllowedPermissions(content, 'update'),
        ].some((permission) => permissions?.includes(permission));

        setShowPrintButton(status !== 'cancelled' && hasPrintPermission);

        setShowEditButton(
          ['draft', 'pending', 'approved'].includes(status ?? '') &&
            hasEditPermission
        );

        setPrintEndpoint(
          `/documents/${currentData?.document_type || 'ris'}/prints/${currentData?.id}`
        );
        break;

      default:
        break;
    }
  }, [currentData, status]);

  return (
    <Stack>
      <CustomLoadingOverlay
        visible={detailLoading || pageLoading || Helper.empty(currentData)}
      />

      <Stack
        w={'100%'}
        bg={'white'}
        align={'end'}
        pos={'sticky'}
        top={lgScreenAndBelow ? 50 : 60}
        sx={{ zIndex: 5 }}
      >
        <DetailActionsClient
          permissions={permissions ?? []}
          data={currentData}
          content={content}
          status={currentData?.status ?? ''}
          openLogModal={openLogModal}
          updateTable={() => refreshDetail()}
          hasStatus
        />
      </Stack>

      <Stack mb={100}>
        <Paper shadow={'lg'} p={0}>
          {Helper.empty(currentData) && <FullScreenSkeletonLoaderClient />}

          {currentData && content === 'pr' && (
            <PurchaseRequestFormClient data={currentData} readOnly />
          )}

          {currentData && content === 'rfq' && (
            <RequestQuotionFormClient data={currentData} readOnly />
          )}

          {currentData && content === 'aoq' && (
            <AbstractQuotionFormClient
              data={currentData}
              refreshData={refreshDetail}
              readOnly
            />
          )}

          {currentData && content === 'po' && (
            <PurchaseOrderFormClient data={currentData} readOnly />
          )}

          {currentData && content === 'iar' && (
            <InspectionAcceptanceReportFormClient data={currentData} readOnly />
          )}

          {currentData && content === 'obr' && (
            <ObligationRequestFormClient data={currentData} readOnly />
          )}

          {currentData && content === 'dv' && (
            <DisbursementVoucherFormClient data={currentData} readOnly />
          )}

          {currentData && content === 'inv-supply' && (
            <InventorySupplyFormClient data={currentData} readOnly />
          )}

          {currentData && content === 'inv-issuance' && (
            <>
              {currentData?.document_type === 'ris' && (
                <RisFormClient data={currentData} readOnly />
              )}

              {currentData?.document_type === 'ics' && (
                <IcsFormClient data={currentData} readOnly />
              )}

              {currentData?.document_type === 'are' && (
                <AreFormClient data={currentData} readOnly />
              )}
            </>
          )}
        </Paper>
      </Stack>

      <PrintModalClient
        title={printConfig?.title ?? 'Print'}
        endpoint={printEndpoint}
        defaultPaper={printConfig?.default_paper ?? 'A4'}
        defaultOrientation={printConfig?.default_orientation}
        opened={printModalOpened}
        close={closePrintModal}
      />

      <LogModalClient
        id={logConfig?.id ?? currentData?.id ?? ''}
        title={logConfig?.title ?? 'Audit Logs'}
        endpoint={logConfig?.endpoint ?? ''}
        opened={logModalOpened}
        close={closeLogModal}
      />

      <Stack
        w={'100%'}
        bg={'white'}
        pos={'fixed'}
        bottom={0}
        left={0}
        align={'end'}
        p={15}
        sx={{ zIndex: 1 }}
      >
        <Group>
          {showPrintButton && (
            <Button
              type={'button'}
              color={'var(--mantine-color-primary-9)'}
              size={lgScreenAndBelow ? 'xs' : 'sm'}
              leftSection={<IconPrinter size={18} />}
              onClick={openPrintModal}
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
              loading={pageLoading}
              loaderProps={{
                type: 'dots',
              }}
              onClick={(e) => {
                setPageLoading(true);
                e.preventDefault();
                router.push(`${pathname}/update`);
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
            loading={pageLoading}
            loaderProps={{
              type: 'dots',
            }}
            onClick={(e) => {
              setPageLoading(true);
              e.preventDefault();
              handleClose();
            }}
          >
            Close
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
};

export default DetailClient;
