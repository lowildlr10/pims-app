import { Stack, Switch, TextInput } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';

const UnitIssueContentClient = ({
  data,
  handleCreateUpdate,
  setPayload,
}: ModalUnitIssueContentProps) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      unit_name: data?.unit_name ?? '',
      active: data?.active ?? false,
    },
  });

  useEffect(() => {
    setPayload(form.values);
  }, [form.values]);

  return (
    <form
      onSubmit={form.onSubmit(() => handleCreateUpdate && handleCreateUpdate())}
    >
      <Stack>
        <TextInput
          label='Unit Name'
          placeholder='Unit Name'
          value={form.values.unit_name}
          onChange={(event) =>
            form.setFieldValue('unit_name', event.currentTarget.value)
          }
          error={form.errors.unit_name && ''}
          size={'sm'}
          required
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

export default UnitIssueContentClient;
