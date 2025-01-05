import {
  Button,
  LoadingOverlay,
  Stack,
  Switch,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useState } from 'react';
import DynamicSelect from '../../DynamicSelect';
import { IconCancel, IconPencil, IconPencilPlus } from '@tabler/icons-react';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { getErrors } from '@/libs/Errors';

const DepartmentContentClient = ({
  endpoint,
  data,
  type,
  close,
  updateTable,
}: ModalDepartmentContentProps) => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      department_name: data?.department_name ?? '',
      active: data?.active ?? false,
      department_head_id: data?.department_head_id,
    },
  });

  const handleCreateUpdate = () => {
    setLoading(true);

    const request =
      type === 'create'
        ? API.post(endpoint, {
            ...form.values,
          })
        : API.put(endpoint, {
            ...form.values,
          });

    request
      .then((res) => {
        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });

        if (type === 'create' && updateTable) {
          updateTable(null, form.values);
        }

        if (type === 'update' && updateTable) {
          updateTable(data?.id ?? null, form.values);
        }

        form.resetDirty();
        setLoading(false);
        close();
      })
      .catch((err) => {
        const errors = getErrors(err);

        errors.forEach((error) => {
          notify({
            title: 'Failed',
            message: error,
            color: 'red',
          });
        });

        setLoading(false);
      });
  };

  return (
    <form onSubmit={form.onSubmit(() => handleCreateUpdate())}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Stack>
        <TextInput
          label='Department Name'
          placeholder='Department name'
          value={form.values.department_name}
          onChange={(event) =>
            form.setFieldValue('department_name', event.currentTarget.value)
          }
          error={form.errors.department_name && ''}
          size={'md'}
          required
        />
        <DynamicSelect
          endpoint={'/accounts/users'}
          endpointParams={{ paginated: false, show_all: true }}
          column={'fullname'}
          label='Department Head'
          value={form.values.department_head_id}
          size={'md'}
          onChange={(value) => form.setFieldValue('department_head_id', value)}
        />
        <Switch
          label={'Status'}
          mb={80}
          onLabel='Active'
          offLabel='Inactive'
          color={'var(--mantine-color-secondary-9)'}
          checked={form.values.active}
          labelPosition={'left'}
          fw={500}
          sx={{ cursor: 'pointer' }}
          size={'md'}
          onChange={(event) =>
            form.setFieldValue('active', event.currentTarget.checked)
          }
        />
        <Button
          type={'submit'}
          color={'var(--mantine-color-primary-9)'}
          size={'md'}
          leftSection={
            type === 'create' ? (
              <IconPencilPlus size={18} />
            ) : (
              <IconPencil size={18} />
            )
          }
        >
          {type === 'create' ? 'Create' : 'Update'}
        </Button>
        <Button
          variant={'outline'}
          size={'md'}
          color={'var(--mantine-color-gray-8)'}
          leftSection={<IconCancel size={18} />}
          onClick={close}
        >
          Cancel
        </Button>
      </Stack>
    </form>
  );
};

export default DepartmentContentClient;
