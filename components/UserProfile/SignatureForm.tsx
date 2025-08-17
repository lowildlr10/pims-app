import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import { Button, Paper, Stack, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPencil } from '@tabler/icons-react';
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
      <Stack justify={'flex-start'} gap={'xl'} px={'xl'}>
        <Paper>
          <SingleImageUploadClient
            image={signature ?? ''}
            postUrl={'/media'}
            params={{ type: 'signature', parent_id: user.id }}
            type={'signature'}
            clearImageCache={clearSignatureCache}
          />
        </Paper>

        <Paper p={'md'}>
          <Switch
            label={'Enable signature?'}
            description={
              'Once enabled, it will appear on the required forms and documents.'
            }
            color={'var(--mantine-color-primary-9)'}
            size='md'
            mb={80}
            onLabel='YES'
            offLabel='NO'
            checked={form.values.allow_signature}
            onChange={(event) =>
              form.setFieldValue('allow_signature', event.currentTarget.checked)
            }
          />

          <Button
            loading={loading}
            loaderProps={{ type: 'dots' }}
            size={'md'}
            type={'submit'}
            color={'var(--mantine-color-primary-9)'}
            leftSection={<IconPencil size={18} />}
            fullWidth
          >
            Save
          </Button>
        </Paper>
      </Stack>
    </form>
  );
};

export default SignatureFormClient;
