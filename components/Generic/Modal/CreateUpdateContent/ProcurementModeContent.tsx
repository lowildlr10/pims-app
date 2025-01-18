import { Stack, Switch, TextInput } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';

const ProcurementModeContentClient = ({
  data,
  handleCreateUpdate,
  setPayload,
}: ModalProcurementModeContentProps) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      mode_name: data?.mode_name ?? '',
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
          label='Mode Name'
          placeholder='Mode Name'
          value={form.values.mode_name}
          onChange={(event) =>
            form.setFieldValue('mode_name', event.currentTarget.value)
          }
          error={form.errors.mode_name && ''}
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

export default ProcurementModeContentClient;
