import { Stack, Switch, Textarea, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect } from 'react';
import { useForm } from '@mantine/form';

const SupplierContentClient = forwardRef<HTMLFormElement, ModalSupplierContentProps>(({
  data,
  handleCreateUpdate,
  setPayload,
}, ref) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      supplier_name: data?.supplier_name ?? '',
      address: data?.address ?? '',
      tin_no: data?.tin_no ?? '',
      phone: data?.phone ?? '',
      telephone: data?.telephone ?? '',
      vat_no: data?.vat_no ?? '',
      contact_person: data?.contact_person ?? '',
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
          label='Supplier/Company Name'
          placeholder='Supplier/Company Name'
          value={form.values.supplier_name}
          onChange={(event) =>
            form.setFieldValue('supplier_name', event.currentTarget.value)
          }
          error={form.errors.supplier_name && ''}
          size={'sm'}
          required
        />
        <Textarea
          label='Address'
          placeholder='Address'
          value={form.values.address}
          onChange={(event) =>
            form.setFieldValue('address', event.currentTarget.value)
          }
          error={form.errors.address && ''}
          size={'sm'}
        />
        <TextInput
          label='TIN No.'
          placeholder='TIN No.'
          value={form.values.tin_no}
          onChange={(event) =>
            form.setFieldValue('tin_no', event.currentTarget.value)
          }
          error={form.errors.tin_no && ''}
          size={'sm'}
        />
        <TextInput
          label='Phone'
          placeholder='Phone'
          value={form.values.phone}
          onChange={(event) =>
            form.setFieldValue('phone', event.currentTarget.value)
          }
          error={form.errors.phone && ''}
          size={'sm'}
        />
        <TextInput
          label='Telephone'
          placeholder='Telephone'
          value={form.values.telephone}
          onChange={(event) =>
            form.setFieldValue('telephone', event.currentTarget.value)
          }
          error={form.errors.telephone && ''}
          size={'sm'}
        />
        <TextInput
          label='VAT No.'
          placeholder='VAT No.'
          value={form.values.vat_no}
          onChange={(event) =>
            form.setFieldValue('vat_no', event.currentTarget.value)
          }
          error={form.errors.vat_no && ''}
          size={'sm'}
        />
        <TextInput
          label='Contact Person'
          placeholder='Contact Person'
          value={form.values.contact_person}
          onChange={(event) =>
            form.setFieldValue('contact_person', event.currentTarget.value)
          }
          error={form.errors.contact_person && ''}
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
});

SupplierContentClient.displayName = 'SupplierContentClient';

export default SupplierContentClient;
