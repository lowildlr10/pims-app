'use client';

import {
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';

const UserProfileClient = ({ user }: UserProfileProps) => {
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
      phone: user?.phone ?? '',
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
    <Stack p={20}>
      <Group>
        <Stack gap={0}>
          <Title order={2} fw={600}>
            Profile
          </Title>
        </Stack>
      </Group>

      <Divider />

      <Paper shadow='xs' p='xl'>
        <form>
          <ScrollArea>
            <Stack>
              <Group justify={'center'} align={'center'}>
                <TextInput
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
                  label='Middle Name'
                  placeholder=''
                  value={form.values.middlename}
                  onChange={(event) =>
                    form.setFieldValue('middlename', event.currentTarget.value)
                  }
                  error={form.errors.middlename && ''}
                />
                <TextInput
                  label='Last Name'
                  placeholder=''
                  value={form.values.lastname}
                  onChange={(event) =>
                    form.setFieldValue('lastname', event.currentTarget.value)
                  }
                  error={form.errors.lastname && ''}
                  required
                />
              </Group>
            </Stack>
          </ScrollArea>
        </form>
      </Paper>
    </Stack>
  );
};

export default UserProfileClient;
