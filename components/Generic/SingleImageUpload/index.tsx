import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import {
  Avatar,
  Button,
  FileButton,
  Group,
  Image,
  LoadingOverlay,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';

const SingleImageUploadClient = ({
  image,
  postUrl,
  params,
  height = 220,
  type,
  clearImageCache,
}: SingleImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      file: '',
    },
  });

  useEffect(() => {
    if (!file) return;
    handleProcessImage();
  }, [file]);

  useEffect(() => {
    if (!form.values.file || !file) return;
    handleUpdateImage();
  }, [form.values.file]);

  useEffect(() => {
    form.setFieldValue('file', image ?? '');
    setInitialLoad(true);
  }, [image]);

  const handleProcessImage = () => {
    setInitialLoad(false);

    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      form.setFieldValue('file', base64String);
    };

    if (file === null) {
      form.setFieldValue('file', '');
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

  const handleUpdateImage = () => {
    if (initialLoad) return;

    setLoading(true);

    API.post(postUrl, {
      ...form.values,
      ...params,
    })
      .then((res) => {
        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });
        form.resetDirty();
        setLoading(false);

        if (clearImageCache) {
          clearImageCache();
        }
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
    <Tooltip
      arrowPosition={'center'}
      arrowOffset={10}
      arrowSize={4}
      label={'Click to upload image here'}
      withArrow
      position={'top-end'}
    >
      <Group justify='center'>
        <FileButton
          onChange={setFile}
          accept={type === 'signature' ? 'image/png' : 'image/png,image/jpeg'}
        >
          {(props) => (
            <Button
              h={
                height
                  ? typeof height === 'string'
                    ? parseInt(height + 5)
                    : height + 5
                  : 225
              }
              bgr={'100%'}
              variant={
                type === 'avatar' || type === 'logo' ? 'transparent' : 'light'
              }
              color={
                type === 'signature' || type === 'login-background'
                  ? 'gray'
                  : undefined
              }
              {...props}
              fullWidth
              autoContrast
            >
              <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
              />

              {type === 'avatar' || type === 'logo' ? (
                <>
                  {form.values.file ? (
                    <Avatar size={height} src={form.values.file ?? undefined} />
                  ) : (
                    <Avatar size={height} />
                  )}
                </>
              ) : (
                <Image
                  loading={'lazy'}
                  radius={'sm'}
                  height={height ?? 220}
                  width={'100%'}
                  p={'md'}
                  src={form.values.file ?? ''}
                  fallbackSrc={
                    type === 'signature'
                      ? '/images/signature-fallback.png'
                      : '/images/background-fallback.png'
                  }
                  alt={type === 'signature' ? 'Signature' : 'Image'}
                />
              )}
            </Button>
          )}
        </FileButton>
      </Group>
    </Tooltip>
  );
};

export default SingleImageUploadClient;
