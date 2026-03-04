'use client';

import {
  Box,
  Group,
  InputBase,
  Paper,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import DynamicAutocomplete from '../../Generic/DynamicAutocomplete';
import { IMaskInput } from 'react-imask';
import { Switch } from '@mantine/core';
import DynamicSelect from '../../Generic/DynamicSelect';
import DynamicMultiselect from '../../Generic/DynamicMultiselect';
import SingleImageUploadClient from '../../Generic/SingleImageUpload';
import { useMediaAsset } from '@/hooks/useMediaAsset';
import {
  IconBriefcase,
  IconLock,
  IconPencil,
  IconShieldLock,
  IconUser,
} from '@tabler/icons-react';

const SectionHeader = ({
  icon: Icon,
  title,
  color = 'blue',
}: {
  icon: React.FC<any>;
  title: string;
  color?: string;
}) => (
  <Group gap='sm' mb={4}>
    <ThemeIcon variant='light' color={color} size='md' radius='md'>
      <Icon size={16} />
    </ThemeIcon>
    <Text fw={600} size='sm'>
      {title}
    </Text>
  </Group>
);

const FormClient = forwardRef<HTMLFormElement, ModalUserContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const [departmentId, setDepartmentId] = useState<string | null>(
      data?.department?.id ?? null
    );
    const [sectionId, setSectionId] = useState<string | null>(
      data?.section?.id ?? null
    );
    const prevDataId = useRef<string | undefined>(undefined);
    const setPayloadRef = useRef(setPayload);
    setPayloadRef.current = setPayload;
    const departmentIdRef = useRef(departmentId);
    departmentIdRef.current = departmentId;
    const sectionIdRef = useRef(sectionId);
    sectionIdRef.current = sectionId;

    const syncPayload = useCallback((values: Record<string, any>) => {
      setPayloadRef.current?.({
        ...values,
        department_id: departmentIdRef.current,
        section_id: sectionIdRef.current,
        roles: values.roles,
      });
    }, []);

    const form = useForm({
      mode: 'controlled',
      initialValues: {
        employee_id: data?.employee_id ?? '',
        firstname: data?.firstname ?? '',
        middlename: data?.middlename ?? '',
        lastname: data?.lastname ?? '',
        sex: data?.sex ?? '',
        position: data?.position?.position_name ?? '',
        designation: data?.designation?.designation_name ?? '',
        username: data?.username ?? '',
        email: data?.email ?? '',
        phone: data?.phone ?? '',
        restricted: data?.restricted ?? false,
        password: '',
        roles: data?.roles?.map((role: any) => role.id) ?? [],
      },
      onValuesChange: (values) => {
        syncPayload(values);
      },
    });

    const { media: avatar, clearCache: clearAvatarCache } = useMediaAsset({
      type: 'avatar',
      user: data,
    });

    useEffect(() => {
      if (data?.id === prevDataId.current) return;
      prevDataId.current = data?.id;
      setDepartmentId(data?.department?.id ?? null);
      setSectionId(data?.section?.id ?? null);
      form.setValues({
        employee_id: data?.employee_id ?? '',
        firstname: data?.firstname ?? '',
        middlename: data?.middlename ?? '',
        lastname: data?.lastname ?? '',
        sex: data?.sex ?? '',
        position: data?.position?.position_name ?? '',
        designation: data?.designation?.designation_name ?? '',
        username: data?.username ?? '',
        email: data?.email ?? '',
        phone: data?.phone ?? '',
        restricted: data?.restricted ?? false,
        password: '',
        roles: data?.roles?.map((role: any) => role.id) ?? [],
      });
    }, [data?.id]);

    // Sync payload when department/section change (form values don't change for these)
    useEffect(() => {
      syncPayload(form.values);
    }, [departmentId, sectionId]);

    const handleDepartmentChange = useCallback((value: string | null) => {
      setDepartmentId(value);
      setSectionId(null);
    }, []);

    const handleSectionChange = useCallback((value: string | null) => {
      setSectionId(value);
    }, []);

    const handlePositionChange = useCallback(
      (value: string | null) => {
        form.setFieldValue('position', value ?? '');
      },
      [form]
    );

    const handleDesignationChange = useCallback(
      (value: string | null) => {
        form.setFieldValue('designation', value ?? '');
      },
      [form]
    );

    const handleRolesChange = useCallback(
      (value: string[] | null) => {
        form.setFieldValue('roles', value ?? []);
      },
      [form]
    );

    return (
      <form
        ref={ref}
        onSubmit={form.onSubmit(
          () => handleCreateUpdate && handleCreateUpdate()
        )}
      >
        <Stack gap='md'>
          {/* Avatar Section */}
          {data?.id && (
            <Paper
              p='xl'
              radius='lg'
              shadow='xs'
              style={{
                background:
                  'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-grape-0) 100%)',
              }}
            >
              <Stack align='center' gap='xs'>
                <SingleImageUploadClient
                  image={avatar ?? ''}
                  postUrl={'/media'}
                  params={{ type: 'avatar', parent_id: data?.id }}
                  height={100}
                  type={'avatar'}
                  clearImageCache={clearAvatarCache}
                />
                <Text size='xs' c='dimmed' mt={4}>
                  Click to upload avatar
                </Text>
              </Stack>
            </Paper>
          )}

          {/* Personal Information */}
          <Paper p='lg' radius='lg' shadow='xs' withBorder>
            <Stack gap='md'>
              <SectionHeader
                icon={IconUser}
                title='Personal Information'
                color='blue'
              />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='sm'>
                <TextInput
                  size='sm'
                  label='Employee ID'
                  placeholder='e.g. EMP-001'
                  {...form.getInputProps('employee_id')}
                  required
                />
                <Select
                  size='sm'
                  label='Sex'
                  placeholder='Select sex'
                  data={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                  ]}
                  {...form.getInputProps('sex')}
                  searchable
                  required
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing='sm'>
                <TextInput
                  size='sm'
                  label='First Name'
                  placeholder='First Name'
                  {...form.getInputProps('firstname')}
                  required
                />
                <TextInput
                  size='sm'
                  label='Middle Name'
                  placeholder='Middle Name'
                  {...form.getInputProps('middlename')}
                />
                <TextInput
                  size='sm'
                  label='Last Name'
                  placeholder='Last Name'
                  {...form.getInputProps('lastname')}
                  required
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='sm'>
                <TextInput
                  size='sm'
                  label='Email'
                  placeholder='user@example.com'
                  {...form.getInputProps('email')}
                />
                <InputBase
                  size='sm'
                  label='Phone'
                  component={IMaskInput}
                  mask='+630000000000'
                  placeholder='+639000000000'
                  {...form.getInputProps('phone')}
                />
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* Work Information */}
          <Paper p='lg' radius='lg' shadow='xs' withBorder>
            <Stack gap='md'>
              <SectionHeader
                icon={IconBriefcase}
                title='Work Information'
                color='teal'
              />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='sm'>
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
                    data?.department?.id
                      ? [
                          {
                            value: data.department.id,
                            label: data?.department?.department_name ?? '',
                          },
                        ]
                      : undefined
                  }
                  value={departmentId}
                  size='sm'
                  onChange={handleDepartmentChange}
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
                  label='Section'
                  placeholder={
                    departmentId ? 'Section' : 'Select a department first'
                  }
                  defaultData={
                    data?.section?.id
                      ? [
                          {
                            value: data?.section?.id ?? '',
                            label: data?.section?.section_name ?? '',
                          },
                        ]
                      : undefined
                  }
                  value={sectionId}
                  size='sm'
                  onChange={handleSectionChange}
                  readOnly={!departmentId}
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='sm'>
                <DynamicAutocomplete
                  endpoint={'/accounts/positions'}
                  endpointParams={{ paginated: false }}
                  column={'position_name'}
                  size='sm'
                  label='Position'
                  value={form.values.position}
                  onChange={handlePositionChange}
                  required
                />
                <DynamicAutocomplete
                  endpoint={'/accounts/designations'}
                  endpointParams={{ paginated: false }}
                  column={'designation_name'}
                  size='sm'
                  label='Designation'
                  value={form.values.designation}
                  onChange={handleDesignationChange}
                  required
                />
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* Account Credentials */}
          <Paper p='lg' radius='lg' shadow='xs' withBorder>
            <Stack gap='md'>
              <SectionHeader
                icon={IconLock}
                title='Account Credentials'
                color='violet'
              />

              <TextInput
                size='sm'
                label='Username'
                placeholder='Username'
                {...form.getInputProps('username')}
                required
              />
              <PasswordInput
                size='sm'
                label='Password'
                description={data?.id ? 'Fill out to change password' : ''}
                placeholder='******'
                {...form.getInputProps('password')}
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
                size='sm'
                onChange={handleRolesChange}
                required
              />
            </Stack>
          </Paper>

          {/* Signature */}
          {data?.id && (
            <Paper p='lg' radius='lg' shadow='xs' withBorder>
              <Stack gap='md'>
                <SectionHeader
                  icon={IconPencil}
                  title='Signature'
                  color='orange'
                />
                <Box
                  style={{
                    border: '1px dashed var(--mantine-color-gray-4)',
                    borderRadius: 'var(--mantine-radius-md)',
                    padding: 'var(--mantine-spacing-md)',
                  }}
                >
                  <SingleImageUploadClient
                    image={data?.signature ?? ''}
                    postUrl={`/media/${data?.id}`}
                    params={{ update_type: 'user-signature' }}
                    height={120}
                    type={'signature'}
                  />
                </Box>
              </Stack>
            </Paper>
          )}

          {/* Access Settings */}
          <Paper p='lg' radius='lg' shadow='xs' withBorder>
            <Stack gap='md'>
              <SectionHeader
                icon={IconShieldLock}
                title='Access Settings'
                color='red'
              />
              <Paper
                p='md'
                radius='md'
                style={{
                  backgroundColor: 'var(--mantine-color-gray-0)',
                }}
              >
                <Switch
                  label='Restricted'
                  description='Restrict user access to specific modules'
                  onLabel='YES'
                  offLabel='NO'
                  color='var(--mantine-color-secondary-9)'
                  {...form.getInputProps('restricted', { type: 'checkbox' })}
                  labelPosition='left'
                  fw={500}
                  size='md'
                  style={{ cursor: 'pointer' }}
                  styles={{
                    body: { justifyContent: 'space-between' },
                    labelWrapper: { flex: 1 },
                  }}
                />
              </Paper>
            </Stack>
          </Paper>
        </Stack>
      </form>
    );
  }
);

FormClient.displayName = 'FormClient';

export default FormClient;
