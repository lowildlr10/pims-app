import {
  Stack,
  Switch,
  TextInput,
} from '@mantine/core';
import React, { useEffect } from 'react';
import DynamicSelect from '../../DynamicSelect';
import { useForm } from '@mantine/form';

const DepartmentContentClient = ({
  data,
  handleCreateUpdate,
  setPayload
}: ModalDepartmentContentProps) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      department_name: data?.department_name ?? '',
      active: data?.active ?? false,
      department_head_id: data?.department_head_id,
    },
  });

  useEffect(() => {
    setPayload(form.values);
  }, [form.values]);

  return (
    <form onSubmit={form.onSubmit(() => handleCreateUpdate && handleCreateUpdate())}>
      <Stack>
        <TextInput
          label='Department Name'
          placeholder='Department name'
          value={form.values.department_name}
          onChange={(event) =>
            form.setFieldValue('department_name', event.currentTarget.value)
          }
          error={form.errors.department_name && ''}
          size={'sm'}
          required
        />
        <DynamicSelect
          endpoint={'/accounts/users'}
          endpointParams={{ paginated: false, show_all: true }}
          column={'fullname'}
          label='Department Head'
          value={form.values.department_head_id}
          size={'sm'}
          onChange={(value) => form.setFieldValue('department_head_id', value)}
        />
        <Switch
          label={'Status'}
          my={20}
          onLabel='Active'
          offLabel='Inactive'
          color={'var(--mantine-color-secondary-9)'}
          checked={form.values.active}
          labelPosition={'left'}
          fw={500}
          sx={{ cursor: 'pointer' }}
          size={'sm'}
          onChange={(event) =>
            form.setFieldValue('active', event.currentTarget.checked)
          }
        />
      </Stack>
    </form>
  );
};

export default DepartmentContentClient;
