import { Stack, Switch, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';

const FormClient = forwardRef<HTMLFormElement, ModalUnitIssueContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const [currentData, setCurrentData] = useState(data);
    const currentForm = useMemo(
      () => ({
        unit_name: currentData?.unit_name ?? '',
        active: currentData?.active ?? false,
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
        onSubmit={form.onSubmit(
          () => handleCreateUpdate && handleCreateUpdate()
        )}
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
  }
);

FormClient.displayName = 'FormClient';

export default FormClient;
