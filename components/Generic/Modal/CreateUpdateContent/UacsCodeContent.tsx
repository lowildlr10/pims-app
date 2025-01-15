import { Stack, Switch, Textarea, TextInput } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';
import DynamicSelect from '../../DynamicSelect';

const UacsCodeContentClient = ({
  data,
  handleCreateUpdate,
  setPayload,
}: ModalUacsCodeContentProps) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      classification_id: data?.classification_id ?? '',
      account_title: data?.account_title ?? '',
      code: data?.code ?? '',
      description: data?.description ?? '',
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
        <DynamicSelect
          endpoint={'/libraries/uacs-code-classifications'}
          endpointParams={{
            paginated: false,
            show_all: true,
            show_inactive: true,
          }}
          column={'classification_name'}
          label='Classification'
          value={form.values.classification_id}
          size={'sm'}
          onChange={(value) => form.setFieldValue('classification_id', value)}
          required
        />
        <TextInput
          label='Account Title'
          placeholder='Account Title'
          value={form.values.account_title}
          onChange={(event) =>
            form.setFieldValue('account_title', event.currentTarget.value)
          }
          error={form.errors.account_title && ''}
          size={'sm'}
          required
        />
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

export default UacsCodeContentClient;
