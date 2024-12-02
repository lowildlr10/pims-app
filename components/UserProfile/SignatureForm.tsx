import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';
import {
  Button,
  FileButton,
  Image,
  LoadingOverlay,
  Stack,
  Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';

const SignatureFormClient = ({ user }: SignatureFormProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      signature: user.signature ?? '',
      allow_signature: user.allow_signature ?? false,
    },
  });

  useEffect(() => {
    console.log(form);
  }, [form]);

  useEffect(() => {
    if (!file) return;
    handleProcessSignature();
  }, [file]);

  const handleProcessSignature = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      form.setFieldValue('signature', base64String);
    };

    if (file === null) {
      form.setFieldValue('signature', '');
      return;
    }

    try {
      if (file instanceof File) {
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.log(err);
    }

    return;
  };

  const handleUpdateSignature = () => {
    setLoading(true);

    API.put(`/accounts/users/${user.id}`, {
      ...form.values,
      update_type: 'signature',
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
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Stack>
        <FileButton onChange={setFile} accept='image/png'>
          {(props) => (
            <Button
              h={300}
              variant={'transparent'}
              {...props}
              fullWidth
              autoContrast
            >
              <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
              />
              <Image
                loading={'lazy'}
                radius={'sm'}
                height={220}
                width={'100%'}
                src={
                  Helper.isValidUrl(form.values.signature)
                    ? `${form.values.signature}?${new Date().getTime()}`
                    : form.values.signature
                }
                fallbackSrc={'/images/signature-fallback.png'}
                alt={'Signature'}
              />
            </Button>
          )}
        </FileButton>

        <Switch
          label={'Enable signature?'}
          description={
            'Once enabled, it will appear on the required forms and documents.'
          }
          size='md'
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
          size={'lg'}
          type={'submit'}
          leftSection={<IconUpload size={24} />}
          fullWidth
        >
          Save
        </Button>
      </Stack>
    </form>
  );
};

export default SignatureFormClient;
