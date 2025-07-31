'use client';

import {
  ActionIcon,
  Button,
  Group,
  InputBase,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { IMaskInput } from 'react-imask';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { IconCancel, IconPencil, IconPencilCog } from '@tabler/icons-react';
import API from '@/libs/API';
import { Select } from '@mantine/core';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import DynamicAutocomplete from '../Generic/DynamicAutocomplete';

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
        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });

        form.resetDirty();
        setLoading(false);
        setEnableUpdate(false);
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
    <form onSubmit={form.onSubmit(() => handleUpdateProfile())}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Group justify={'center'} align={'flex-start'} gap={50}>
        <Stack flex={{ base: '100%', lg: '1' }}>
          <TextInput
            size={'md'}
            label='Employee ID'
            description={
              'Please contact your administrator to update this field'
            }
            placeholder=''
            value={user?.employee_id ?? ''}
            disabled={enableUpdate}
            readOnly={true}
          />
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
          <TextInput
            size={'md'}
            label='Department'
            description={
              'Please contact your administrator to update this field'
            }
            placeholder=''
            value={user.department?.department_name}
            disabled={enableUpdate}
            readOnly={true}
          />
          <TextInput
            size={'md'}
            label='Section'
            description={
              'Please contact your administrator to update this field'
            }
            placeholder=''
            value={user.section?.section_name}
            disabled={enableUpdate}
            readOnly={true}
          />
          <DynamicAutocomplete
            endpoint={'/accounts/positions'}
            endpointParams={{ paginated: false }}
            column={'position_name'}
            size={'md'}
            label='Position'
            value={form.values.position}
            onChange={(value) => form.setFieldValue('position', value)}
            readOnly={!enableUpdate}
            required={enableUpdate}
          />
          <DynamicAutocomplete
            endpoint={'/accounts/designations'}
            endpointParams={{ paginated: false }}
            column={'designation_name'}
            size={'md'}
            label='Designation'
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

        <Stack w={'100%'} flex={{ base: '100%', lg: '1' }}>
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
            mb={enableUpdate ? 140 : 120}
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

          <Stack
            pos={'absolute'}
            bottom={5}
            right={0}
            w={{ base: '100%', lg: 'auto' }}
            px={20}
            align={'end'}
            sx={{ zIndex: 100 }}
          >
            {!enableUpdate ? (
              <Tooltip
                arrowPosition={'center'}
                arrowOffset={10}
                arrowSize={4}
                label={'Toggle Update'}
                withArrow
                position={'top-end'}
              >
                <ActionIcon
                  color={'var(--mantine-color-primary-9)'}
                  radius={'100%'}
                  size={80}
                  onClick={() => setEnableUpdate(!enableUpdate)}
                >
                  <IconPencilCog size={40} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            ) : (
              <Group justify={'space-between'}>
                <Button
                  type={'submit'}
                  size={'md'}
                  leftSection={<IconPencil size={18} />}
                  variant='filled'
                  color={'var(--mantine-color-primary-9)'}
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
                  color={'var(--mantine-color-gray-8)'}
                  fullWidth
                  onClick={() => setEnableUpdate(!enableUpdate)}
                >
                  Cancel
                </Button>
              </Group>
            )}
          </Stack>
        </Stack>
      </Group>
    </form>
  );
};

export default UserProfileFormClient;
