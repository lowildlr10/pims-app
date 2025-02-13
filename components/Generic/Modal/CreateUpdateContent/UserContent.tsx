'use client';

import {
  Box,
  InputBase,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { forwardRef, useEffect } from 'react';
import DynamicAutocomplete from '../../DynamicAutocomplete';
import { IMaskInput } from 'react-imask';
import { Switch } from '@mantine/core';
import DynamicSelect from '../../DynamicSelect';
import DynamicMultiselect from '../../DynamicMultiselect';
import SingleImageUploadClient from '../../SingleImageUpload';

const UserContentClient = forwardRef<HTMLFormElement, ModalUserContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const form = useForm({
      mode: 'controlled',
      initialValues: {
        employee_id: data?.employee_id ?? '',
        firstname: data?.firstname ?? '',
        middlename: data?.middlename ?? '',
        lastname: data?.lastname ?? '',
        sex: data?.sex ?? '',
        section_id: data?.section_id ?? '',
        position: data?.position?.position_name ?? '',
        designation: data?.designation?.designation_name ?? '',
        username: data?.username ?? '',
        email: data?.email ?? '',
        phone: data?.phone ?? '',
        restricted: data?.restricted ?? false,
        password: '',
        roles: data?.roles?.map((role) => role.id) ?? [],
      },

      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      },
    });

    useEffect(() => {
      setPayload({
        ...form.values,
        roles: JSON.stringify(form.values.roles),
      });
    }, [form.values]);

    return (
      <form
        ref={ref}
        onSubmit={form.onSubmit(
          () => handleCreateUpdate && handleCreateUpdate()
        )}
      >
        <Stack>
          {data?.id && (
            <Box mb={10}>
              <SingleImageUploadClient
                image={data.avatar ?? ''}
                postUrl={`/media/${data.id}`}
                params={{ update_type: 'user-avatar' }}
                height={150}
                type={'avatar'}
              />
            </Box>
          )}

          <TextInput
            size={'sm'}
            label='Employee ID'
            placeholder='Employeee ID'
            value={form.values.employee_id}
            onChange={(event) =>
              form.setFieldValue('employee_id', event.currentTarget.value)
            }
            error={form.errors.username && ''}
            required
          />
          <TextInput
            size={'sm'}
            label='First Name'
            placeholder='Juan'
            value={form.values.firstname}
            onChange={(event) =>
              form.setFieldValue('firstname', event.currentTarget.value)
            }
            error={form.errors.firstname && ''}
            required
          />
          <TextInput
            size={'sm'}
            label='Middle Name'
            placeholder=''
            value={form.values.middlename}
            onChange={(event) =>
              form.setFieldValue('middlename', event.currentTarget.value)
            }
            error={form.errors.middlename && ''}
          />
          <TextInput
            size={'sm'}
            label='Last Name'
            placeholder=''
            value={form.values.lastname}
            onChange={(event) =>
              form.setFieldValue('lastname', event.currentTarget.value)
            }
            error={form.errors.lastname && ''}
            required
          />
          <Select
            size={'sm'}
            label='Sex'
            data={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            value={form.values.sex}
            onChange={(_value, option) =>
              form.setFieldValue('sex', option.value)
            }
            searchable
            required
          />
          <DynamicSelect
            endpoint={'/accounts/sections'}
            endpointParams={{
              paginated: false,
              show_all: true,
              show_inactive: true,
            }}
            column={'division_section'}
            label='Section'
            value={form.values.section_id}
            size={'sm'}
            onChange={(value) => form.setFieldValue('section_id', value)}
            required
          />
          <DynamicAutocomplete
            endpoint={'/accounts/positions'}
            endpointParams={{ paginated: false }}
            column={'position_name'}
            size={'sm'}
            label='Position'
            value={form.values.position}
            onChange={(value) => form.setFieldValue('position', value)}
            required
          />
          <DynamicAutocomplete
            endpoint={'/accounts/designations'}
            endpointParams={{ paginated: false }}
            column={'designation_name'}
            size={'sm'}
            label='Designation'
            value={form.values.designation}
            onChange={(value) => form.setFieldValue('designation', value)}
            required
          />
          <TextInput
            size={'sm'}
            label='Email'
            placeholder={'Email'}
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
            error={form.errors.email && ''}
          />
          <InputBase
            size={'sm'}
            label='Phone'
            component={IMaskInput}
            mask='+630000000000'
            placeholder='+639000000000'
            value={form.values.phone}
            onChange={(event) =>
              form.setFieldValue('phone', event.currentTarget.value)
            }
            error={form.errors.phone && ''}
          />
          <TextInput
            size={'sm'}
            label='Username'
            placeholder=''
            value={form.values.username}
            onChange={(event) =>
              form.setFieldValue('username', event.currentTarget.value)
            }
            error={form.errors.username && ''}
            required
          />
          <PasswordInput
            size={'sm'}
            label='Password'
            description={'Fill out to change password'}
            placeholder='******'
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={form.errors.username && ''}
          />
          <DynamicMultiselect
            endpoint={'/accounts/roles'}
            endpointParams={{
              paginated: false,
              show_all: true,
              show_inactive: true,
            }}
            column={'role_name'}
            label='Roles'
            value={form.values.roles}
            size={'sm'}
            onChange={(value) => form.setFieldValue('roles', value)}
            required
          />

          {data?.id && (
            <Stack>
              <Text size={'sm'} fw={500}>
                Signature
              </Text>
              <SingleImageUploadClient
                image={data?.signature ?? ''}
                postUrl={`/media/${data?.id}`}
                params={{ update_type: 'user-signature' }}
                height={150}
                type={'signature'}
              />
            </Stack>
          )}

          <Switch
            label={'Restricted'}
            my={20}
            onLabel='YES'
            offLabel='NO'
            color={'var(--mantine-color-secondary-9)'}
            checked={form.values.restricted}
            labelPosition={'left'}
            fw={500}
            size={'sm'}
            sx={{ cursor: 'pointer' }}
            onChange={(event) =>
              form.setFieldValue('restricted', event.currentTarget.checked)
            }
          />
        </Stack>
      </form>
    );
  }
);

UserContentClient.displayName = 'UserContentClient';

export default UserContentClient;
