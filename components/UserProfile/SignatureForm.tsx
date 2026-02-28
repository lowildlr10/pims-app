import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import { Button, Group, Paper, Stack, Switch, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSignature, IconUpload } from '@tabler/icons-react';
import React, { useState } from 'react';
import SingleImageUploadClient from '../Generic/SingleImageUpload';
import { useMediaAsset } from '@/hooks/useMediaAsset';
import CustomLoadingOverlay from '../Generic/CustomLoadingOverlay';

const SignatureFormClient = ({ user }: SignatureFormProps) => {
  const {
    media: signature,
    loading: signatureLoading,
    clearCache: clearSignatureCache,
  } = useMediaAsset({
    type: 'signature',
    user,
  });

  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      allow_signature: user.allow_signature ?? false,
    },
  });

  const handleUpdateSignature = () => {
    setLoading(true);

    API.put(`/accounts/users/${user.id}`, {
      ...form.values,
      update_type: 'allow_signature',
    })
      .then((res) => {
        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });
        form.resetDirty();
        setLoading(false);
      })
      .catch((err) => {
        const errors = getErrors(err);

        errors.forEach((error) => {
          notify({
            title: 'Failed!',
            message: error,
            color: 'red',
          });
        });

        setLoading(false);
      });
  };

  return (
    <form onSubmit={form.onSubmit(() => handleUpdateSignature())}>
      <CustomLoadingOverlay visible={loading || signatureLoading} />
      <Stack gap='lg'>
        <Paper
          p='xl'
          radius='md'
          withBorder
          style={{
            borderStyle: 'dashed',
            borderColor: 'var(--mantine-color-gray-4)',
            backgroundColor: 'var(--mantine-color-gray-0)',
          }}
        >
          <Stack align='center' gap='md'>
            <IconSignature
              size={48}
              stroke={1.5}
              color='var(--mantine-color-gray-5)'
            />
            <Text size='sm' c='dimmed' ta='center'>
              Upload your signature image
            </Text>
            <SingleImageUploadClient
              image={signature ?? ''}
              postUrl={'/media'}
              params={{ type: 'signature', parent_id: user.id }}
              type={'signature'}
              clearImageCache={clearSignatureCache}
            />
          </Stack>
        </Paper>

        <Paper p='md' radius='md' withBorder>
          <Stack gap='md'>
            <Switch
              label='Enable Signature'
              description='Once enabled, it will appear on required forms and documents'
              color='var(--mantine-color-primary-9)'
              size='md'
              onLabel='YES'
              offLabel='NO'
              checked={form.values.allow_signature}
              onChange={(event) =>
                form.setFieldValue(
                  'allow_signature',
                  event.currentTarget.checked
                )
              }
              styles={{
                root: {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            />

            <Button
              loading={loading}
              loaderProps={{ type: 'dots' }}
              size='sm'
              type='submit'
              color='var(--mantine-color-primary-9)'
              leftSection={<IconUpload size={16} />}
              fullWidth
            >
              Save Settings
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </form>
  );
};

export default SignatureFormClient;
