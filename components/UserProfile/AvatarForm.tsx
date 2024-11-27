import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';
import { Avatar, Button, FileButton, LoadingOverlay } from '@mantine/core';
import { Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';

const AvatarFormClient = ({ user }: AvatarFormProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      avatar: user.avatar ?? '',
    },
  });

  useEffect(() => {
    if (!file) return;
    handleProcessAvatar();
  }, [file]);

  useEffect(() => {
    if (!form.values.avatar || !file) return;
    handleUpdateAvatar();
  }, [form.values.avatar]);

  const handleProcessAvatar = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      form.setFieldValue('avatar', base64String);
    };

    if (file === null) {
      form.setFieldValue('avatar', '');
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

    API.put(`/accounts/users/${user.id}`, {
      ...form.values,
      update_type: 'avatar',
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
      <FileButton onChange={setFile} accept='image/png,image/jpeg'>
        {(props) => (
          <Button
            h={220}
            bgr={'100%'}
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
            {form.values.avatar ? (
              <Avatar
                size={220}
                src={
                  Helper.isValidUrl(form.values.avatar)
                    ? `${form.values.avatar}?${new Date().getTime()}`
                    : form.values.avatar
                }
              />
            ) : (
              <Avatar size={220} />
            )}
          </Button>
        )}
      </FileButton>
    </Group>
  );
};

export default AvatarFormClient;
