'use client';

import { Button, Group, LoadingOverlay, Paper, Stack } from '@mantine/core';
import React, { useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { getErrors } from '@/libs/Errors';
import { IconCancel, IconPencilPlus } from '@tabler/icons-react';
import PurchaseRequestFormClient from '../../../PurchaseRequests/Form';
import { useMediaQuery } from '@mantine/hooks';
import RequestQuotionFormClient from '../../../RequestQuotations/Form';
import RisFormClient from '../../../InventoryIssuances/Forms/RisForm';
import IcsFormClient from '../../../InventoryIssuances/Forms/IcsForm';
import AreFormClient from '../../../InventoryIssuances/Forms/AreForm';
import Helper from '@/utils/Helpers';

const CreateClient = ({ data, endpoint, content, backUrl }: CreateProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<object>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleClose = (id?: string) => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      if (!Helper.empty(id)) {
        const redirectPath = pathname.replace('/create', '') + `?search=${id}`;
        router.push(redirectPath);
      } else {
        router.back();
      }
    }
  };

  const handleCreate = (uncontrolledPayload?: object) => {
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

    API.post(endpoint, uncontrolledPayload ?? payload)
      .then((res) => {
        const response: FormDataType = res?.data?.data;

        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });

        setPayload({});
        handleClose(response?.id);
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
      <LoadingOverlay
        visible={loading || pageLoading}
        zIndex={1010}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <Stack mb={100}>
        <Paper shadow={'lg'} p={0}>
          {content === 'pr' && (
            <PurchaseRequestFormClient
              ref={formRef}
              data={data}
              handleCreateUpdate={handleCreate}
            />
          )}

          {content === 'rfq' && (
            <RequestQuotionFormClient
              ref={formRef}
              data={data}
              handleCreateUpdate={handleCreate}
              isCreate
            />
          )}

          {content === 'inv-issuance' && (
            <>
              {data?.document_type === 'ris' && (
                <RisFormClient
                  ref={formRef}
                  data={data}
                  handleCreateUpdate={handleCreate}
                  isCreate
                />
              )}

              {data?.document_type === 'ics' && (
                <IcsFormClient
                  ref={formRef}
                  data={data}
                  handleCreateUpdate={handleCreate}
                  isCreate
                />
              )}

              {data?.document_type === 'are' && (
                <AreFormClient
                  ref={formRef}
                  data={data}
                  handleCreateUpdate={handleCreate}
                  isCreate
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
        sx={{ zIndex: 1 }}
      >
        <Group>
          <Button
            onClick={() =>
              formRef?.current ? formRef?.current.requestSubmit() : undefined
            }
            type={'button'}
            color={'var(--mantine-color-primary-9)'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            leftSection={<IconPencilPlus size={18} />}
            loading={loading}
            loaderProps={{ type: 'dots' }}
          >
            Create
          </Button>
          <Button
            variant={'outline'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            color={'var(--mantine-color-gray-8)'}
            leftSection={<IconCancel size={18} />}
            loading={pageLoading}
            loaderProps={{ type: 'dots' }}
            onClick={(e) => {
              setPageLoading(true);
              e.preventDefault();
              handleClose();
            }}
          >
            Cancel
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
};

export default CreateClient;
