import { Stack, Switch, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect } from 'react';
import { useForm } from '@mantine/form';

const UacsCodeClassificationContentClient = forwardRef<
  HTMLFormElement,
  ModalUacsCodeClassificationContentProps
>(({ data, handleCreateUpdate, setPayload }, ref) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      classification_name: data?.classification_name ?? '',
      active: data?.active ?? false,
    },
  });

  useEffect(() => {
    setPayload(form.values);
  }, [form.values]);

  return (
    <form
      ref={ref}
      onSubmit={form.onSubmit(() => handleCreateUpdate && handleCreateUpdate())}
    >
      <Stack>
        <TextInput
          label='Classification Name'
          placeholder='Classification Name'
          value={form.values.classification_name}
          onChange={(event) =>
            form.setFieldValue('classification_name', event.currentTarget.value)
          }
          error={form.errors.classification_name && ''}
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
});

UacsCodeClassificationContentClient.displayName =
  'UacsCodeClassificationContentClient';

export default UacsCodeClassificationContentClient;
