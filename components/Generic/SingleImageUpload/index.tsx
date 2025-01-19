import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';
import {
  Avatar,
  Button,
  FileButton,
  Group,
  Image,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';

const SingleImageUploadClient = ({
  image,
  postUrl,
  params,
  type = 'default',
}: SingleImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      image: image ?? '',
    },
  });

  useEffect(() => {
    if (!file) return;
    handleProcessAvatar();
  }, [file]);

  useEffect(() => {
    if (!form.values.image || !file) return;
    handleUpdateAvatar();
  }, [form.values.image]);

  const handleProcessAvatar = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      form.setFieldValue('image', base64String);
    };

    if (file === null) {
      form.setFieldValue('image', '');
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

  const handleUpdateAvatar = () => {
    setLoading(true);

    API.put(postUrl, {
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
    <Group justify='center'>
      <FileButton
        onChange={setFile}
        accept={type === 'signature' ? 'image/png' : 'image/png,image/jpeg'}
      >
        {(props) => (
          <Button
            h={220}
            bgr={'100%'}
            variant={
              type === 'avatar' || type === 'logo' ? 'transparent' : 'light'
            }
            color={
              type === 'signature' || type === 'default' ? 'gray' : undefined
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
                {form.values.image ? (
                  <Avatar
                    size={220}
                    src={
                      Helper.isValidUrl(form.values.image)
                        ? `${form.values.image}?${new Date().getTime()}`
                        : form.values.image
                    }
                  />
                ) : (
                  <Avatar size={220} />
                )}
              </>
            ) : (
              <Image
                loading={'lazy'}
                radius={'sm'}
                height={220}
                width={'100%'}
                p={'md'}
                src={
                  Helper.isValidUrl(form.values.image)
                    ? `${form.values.image}?${new Date().getTime()}`
                    : form.values.image
                }
                fallbackSrc={
                  type === 'signature' ? '/images/signature-fallback.png' : ''
                }
                alt={type === 'signature' ? 'Signature' : 'Image'}
              />
            )}
          </Button>
        )}
      </FileButton>
    </Group>
  );
};

export default SingleImageUploadClient;
