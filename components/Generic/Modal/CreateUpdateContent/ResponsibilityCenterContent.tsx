import { Stack, Switch, Textarea, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';

const ResponsibilityCenterContentClient = forwardRef<
  HTMLFormElement,
  ModalResposibilityCenterContentProps
>(({ data, handleCreateUpdate, setPayload }, ref) => {
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(
    () => ({
      code: data?.code ?? '',
      description: data?.description ?? '',
      active: data?.active ?? false,
    }),
    [currentData]
  );
  const form = useForm({
    mode: 'controlled',
    initialValues: currentForm,
  });

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    form.reset();
    form.setValues(currentForm);
  }, [currentForm]);

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
          label='Code'
          placeholder='Code'
          value={form.values.code}
          onChange={(event) =>
            form.setFieldValue('code', event.currentTarget.value)
          }
          error={form.errors.code && ''}
          size={'sm'}
          required
        />
        <Textarea
          label='Description'
          placeholder='Description'
          value={form.values.description}
          onChange={(event) =>
            form.setFieldValue('description', event.currentTarget.value)
          }
          error={form.errors.description && ''}
          size={'sm'}
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

ResponsibilityCenterContentClient.displayName =
  'ResponsibilityCenterContentClient';

export default ResponsibilityCenterContentClient;
