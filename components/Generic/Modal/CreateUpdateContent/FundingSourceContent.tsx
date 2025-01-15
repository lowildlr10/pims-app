import { NumberInput, Stack, Switch, TextInput } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';
import DynamicAutocomplete from '../../DynamicAutocomplete';

const FundingSourceContentClient = ({
  data,
  handleCreateUpdate,
  setPayload,
}: ModalFundingSourceContentProps) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      location: data?.location?.location_name ?? '',
      title: data?.title ?? '',
      total_cost: data?.total_cost ?? '',
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
          label='Title'
          placeholder='Title'
          value={form.values.title}
          onChange={(event) =>
            form.setFieldValue('title', event.currentTarget.value)
          }
          error={form.errors.title && ''}
          size={'sm'}
          required
        />
        <DynamicAutocomplete
          endpoint={'/libraries/locations'}
          endpointParams={{ paginated: false }}
          column={'location_name'}
          size={'sm'}
          label='Location'
          value={form.values.location}
          onChange={(value) => form.setFieldValue('location', value)}
          required
        />
        <NumberInput
          label='Total Cost'
          placeholder='Total Cost'
          defaultValue={0.0}
          value={form.values.total_cost}
          onChange={(value) =>
            form.setFieldValue('total_cost', value as number)
          }
          error={form.errors.total_cost && ''}
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

export default FundingSourceContentClient;
