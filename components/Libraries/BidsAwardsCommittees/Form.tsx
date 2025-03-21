import { Stack, Switch, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';

const BidsAwardsCommitteeContentClient = forwardRef<
  HTMLFormElement,
  ModalBidsAwardsCommitteeContentProps
>(({ data, handleCreateUpdate, setPayload }, ref) => {
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(
    () => ({
      committee_name: currentData?.committee_name ?? '',
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
      onSubmit={form.onSubmit(() => handleCreateUpdate && handleCreateUpdate())}
    >
      <Stack>
        <TextInput
          label='Committee Name'
          placeholder='Committee name'
          value={form.values.committee_name}
          onChange={(event) =>
            form.setFieldValue('committee_name', event.currentTarget.value)
          }
          error={form.errors.committee_name && ''}
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

BidsAwardsCommitteeContentClient.displayName =
  'BidsAwardsCommitteeContentClient';

export default BidsAwardsCommitteeContentClient;
