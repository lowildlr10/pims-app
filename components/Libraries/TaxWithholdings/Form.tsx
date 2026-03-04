'use client';

import { NumberInput, Stack, Switch, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';

const FormClient = forwardRef<HTMLFormElement, ModalTaxWithholdingContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const [currentData, setCurrentData] = useState(data);
    const currentForm = useMemo(
      () => ({
        name: currentData?.name ?? '',
        is_vat: currentData?.is_vat ?? false,
        ewt_rate: (currentData?.ewt_rate ?? 0) * 100,
        ptax_rate: (currentData?.ptax_rate ?? 0) * 100,
        active: currentData?.active ?? true,
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
      setPayload({
        ...form.values,
        ewt_rate: (form.values.ewt_rate ?? 0) / 100,
        ptax_rate: (form.values.ptax_rate ?? 0) / 100,
      });
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
            label='Name'
            placeholder='e.g. VAT Goods'
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue('name', event.currentTarget.value)
            }
            error={form.errors.name && ''}
            size={'sm'}
            required
          />
          <NumberInput
            label='W/Tax Rate (%)'
            description='Expanded Withholding Tax rate (e.g. 1 for 1%)'
            placeholder='1'
            value={form.values.ewt_rate}
            onChange={(value) =>
              form.setFieldValue('ewt_rate', value as number)
            }
            min={0}
            max={100}
            decimalScale={2}
            fixedDecimalScale
            size={'sm'}
            required
          />
          <NumberInput
            label='P/Tax Rate (%)'
            description='Percentage Tax rate (e.g. 3 for 3%)'
            placeholder='3'
            value={form.values.ptax_rate}
            onChange={(value) =>
              form.setFieldValue('ptax_rate', value as number)
            }
            min={0}
            max={100}
            decimalScale={2}
            fixedDecimalScale
            size={'sm'}
            required
          />
          <Switch
            label={'VAT Applicable'}
            onLabel='Yes'
            offLabel='No'
            color={'var(--mantine-color-primary-9)'}
            checked={form.values.is_vat}
            labelPosition={'left'}
            fw={500}
            sx={{ cursor: 'pointer' }}
            size={'sm'}
            onChange={(event) =>
              form.setFieldValue('is_vat', event.currentTarget.checked)
            }
          />
          <Switch
            label={'Status'}
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
