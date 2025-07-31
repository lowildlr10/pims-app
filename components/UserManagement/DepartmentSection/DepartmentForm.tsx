import { Stack, Switch, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import DynamicSelect from '../../Generic/DynamicSelect';
import { useForm } from '@mantine/form';

const DepartmentFormClient = forwardRef<
  HTMLFormElement,
  ModalDepartmentContentProps
>(({ data, handleCreateUpdate, setPayload }, ref) => {
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(
    () => ({
      department_name: currentData?.department_name ?? '',
      active: currentData?.active ?? false,
      department_head_id: currentData?.department_head_id,
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
          defaultData={
            currentData?.department_head_id
              ? [
                  {
                    value: currentData?.department_head_id ?? '',
                    label: currentData?.head?.fullname ?? '',
                  },
                ]
              : undefined
          }
          value={form.values.department_head_id}
          size={'sm'}
          onChange={(value) =>
            form.setFieldValue('department_head_id', value ?? '')
          }
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

DepartmentFormClient.displayName = 'DepartmentFormClient';

export default DepartmentFormClient;
