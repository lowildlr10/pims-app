import {
  Checkbox,
  Divider,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import { useListState } from '@mantine/hooks';
import { PERMISSIONS_CONFIG } from '@/config/permissions';

type CheckboxState = {
  checked: boolean;
  indeterminate: boolean;
};

type PermissionCheckboxProps = {
  permission: PermissionsFieldType;
  state: CheckboxState;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PermissionCheckbox = ({
  permission,
  state,
  onChange,
}: PermissionCheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = state.indeterminate;
    }
  }, [state.indeterminate]);

  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
      <input
        ref={inputRef}
        type='checkbox'
        checked={state.checked}
        name={permission.module_type}
        onChange={onChange}
        style={{
          width: 19,
          height: 19,
          borderRadius: '10em',
          accentColor: 'var(--mantine-color-primary-9)',
          cursor: 'pointer',
          border: '1px solid var(--mantine-color-gray-4)',
        }}
      />

      <div>
        <Text fw={500}>{permission.label}</Text>
        {permission.description && (
          <Text size='sm' c='dimmed'>
            {permission.description}
          </Text>
        )}
      </div>
    </label>
  );
};

const FormClient = forwardRef<HTMLFormElement, ModalRoleContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const [moduleCheckboxStates, setModuleCheckboxStates] = useState<
      Record<number, { checked: boolean; indeterminate: boolean }>
    >({});

    // init form directly from props
    const form = useForm({
      mode: 'controlled',
      initialValues: {
        role_name: data?.role_name ?? '',
        permissions: JSON.stringify(data?.permissions ?? []),
        active: data?.active ?? false,
      },
    });

    // permissions state
    const [permissionFields, handlers] =
      useListState<PermissionsFieldType>(PERMISSIONS_CONFIG);

    // sync form when `data` changes
    useEffect(() => {
      if (!data) return;

      const newStates: Record<
        number,
        { checked: boolean; indeterminate: boolean }
      > = {};

      form.setValues({
        role_name: data.role_name ?? '',
        permissions: JSON.stringify(data.permissions ?? []),
        active: data.active ?? false,
      });

      handlers.setState(
        PERMISSIONS_CONFIG.map((value, index) => {
          const match = (data.permissions ?? []).find((p) =>
            p.startsWith(`${value.module_type}:`)
          );
          if (!match) {
            newStates[index] = { checked: false, indeterminate: false };
            return { ...value, checked: false, indeterminate: false };
          }

          const [, scopesRaw] = match.split(':');
          const scopes = scopesRaw ? scopesRaw.split(',') : [];
          const allChecked = scopes.includes('*');
          const indeterminate = !allChecked && scopes.length > 0;

          newStates[index] = { checked: allChecked, indeterminate };

          return {
            ...value,
            checked: allChecked,
            indeterminate: !allChecked && scopes.length > 0,
            scopes: value.scopes.map((s) => ({
              ...s,
              checked: allChecked || scopes.includes(s.value),
            })),
          };
        })
      );

      setModuleCheckboxStates(newStates);
    }, [data]);

    // keep external payload in sync
    useEffect(() => {
      setPayload(form.values);
    }, [form.values, setPayload]);

    // recompute `permissions` when checkboxes change
    useEffect(() => {
      const newStates: Record<
        number,
        { checked: boolean; indeterminate: boolean }
      > = {};

      const permissions = permissionFields
        .map((permission, index) => {
          const checkedScopes = permission.scopes.filter((s) => s.checked);
          const allChecked = permission.scopes.every((p) => p.checked);
          const indeterminate = !allChecked && checkedScopes.length > 0;
          const scopes = permission.scopes
            .filter((s) => s.checked)
            .map((s) => s.value)
            .join(',');

          newStates[index] = { checked: allChecked, indeterminate };

          if (allChecked) return `${permission.module_type}:*`;
          return scopes ? `${permission.module_type}:${scopes}` : null;
        })
        .filter(Boolean);

      form.setFieldValue('permissions', JSON.stringify(permissions));
      setModuleCheckboxStates(newStates);
    }, [permissionFields]);

    useEffect(
      () => console.log(moduleCheckboxStates?.[0]),
      [moduleCheckboxStates]
    );

    // render scope checkboxes
    const renderScopes = (scopes: ScopeFieldType[], module: ModuleType) =>
      scopes.map((scope) => (
        <Checkbox
          key={scope.value}
          mt='xs'
          ml={33}
          label={scope.label}
          name={`${module}.${scope.value}`}
          color='var(--mantine-color-primary-9)'
          checked={scope.checked}
          onChange={(e) => {
            handlers.setState((current) =>
              current.map((value) => ({
                ...value,
                scopes: value.scopes.map((s) => ({
                  ...s,
                  checked:
                    value.module_type === module &&
                    `${module}.${s.value}` === e.target.name
                      ? !s.checked
                      : s.checked,
                })),
              }))
            );
          }}
        />
      ));

    return (
      <form
        ref={ref}
        onSubmit={form.onSubmit(
          () => handleCreateUpdate && handleCreateUpdate()
        )}
      >
        <Stack>
          <TextInput
            label='Role Name'
            placeholder='Role Name'
            value={form.values.role_name}
            onChange={(e) =>
              form.setFieldValue('role_name', e.currentTarget.value)
            }
            error={form.errors.role_name && ''}
            size='sm'
            required
          />

          <Switch
            label='Status'
            mb={20}
            onLabel='Active'
            offLabel='Inactive'
            color='var(--mantine-color-secondary-9)'
            checked={form.values.active}
            labelPosition='left'
            fw={500}
            size='sm'
            sx={{ cursor: 'pointer' }}
            onChange={(e) =>
              form.setFieldValue('active', e.currentTarget.checked)
            }
          />

          <Paper shadow='xs' p='lg' withBorder>
            <Stack>
              <Title order={4} ta='center'>
                Permissions
              </Title>
              <Divider />

              {permissionFields.map((permission, index) => (
                <React.Fragment key={permission.module_type}>
                  <Stack gap={1}>
                    <PermissionCheckbox
                      permission={permission}
                      state={
                        moduleCheckboxStates[index] ?? {
                          checked: false,
                          indeterminate: false,
                        }
                      }
                      onChange={(e) => {
                        handlers.setState((current) =>
                          current.map((value) => ({
                            ...value,
                            checked:
                              e.target.name === value.module_type
                                ? e.target.checked
                                : value.checked,
                            indeterminate: false,
                            scopes:
                              value.module_type === permission.module_type
                                ? value.scopes.map((s) => ({
                                    ...s,
                                    checked: e.target.checked,
                                  }))
                                : value.scopes,
                          }))
                        );
                      }}
                    />
                    {renderScopes(permission.scopes, permission.module_type)}
                  </Stack>
                  <Divider />
                </React.Fragment>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </form>
    );
  }
);

FormClient.displayName = 'FormClient';
export default FormClient;
