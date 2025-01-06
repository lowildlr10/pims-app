import {
  Button,
  Stack,
  Switch,
  TextInput,
} from '@mantine/core';
import React, { useEffect } from 'react';
import DynamicSelect from '../../DynamicSelect';
import { IconCancel, IconPencil, IconPencilPlus } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

const SectionContentClient = ({
  data,
  type,
  close,
  handleCreateUpdate,
  setPayload
}: ModalSectionContentProps) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      department_id: data?.department_id,
      section_name: data?.section_name ?? '',
      active: data?.active ?? false,
      section_head_id: data?.section_head_id,
    },
  });

  useEffect(() => {
    setPayload(form.values);
  }, [form.values]);

  return (
    <form onSubmit={form.onSubmit(() => handleCreateUpdate && handleCreateUpdate())}>
      <Stack>
        <DynamicSelect
          endpoint={'/accounts/departments'}
          endpointParams={{ paginated: false, show_all: true, show_inactive: true }}
          column={'department_name'}
          label='Department'
          value={form.values.department_id}
          size={'md'}
          onChange={(value) => form.setFieldValue('department_id', value)}
          required
        />
        <TextInput
          label='Section Name'
          placeholder='Section name'
          size={'md'}
          value={form.values.section_name}
          onChange={(event) =>
            form.setFieldValue('section_name', event.currentTarget.value)
          }
          error={form.errors.department_name && ''}
          required
        />
        <DynamicSelect
          endpoint={'/accounts/users'}
          endpointParams={{ paginated: false, show_all: true }}
          column={'fullname'}
          label='Section Head'
          size={'md'}
          value={form.values.section_head_id}
          onChange={(value) => form.setFieldValue('section_head_id', value)}
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
          size={'md'}
          sx={{ cursor: 'pointer' }}
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

export default SectionContentClient;
