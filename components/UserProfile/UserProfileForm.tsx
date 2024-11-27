import {
  Autocomplete,
  Button,
  Divider,
  Group,
  InputBase,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { IMaskInput } from 'react-imask';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { IconCancel, IconPencil, IconPencilCog } from '@tabler/icons-react';
import API from '@/libs/API';
import { notifications } from '@mantine/notifications';
import { Select } from '@mantine/core';

const UserProfileFormClient = ({ user }: UserProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const [enableUpdate, setEnableUpdate] = useState(false);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      firstname: user?.firstname ?? '',
      middlename: user?.middlename ?? '',
      lastname: user?.lastname ?? '',
      sex: user?.sex ?? '',
      position: user?.position?.position_name ?? '',
      designation: user?.designation?.designation_name ?? '',
      username: user?.username ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '+639',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  useEffect(() => {
    form.reset();
  }, [enableUpdate]);

  const handleUpdateProfile = () => {
    setLoading(true);

    API.put(`/accounts/users/${user.id}`, {
      ...form.values,
      update_type: 'profile',
    })
      .then((res) => {
        notifications.show({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
          autoClose: 3000,
          position: 'top-right',
        });
        form.resetDirty();
        setLoading(false);
        setEnableUpdate(false);
      })
      .catch((err) => {
        const errors = err?.response?.data?.errors;

        if (typeof errors === 'object') {
          Object.keys(errors)?.forEach((key) => {
            notifications.show({
              title: 'Failed!',
              message: errors[key][0],
              color: 'red',
              autoClose: 3000,
              position: 'top-right',
            });
          });
        } else {
          notifications.show({
            title: 'Failed!',
            message: err?.response?.data?.message ?? err.message,
            color: 'red',
            autoClose: 3000,
            position: 'top-right',
          });
        }

        setLoading(false);
      });
  };

  return (
    <form onSubmit={form.onSubmit(() => handleUpdateProfile())}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Group justify={'center'} align={'flex-start'} gap={100}>
        <Stack>
          <TextInput
            size={'md'}
            label='First Name'
            placeholder='Juan'
            value={form.values.firstname}
            onChange={(event) =>
              form.setFieldValue('firstname', event.currentTarget.value)
            }
            error={form.errors.firstname && ''}
            readOnly={!enableUpdate}
            required={enableUpdate}
          />
          <TextInput
            size={'md'}
            label='Middle Name'
            placeholder=''
            value={form.values.middlename}
            onChange={(event) =>
              form.setFieldValue('middlename', event.currentTarget.value)
            }
            error={form.errors.middlename && ''}
            readOnly={!enableUpdate}
          />
          <TextInput
            size={'md'}
            label='Last Name'
            placeholder=''
            value={form.values.lastname}
            onChange={(event) =>
              form.setFieldValue('lastname', event.currentTarget.value)
            }
            error={form.errors.lastname && ''}
            readOnly={!enableUpdate}
            required={enableUpdate}
          />
          <Select
            size={'md'}
            label='Sex'
            data={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            value={form.values.sex}
            onChange={(_value, option) =>
              form.setFieldValue('sex', option.value)
            }
            readOnly={!enableUpdate}
            required={enableUpdate}
          />
          <Autocomplete
            size={'md'}
            label='Position'
            data={['React', 'Angular', 'Vue', 'Svelte']}
            value={form.values.position}
            onChange={(value) => form.setFieldValue('position', value)}
            readOnly={!enableUpdate}
            required={enableUpdate}
          />
          <Autocomplete
            size={'md'}
            label='Designation'
            data={['React', 'Angular', 'Vue', 'Svelte']}
            value={form.values.designation}
            onChange={(value) => form.setFieldValue('designation', value)}
            readOnly={!enableUpdate}
          />
          <TextInput
            size={'md'}
            label='Email'
            placeholder=''
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
            error={form.errors.phone && ''}
            readOnly={!enableUpdate}
          />
          <InputBase
            size={'md'}
            label='Phone'
            component={IMaskInput}
            mask='+630000000000'
            placeholder='+639000000000'
            value={form.values.phone}
            onChange={(event) =>
              form.setFieldValue('phone', event.currentTarget.value)
            }
            error={form.errors.phone && ''}
            readOnly={!enableUpdate}
          />
        </Stack>

        <Stack>
          <TextInput
            size={'md'}
            label='Username'
            placeholder=''
            value={form.values.username}
            onChange={(event) =>
              form.setFieldValue('username', event.currentTarget.value)
            }
            error={form.errors.username && ''}
            readOnly={!enableUpdate}
            required={enableUpdate}
          />
          <PasswordInput
            size={'md'}
            label='Password'
            description={'Fill out to change password'}
            placeholder='******'
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={form.errors.username && ''}
            readOnly={!enableUpdate}
          />

          <Divider size={'sm'} />

          {!enableUpdate ? (
            <Button
              size={'md'}
              leftSection={<IconPencilCog size={18} />}
              variant='outline'
              onClick={() => setEnableUpdate(!enableUpdate)}
            >
              Toggle Update
            </Button>
          ) : (
            <Group justify={'space-between'}>
              <Button
                type={'submit'}
                size={'md'}
                leftSection={<IconPencil size={18} />}
                variant='filled'
                color='blue'
                loading={loading}
                loaderProps={{ type: 'dots' }}
                autoContrast
                fullWidth
              >
                Update
              </Button>
              <Button
                size={'md'}
                leftSection={<IconCancel size={18} />}
                variant='outline'
                color={'gray'}
                fullWidth
                onClick={() => setEnableUpdate(!enableUpdate)}
              >
                Cancel
              </Button>
            </Group>
          )}
        </Stack>
      </Group>
    </form>
  );
};

export default UserProfileFormClient;
