import {
  Autocomplete,
  Group,
  InputBase,
  NativeSelect,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { IMaskInput } from 'react-imask';
import { useForm } from '@mantine/form';
import React from 'react';

const UserProfileFormClient = ({ user }: UserProfileFormProps) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      firstname: user?.firstname ?? '',
      middlename: user?.middlename ?? '',
      lastname: user?.lastname ?? '',
      sex: user?.sex ?? '',
      department_id: user?.department_id ?? '',
      section_id: user?.section_id ?? '',
      position_id: user?.position_id ?? '',
      designation_id: user?.designation_id ?? '',
      username: user?.username ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '+639',
      password: '',
      avatar: user?.avatar ?? '',
      allow_signature: user?.allow_signature ?? '',
      signature: user?.signature ?? '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <form>
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
            required
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
            required
          />
          <NativeSelect
            size={'md'}
            label='Sex'
            data={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            value={form.values.sex}
            onChange={(event) =>
              form.setFieldValue('sex', event.currentTarget.value)
            }
            required
          />
          <Autocomplete
            size={'md'}
            label='Position'
            data={['React', 'Angular', 'Vue', 'Svelte']}
            required
          />
          <Autocomplete
            size={'md'}
            label='Designation'
            data={['React', 'Angular', 'Vue', 'Svelte']}
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
            required
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
          />
        </Stack>
      </Group>
    </form>
  );
};

export default UserProfileFormClient;
