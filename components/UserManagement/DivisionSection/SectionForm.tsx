import { Stack, Switch, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import DynamicSelect from '../../Generic/DynamicSelect';
import { useForm } from '@mantine/form';

const SectionContentClient = forwardRef<
  HTMLFormElement,
  ModalSectionContentProps
>(({ data, handleCreateUpdate, setPayload, isCreate }, ref) => {
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(
    () => ({
      division_id: currentData?.division_id,
      section_name: currentData?.section_name ?? '',
      active: currentData?.active ?? false,
      section_head_id: currentData?.section_head_id,
    }),
    [currentData]
  );
  const form = useForm({
    mode: 'controlled',
    initialValues: currentForm,
  });

  useEffect(() => {
    setCurrentData(data);
    console.log(data);
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
        {!isCreate && (
          <DynamicSelect
            endpoint={'/accounts/divisions'}
            endpointParams={{
              paginated: false,
              show_all: true,
              show_inactive: true,
            }}
            column={'division_name'}
            label='Division'
            defaultData={
              currentData?.division_id
                ? [
                    {
                      value: currentData?.division_id ?? '',
                      label: currentData?.division?.division_name ?? '',
                    },
                  ]
                : undefined
            }
            value={form.values.division_id}
            size={'sm'}
            onChange={(value) => form.setFieldValue('division_id', value ?? '')}
            required
          />
        )}

        <TextInput
          label='Section Name'
          placeholder='Section name'
          size={'sm'}
          value={form.values.section_name}
          onChange={(event) =>
            form.setFieldValue('section_name', event.currentTarget.value)
          }
          error={form.errors.division_name && ''}
          required
        />
        <DynamicSelect
          endpoint={'/accounts/users'}
          endpointParams={{ paginated: false, show_all: true }}
          column={'fullname'}
          label='Section Head'
          size={'sm'}
          defaultData={
            currentData?.section_head_id
              ? [
                  {
                    value: currentData?.section_head_id ?? '',
                    label: currentData?.head?.fullname ?? '',
                  },
                ]
              : undefined
          }
          value={form.values.section_head_id}
          onChange={(value) =>
            form.setFieldValue('section_head_id', value ?? '')
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
          size={'sm'}
          sx={{ cursor: 'pointer' }}
          onChange={(event) =>
            form.setFieldValue('active', event.currentTarget.checked)
          }
        />
      </Stack>
    </form>
  );
});

SectionContentClient.displayName = 'SectionContentClient';

export default SectionContentClient;
