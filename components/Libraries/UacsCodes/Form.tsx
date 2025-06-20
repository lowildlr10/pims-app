import { Stack, Switch, Textarea, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import DynamicSelect from '../../Generic/DynamicSelect';

const FormClient = forwardRef<HTMLFormElement, ModalUacsCodeContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const [currentData, setCurrentData] = useState(data);
    const currentForm = useMemo(
      () => ({
        classification_id: currentData?.classification_id ?? '',
        account_title: currentData?.account_title ?? '',
        code: currentData?.code ?? '',
        description: currentData?.description ?? '',
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
          <DynamicSelect
            endpoint={'/libraries/uacs-code-classifications'}
            endpointParams={{
              paginated: false,
              show_all: true,
              show_inactive: true,
            }}
            column={'classification_name'}
            label='Classification'
            defaultData={
              currentData?.classification_id
                ? [
                    {
                      value: currentData?.classification_id ?? '',
                      label:
                        currentData?.classification?.classification_name ?? '',
                    },
                  ]
                : undefined
            }
            value={form.values.classification_id}
            size={'sm'}
            onChange={(value) =>
              form.setFieldValue('classification_id', value ?? '')
            }
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
  }
);

FormClient.displayName = 'FormClient';

export default FormClient;
