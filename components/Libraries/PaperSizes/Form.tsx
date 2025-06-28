import { NumberInput, Select, Stack, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';

const FormClient = forwardRef<HTMLFormElement, ModalPaperSizeContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const [currentData, setCurrentData] = useState(data);
    const currentForm = useMemo(
      () => ({
        paper_type: currentData?.paper_type ?? '',
        unit: currentData?.unit ?? '',
        width: currentData?.width ?? '',
        height: currentData?.height ?? '',
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
            label='Paper Type'
            placeholder='Paper Type'
            value={form.values.paper_type}
            onChange={(event) =>
              form.setFieldValue('paper_type', event.currentTarget.value)
            }
            error={form.errors.paper_type && ''}
            size={'sm'}
            required
          />
          <Select
            size={'sm'}
            label='Unit'
            data={[
              { label: 'Millimeter (mm)', value: 'mm' },
              { label: 'Centimeter (cm)', value: 'cm' },
              { label: 'Inches (in)', value: 'in' },
            ]}
            defaultValue={'mm'}
            defaultChecked
            value={form.values.unit}
            onChange={(_value, option) =>
              form.setFieldValue('unit', option.value)
            }
            searchable
            required
          />
          <NumberInput
            label='Width'
            placeholder='Width'
            defaultValue={0.0}
            value={form.values.width}
            onChange={(value) => form.setFieldValue('width', value as number)}
            error={form.errors.width && ''}
            size={'sm'}
            required
          />
          <NumberInput
            label='Height'
            placeholder='Height'
            defaultValue={0.0}
            value={form.values.height}
            onChange={(value) => form.setFieldValue('height', value as number)}
            error={form.errors.height && ''}
            size={'sm'}
            required
          />
        </Stack>
      </form>
    );
  }
);

FormClient.displayName = 'FormClient';

export default FormClient;
