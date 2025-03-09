import { Stack, Switch, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import DynamicSelect from '../../DynamicSelect';
import { useForm } from '@mantine/form';

const DivisionContentClient = forwardRef<
  HTMLFormElement,
  ModalDivisionContentProps
>(({ data, handleCreateUpdate, setPayload }, ref) => {
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(
    () => ({
      division_name: data?.division_name ?? '',
      active: data?.active ?? false,
      division_head_id: data?.division_head_id,
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
          label='Division Name'
          placeholder='Division name'
          value={form.values.division_name}
          onChange={(event) =>
            form.setFieldValue('division_name', event.currentTarget.value)
          }
          error={form.errors.division_name && ''}
          size={'sm'}
          required
        />
        <DynamicSelect
          endpoint={'/accounts/users'}
          endpointParams={{ paginated: false, show_all: true }}
          column={'fullname'}
          label='Division Head'
          defaultData={
            currentData?.division_head_id
              ? [
                  {
                    value: currentData?.division_head_id ?? '',
                    label: currentData?.head?.fullname ?? '',
                  },
                ]
              : undefined
          }
          value={form.values.division_head_id}
          size={'sm'}
          onChange={(value) => form.setFieldValue('division_head_id', value)}
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

DivisionContentClient.displayName = 'DivisionContentClient';

export default DivisionContentClient;
