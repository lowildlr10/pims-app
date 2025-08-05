'use client';

import { Button, Group, Paper, Stack } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { getErrors } from '@/libs/Errors';
import { IconCancel, IconPencil, IconX } from '@tabler/icons-react';
import PurchaseRequestFormClient from '../../../PurchaseRequests/Form';
import { useMediaQuery } from '@mantine/hooks';
import RequestQuotionFormClient from '../../../RequestQuotations/Form';
import AbstractQuotionFormClient from '../../../AbstractQuotations/Form';
import PurchaseOrderFormClient from '@/components/PurchaseOrders/Form';
import InspectionAcceptanceReportFormClient from '@/components/InspectionAcceptanceReports/Form';
import InventorySupplyFormClient from '@/components/InventorySupplies/Form';
import RisFormClient from '../../../InventoryIssuances/Forms/RisForm';
import IcsFormClient from '../../../InventoryIssuances/Forms/IcsForm';
import AreFormClient from '../../../InventoryIssuances/Forms/AreForm';
import { usePathname, useRouter } from 'next/navigation';
import Helper from '@/utils/Helpers';
import useSWR from 'swr';
import { API_REFRESH_INTERVAL } from '@/config/intervals';
import CustomLoadingOverlay from '../../CustomLoadingOverlay';

const UpdateClient = ({
  content,
  endpoint,
  backUrl,
  closeUrl,
}: UpdateProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [currentData, setCurrentData] = useState<FormDataType>({});
  const [payload, setPayload] = useState<object>({});
  const formRef = useRef<HTMLFormElement>(null);

  const {
    data,
    isLoading: dataLoading,
    mutate: refreshData,
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

  const handleCancel = (id?: string) => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      if (!Helper.empty(id)) {
        const redirectPath = pathname.replace('/update', '');
        router.push(redirectPath);
      } else {
        router.back();
      }
    }
  };

  const handleClose = (id?: string) => {
    if (closeUrl) {
      router.push(closeUrl);
    } else {
      if (!Helper.empty(id)) {
        const redirectPath = pathname.replace('/', '');
        router.push(redirectPath);
      } else {
        router.back();
      }
    }
  };

  const handleUpdate = (uncontrolledPayload?: object) => {
    let isControlled = true;

    setLoading(true);

    if (!uncontrolledPayload) {
      isControlled = true;
    } else {
      isControlled = false;
    }

    if (!payload && isControlled) {
      setLoading(false);
      return;
    }

    if (!uncontrolledPayload && !isControlled) {
      setLoading(false);
      return;
    }

    API.put(endpoint, uncontrolledPayload ?? payload)
      .then((res) => {
        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });

        setPayload({});
        handleCancel();
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

  return (
    <Stack>
      <CustomLoadingOverlay visible={loading || dataLoading || pageLoading} />

      <Stack mb={100}>
        <Paper shadow={'lg'} p={0}>
          {content === 'pr' && (
            <PurchaseRequestFormClient
              ref={formRef}
              data={currentData}
              handleCreateUpdate={handleUpdate}
            />
          )}

          {content === 'rfq' && (
            <RequestQuotionFormClient
              ref={formRef}
              data={currentData}
              handleCreateUpdate={handleUpdate}
            />
          )}

          {content === 'aoq' && (
            <AbstractQuotionFormClient
              ref={formRef}
              data={currentData}
              handleCreateUpdate={handleUpdate}
            />
          )}

          {content === 'po' && (
            <PurchaseOrderFormClient
              ref={formRef}
              data={currentData}
              handleCreateUpdate={handleUpdate}
            />
          )}

          {content === 'iar' && (
            <InspectionAcceptanceReportFormClient
              ref={formRef}
              data={currentData}
              handleCreateUpdate={handleUpdate}
            />
          )}

          {content === 'inv-supply' && (
            <InventorySupplyFormClient
              ref={formRef}
              data={currentData}
              handleCreateUpdate={handleUpdate}
            />
          )}

          {content === 'inv-issuance' && (
            <>
              {currentData?.document_type === 'ris' && (
                <RisFormClient
                  ref={formRef}
                  data={currentData}
                  handleCreateUpdate={handleUpdate}
                />
              )}

              {currentData?.document_type === 'ics' && (
                <IcsFormClient
                  ref={formRef}
                  data={currentData}
                  handleCreateUpdate={handleUpdate}
                />
              )}

              {currentData?.document_type === 'are' && (
                <AreFormClient
                  ref={formRef}
                  data={currentData}
                  handleCreateUpdate={handleUpdate}
                />
              )}
            </>
          )}
        </Paper>
      </Stack>

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
            onClick={() =>
              formRef?.current ? formRef?.current.requestSubmit() : undefined
            }
            type={'button'}
            color={'var(--mantine-color-primary-9)'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            leftSection={<IconPencil size={18} />}
            loading={loading}
            loaderProps={{ type: 'dots' }}
          >
            Update
          </Button>
          <Button
            variant={'outline'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            color={'var(--mantine-color-gray-8)'}
            leftSection={<IconCancel size={18} />}
            loading={pageLoading}
            loaderProps={{
              type: 'dots',
            }}
            onClick={(e) => {
              setPageLoading(true);
              e.preventDefault();
              handleCancel();
            }}
          >
            Cancel
          </Button>
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

export default UpdateClient;
