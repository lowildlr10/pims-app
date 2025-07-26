'use client';

import {
  Box,
  InputBase,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import DynamicAutocomplete from '../../Generic/DynamicAutocomplete';
import { IMaskInput } from 'react-imask';
import { Switch } from '@mantine/core';
import DynamicSelect from '../../Generic/DynamicSelect';
import DynamicMultiselect from '../../Generic/DynamicMultiselect';
import SingleImageUploadClient from '../../Generic/SingleImageUpload';
import { useMediaAsset } from '@/hooks/useMediaAsset';

const FormClient = forwardRef<HTMLFormElement, ModalUserContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const [currentData, setCurrentData] = useState(data);
    const [departmentId, setDepartmentId] = useState(
      currentData?.department_id ?? null
    );
    const [sectionId, setSectionId] = useState(currentData?.section_id ?? null);
    const currentForm = useMemo(
      () => ({
        employee_id: currentData?.employee_id ?? '',
        firstname: currentData?.firstname ?? '',
        middlename: currentData?.middlename ?? '',
        lastname: currentData?.lastname ?? '',
        sex: currentData?.sex ?? '',
        department_id: departmentId ?? '',
        section_id: sectionId ?? '',
        position: currentData?.position?.position_name ?? '',
        designation: currentData?.designation?.designation_name ?? '',
        username: currentData?.username ?? '',
        email: currentData?.email ?? '',
        phone: currentData?.phone ?? '',
        restricted: currentData?.restricted ?? false,
        password: '',
        roles: currentData?.roles?.map((role) => role.id) ?? [],
      }),
      [currentData, departmentId, sectionId]
    );
    const form = useForm({
      mode: 'controlled',
      initialValues: currentForm,
    });

    const { media: avatar, clearCache: clearAvatarCache } = useMediaAsset({
      type: 'avatar',
      user: currentData,
    });

    useEffect(() => {
      setCurrentData(data);
      setDepartmentId(data?.department_id ?? '');
      setSectionId(data?.section_id ?? '');
    }, [data]);

    useEffect(() => {
      form.reset();
      form.setValues(currentForm);
    }, [currentForm]);

    useEffect(() => {
      setPayload({
        ...form.values,
        department_id: departmentId,
        section_id: sectionId,
        roles: form.values.roles,
      });
    }, [form.values, departmentId, sectionId]);

    return (
      <form
        ref={ref}
        onSubmit={form.onSubmit(
          () => handleCreateUpdate && handleCreateUpdate()
        )}
      >
        <Stack>
          {currentData?.id && (
            <Box mb={10}>
              <SingleImageUploadClient
                image={avatar ?? ''}
                postUrl={'/media'}
                params={{ type: 'avatar', parent_id: currentData?.id }}
                height={150}
                type={'avatar'}
                clearImageCache={clearAvatarCache}
              />
            </Box>
          )}

          <TextInput
            size={'sm'}
            label='Employee ID'
            placeholder='Employeee ID'
            value={form.values.employee_id}
            onChange={(event) =>
              form.setFieldValue('employee_id', event.currentTarget.value)
            }
            error={form.errors.username && ''}
            required
          />
          <TextInput
            size={'sm'}
            label='First Name'
            placeholder='Juan'
            value={form.values.firstname}
            onChange={(event) =>
              form.setFieldValue('firstname', event.currentTarget.value)
            }
            error={form.errors.firstname && ''}
            required
          />
          <TextInput
            size={'sm'}
            label='Middle Name'
            placeholder='Middle Name'
            value={form.values.middlename}
            onChange={(event) =>
              form.setFieldValue('middlename', event.currentTarget.value)
            }
            error={form.errors.middlename && ''}
          />
          <TextInput
            size={'sm'}
            label='Last Name'
            placeholder='Last Name'
            value={form.values.lastname}
            onChange={(event) =>
              form.setFieldValue('lastname', event.currentTarget.value)
            }
            error={form.errors.lastname && ''}
            required
          />
          <Select
            size={'sm'}
            label='Sex'
            placeholder='Sex'
            data={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            value={form.values.sex}
            onChange={(_value, option) =>
              form.setFieldValue('sex', option.value)
            }
            searchable
            required
          />
          <DynamicSelect
            endpoint={'/accounts/departments'}
            endpointParams={{
              paginated: false,
              show_all: true,
              show_inactive: true,
            }}
            column={'department_name'}
            label='Department'
            defaultData={
              currentData?.department_id
                ? [
                  {
                    value: currentData.department_id,
                    label:
                      currentData?.department?.department_name ?? '',
                  },
                ]
                : undefined
            }
            value={departmentId}
            size={'sm'}
            onChange={(value) => {
              setDepartmentId(value);
              setSectionId(null);
            }}
            required
          />
          <DynamicSelect
            endpoint={'/accounts/sections'}
            endpointParams={{
              paginated: false,
              show_all: true,
              show_inactive: true,
              filter_by_department: true,
              department_id: departmentId,
            }}
            column={'section_name'}
            label={'Section'}
            placeholder={
              departmentId
                ? 'Section'
                : 'Please select a department first'
            }
            defaultData={
              currentData?.section_id
                ? [
                  {
                    value: currentData?.section_id ?? '',
                    label: currentData?.section?.section_name ?? '',
                  },
                ]
                : undefined
            }
            value={sectionId}
            size={'sm'}
            onChange={(value) => setSectionId(value)}
            readOnly={!departmentId}
          />
          <DynamicAutocomplete
            endpoint={'/accounts/positions'}
            endpointParams={{ paginated: false }}
            column={'position_name'}
            size={'sm'}
            label='Position'
            value={form.values.position}
            onChange={(value) => form.setFieldValue('position', value)}
            required
          />
          <DynamicAutocomplete
            endpoint={'/accounts/designations'}
            endpointParams={{ paginated: false }}
            column={'designation_name'}
            size={'sm'}
            label='Designation'
            value={form.values.designation}
            onChange={(value) => form.setFieldValue('designation', value)}
            required
          />
          <TextInput
            size={'sm'}
            label='Email'
            placeholder={'Email'}
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
            error={form.errors.email && ''}
          />
          <InputBase
            size={'sm'}
            label='Phone'
            component={IMaskInput}
            mask='+630000000000'
            placeholder='+639000000000'
            value={form.values.phone}
            onChange={(event) =>
              form.setFieldValue('phone', event.currentTarget.value)
            }
            error={form.errors.phone && ''}
          />
          <TextInput
            size={'sm'}
            label='Username'
            placeholder='Username'
            value={form.values.username}
            onChange={(event) =>
              form.setFieldValue('username', event.currentTarget.value)
            }
            error={form.errors.username && ''}
            required
          />
          <PasswordInput
            size={'sm'}
            label='Password'
            description={'Fill out to change password'}
            placeholder='******'
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={form.errors.username && ''}
          />
          <DynamicMultiselect
            endpoint={'/accounts/roles'}
            endpointParams={{
              paginated: false,
              show_all: true,
              show_inactive: true,
            }}
            column={'role_name'}
            label='Roles'
            value={form.values.roles}
            size={'sm'}
            onChange={(value) => form.setFieldValue('roles', value)}
            required
          />

          {currentData?.id && (
            <Stack>
              <Text size={'sm'} fw={500}>
                Signature
              </Text>
              <SingleImageUploadClient
                image={currentData?.signature ?? ''}
                postUrl={`/media/${currentData?.id}`}
                params={{ update_type: 'user-signature' }}
                height={150}
                type={'signature'}
              />
            </Stack>
          )}

          <Switch
            label={'Restricted'}
            my={20}
            onLabel='YES'
            offLabel='NO'
            color={'var(--mantine-color-secondary-9)'}
            checked={form.values.restricted}
            labelPosition={'left'}
            fw={500}
            size={'sm'}
            sx={{ cursor: 'pointer' }}
            onChange={(event) =>
              form.setFieldValue('restricted', event.currentTarget.checked)
            }
          />
        </Stack>
      </form>
    );
  }
);

FormClient.displayName = 'FormClient';

export default FormClient;
