import {
  Button,
  Checkbox,
  Divider,
  Paper,
  Stack,
  Switch,
  TextInput,
  Title,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { IconCancel, IconPencil, IconPencilPlus } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

const RoleContentClient = ({
  data,
  type,
  close,
  handleCreateUpdate,
  setPayload
}: ModalRoleContentProps) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      role_name: data?.role_name ?? '',
      permissions: data?.permissions ?? false,
      active: data?.active ?? false
    },
  });

  useEffect(() => {
    setPayload(form.values);
  }, [form.values]);

  return (
    <form onSubmit={form.onSubmit(() => handleCreateUpdate && handleCreateUpdate())}>
      <Stack>
        <TextInput
          label='Role Name'
          placeholder='Role Name'
          value={form.values.role_name}
          onChange={(event) =>
            form.setFieldValue('role_name', event.currentTarget.value)
          }
          error={form.errors.role_name && ''}
          size={'md'}
          required
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

        <Paper shadow={'xs'} p={'lg'} withBorder>
          <Stack>
            <Title order={4} ta={'center'}>Permissions</Title>
            <Divider />

            <Checkbox.Group
              defaultValue={[]}
              label="Purchase Request"
              description="Scope for Purchase Request module"
              size={'md'}
              color={'var(--mantine-color-primary-9)'}
            >
              <Stack mt="xs">
                <Checkbox value="view" label="View" />
                <Checkbox value="create" label="Create" />
                <Checkbox value="update" label="Update" />
                <Checkbox value="submit" label="Submit" />
              </Stack>
            </Checkbox.Group>
            <Divider />

            <Checkbox.Group
              defaultValue={[]}
              label="Request for Quotation"
              description="Scope for Request for Quotation module"
              size={'md'}
              color={'var(--mantine-color-primary-9)'}
            >
              <Stack mt="xs">
                <Checkbox value="view" label="View" />
                <Checkbox value="create" label="Create" />
                <Checkbox value="update" label="Update" />
                <Checkbox value="submit" label="Submit" />
              </Stack>
            </Checkbox.Group>
            <Divider />

            <Checkbox.Group
              defaultValue={[]}
              label="Abstract of Quotation"
              description="Scope for Abstract of Quotation module"
              size={'md'}
              color={'var(--mantine-color-primary-9)'}
            >
              <Stack mt="xs">
                <Checkbox value="view" label="View" />
                <Checkbox value="create" label="Create" />
                <Checkbox value="update" label="Update" />
                <Checkbox value="submit" label="Submit" />
              </Stack>
            </Checkbox.Group>
            <Divider />

            <Checkbox.Group
              defaultValue={[]}
              label="Purchase/Job Order"
              description="Scope for Purchase/Job Order module"
              size={'md'}
              color={'var(--mantine-color-primary-9)'}
            >
              <Stack mt="xs">
                <Checkbox value="view" label="View" />
                <Checkbox value="create" label="Create" />
                <Checkbox value="update" label="Update" />
                <Checkbox value="submit" label="Submit" />
              </Stack>
            </Checkbox.Group>
            <Divider />

            <Checkbox.Group
              defaultValue={[]}
              label="Inspection and Acceptance Report"
              description="Scope for Inspection and Acceptance Report module"
              size={'md'}
              color={'var(--mantine-color-primary-9)'}
            >
              <Stack mt="xs">
                <Checkbox value="view" label="View" />
                <Checkbox value="create" label="Create" />
                <Checkbox value="update" label="Update" />
                <Checkbox value="submit" label="Submit" />
              </Stack>
            </Checkbox.Group>
            <Divider />

            <Checkbox.Group
              defaultValue={[]}
              label="Obligation Request Status"
              description="Scope for Obligation Request Status module"
              size={'md'}
              color={'var(--mantine-color-primary-9)'}
            >
              <Stack mt="xs">
                <Checkbox value="view" label="View" />
                <Checkbox value="create" label="Create" />
                <Checkbox value="update" label="Update" />
                <Checkbox value="submit" label="Submit" />
              </Stack>
            </Checkbox.Group>
            <Divider />

            <Checkbox.Group
              defaultValue={[]}
              label="Disbursement Voucher"
              description="Scope for Disbursement Voucher module"
              size={'md'}
              color={'var(--mantine-color-primary-9)'}
            >
              <Stack mt="xs">
                <Checkbox value="view" label="View" />
                <Checkbox value="create" label="Create" />
                <Checkbox value="update" label="Update" />
                <Checkbox value="submit" label="Submit" />
              </Stack>
            </Checkbox.Group>
            <Divider />

            <Checkbox.Group
              defaultValue={[]}
              label="Inventory"
              description="Scope for Inventory module"
              size={'md'}
              color={'var(--mantine-color-primary-9)'}
            >
              <Stack mt="xs">
                <Checkbox value="view" label="View" />
                <Checkbox value="create" label="Create" />
                <Checkbox value="update" label="Update" />
                <Checkbox value="submit" label="Submit" />
              </Stack>
            </Checkbox.Group>
            <Divider />

            <Checkbox.Group
              defaultValue={[]}
              label="Payment"
              description="Scope for Payment module"
              size={'md'}
              color={'var(--mantine-color-primary-9)'}
            >
              <Stack mt="xs">
                <Checkbox value="view" label="View" />
                <Checkbox value="create" label="Create" />
                <Checkbox value="update" label="Update" />
                <Checkbox value="submit" label="Submit" />
              </Stack>
            </Checkbox.Group>
            <Divider />

            <Checkbox.Group
              defaultValue={[]}
              label="Company Profile"
              description="Scope for Company Profile module"
              size={'md'}
              color={'var(--mantine-color-primary-9)'}
            >
              <Stack mt="xs">
                <Checkbox value="view" label="View" />
                <Checkbox value="create" label="Create" />
                <Checkbox value="update" label="Update" />
                <Checkbox value="submit" label="Submit" />
              </Stack>
            </Checkbox.Group>
            <Divider />
          </Stack>
        </Paper>

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

export default RoleContentClient;
