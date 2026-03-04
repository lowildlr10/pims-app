'use client';

import {
  ActionIcon,
  Button,
  Divider,
  Group,
  InputBase,
  PasswordInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { IMaskInput } from 'react-imask';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import {
  IconCancel,
  IconPencil,
  IconPencilCog,
  IconUser,
} from '@tabler/icons-react';
import API from '@/libs/API';
import { Select } from '@mantine/core';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import DynamicAutocomplete from '../Generic/DynamicAutocomplete';
import CustomLoadingOverlay from '../Generic/CustomLoadingOverlay';

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
          message: res?.message,
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
      <CustomLoadingOverlay visible={loading} />
      <Stack gap='lg'>
        <Paper p='md' radius='md' withBorder>
          <Stack gap='md'>
            <Group justify='space-between'>
              <Group gap='xs'>
                <IconUser size={20} />
                <Title order={5}>Personal Information</Title>
              </Group>
              {!enableUpdate && (
                <Tooltip label='Edit Profile' withArrow position='top'>
                  <ActionIcon
                    color='var(--mantine-color-primary-9)'
                    radius='xl'
                    size='lg'
                    variant='filled'
                    onClick={() => setEnableUpdate(true)}
                  >
                    <IconPencilCog size={18} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>

            <Divider />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
              <TextInput
                size='sm'
                label='Employee ID'
                description='Contact admin to update'
                placeholder=''
                value={user?.employee_id ?? ''}
                disabled
                readOnly
              />
              <TextInput
                size='sm'
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
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing='md'>
              <TextInput
                size='sm'
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
                size='sm'
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
                size='sm'
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
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing='md'>
              <Select
                size='sm'
                label='Sex'
                data={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]}
                value={form.values.sex}
                onChange={(_value, option) =>
                  form.setFieldValue('sex', option?.value ?? '')
                }
                readOnly={!enableUpdate}
                required={enableUpdate}
              />
              <TextInput
                size='sm'
                label='Email'
                placeholder=''
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue('email', event.currentTarget.value)
                }
                error={form.errors.email && ''}
                readOnly={!enableUpdate}
              />
              <InputBase
                size='sm'
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
            </SimpleGrid>
          </Stack>
        </Paper>

        <Paper p='md' radius='md' withBorder>
          <Stack gap='md'>
            <Title order={5}>Work Information</Title>
            <Divider />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
              <TextInput
                size='sm'
                label='Department'
                description='Contact admin to update'
                placeholder=''
                value={user.department?.department_name ?? ''}
                disabled
                readOnly
              />
              <TextInput
                size='sm'
                label='Section'
                description='Contact admin to update'
                placeholder=''
                value={user.section?.section_name ?? ''}
                disabled
                readOnly
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
              <DynamicAutocomplete
                endpoint={'/accounts/positions'}
                endpointParams={{ paginated: false }}
                column={'position_name'}
                size='sm'
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
                size='sm'
                label='Designation'
                value={form.values.designation}
                onChange={(value) => form.setFieldValue('designation', value)}
                readOnly={!enableUpdate}
              />
            </SimpleGrid>
          </Stack>
        </Paper>

        <Paper p='md' radius='md' withBorder>
          <Stack gap='md'>
            <Title order={5}>Security</Title>
            <Divider />

            <PasswordInput
              size='sm'
              label='Password'
              description='Fill out to change password'
              placeholder='******'
              onChange={(event) =>
                form.setFieldValue('password', event.currentTarget.value)
              }
              error={form.errors.password && ''}
              readOnly={!enableUpdate}
            />
          </Stack>
        </Paper>

        {enableUpdate && (
          <Paper
            p='md'
            radius='md'
            style={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'var(--mantine-color-white)',
              boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
            }}
          >
            <Group justify='space-between'>
              <Text size='sm' c='dimmed'>
                You are in edit mode
              </Text>
              <Group>
                <Button
                  size='sm'
                  leftSection={<IconCancel size={16} />}
                  variant='outline'
                  color='var(--mantine-color-gray-7)'
                  onClick={() => {
                    form.reset();
                    setEnableUpdate(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  size='sm'
                  leftSection={<IconPencil size={16} />}
                  variant='filled'
                  color='var(--mantine-color-primary-9)'
                  loading={loading}
                  loaderProps={{ type: 'dots' }}
                  autoContrast
                >
                  Save Changes
                </Button>
              </Group>
            </Group>
          </Paper>
        )}
      </Stack>
    </form>
  );
};

export default UserProfileFormClient;
