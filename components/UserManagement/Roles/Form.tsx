import {
  Checkbox,
  Divider,
  Paper,
  Stack,
  Switch,
  TextInput,
  Title,
} from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import { useListState } from '@mantine/hooks';
import { PERMISSIONS_CONFIG } from '@/config/permissions';

const FormClient = forwardRef<HTMLFormElement, ModalRoleContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const [currentData, setCurrentData] = useState(data);
    const currentForm = useMemo(
      () => ({
        role_name: currentData?.role_name ?? '',
        permissions: JSON.stringify(currentData?.permissions ?? []),
        active: currentData?.active ?? false,
      }),
      [currentData]
    );
    const form = useForm({
      mode: 'controlled',
      initialValues: currentForm,
    });
    const [trackCheckAll, setTrackCheckAll] = useState<boolean>(true);
    const [permissionFields, handlers] =
      useListState<PermissionsFieldType>(PERMISSIONS_CONFIG);

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

    useEffect(() => {
      if (currentData?.permissions) {
        currentData.permissions.forEach((permission) => {
          const [permissionModule, permissionScopes] = permission.split(':');
          const scopes = permissionScopes.split(',');

          handlers.setState((current) =>
            current.map((value) => {
              const isMatchingModule = value.module_type === permissionModule;
              const isAllScopesSelected =
                isMatchingModule && permissionScopes.includes('*');
              const isIndeterminate =
                isMatchingModule && scopes.length > 0 && !isAllScopesSelected;

              return {
                ...value,
                checked: isAllScopesSelected,
                indeterminate: isIndeterminate,
                scopes: isMatchingModule
                  ? value.scopes.map((scope: ScopeFieldType) => ({
                      ...scope,
                      checked:
                        scopes.includes(scope.value) || isAllScopesSelected,
                    }))
                  : value.scopes,
              };
            })
          );
        });
      }
    }, [currentData]);

    useEffect(() => {
      if (!trackCheckAll) return;

      handlers.setState((current) =>
        current.map((value) => {
          const allChecked = value.scopes.every((value) => value.checked);
          const indeterminate =
            value.scopes.some((value) => value.checked) && !allChecked;

          return {
            ...value,
            checked: allChecked,
            indeterminate: indeterminate,
          };
        })
      );

      setTrackCheckAll(false);
    }, [trackCheckAll, permissionFields]);

    useEffect(() => {
      const permissions = permissionFields
        .map((permission) => {
          const checked = permission.scopes.every((scope) => scope.checked);
          const scopes = permission.scopes
            .filter((scope) => scope.checked && scope.value)
            .map((scope) => scope.value)
            .join(',');

          if (checked) return `${permission.module_type}:*`;
          return scopes ? `${permission.module_type}:${scopes}` : null;
        })
        .filter(Boolean);

      form.setFieldValue(
        'permissions',
        JSON.stringify((permissions as string[]) ?? [])
      );
    }, [permissionFields]);

    const dynamicScopes = (
      scopes: ScopeFieldType[],
      permissionModule: ModuleType
    ) => {
      return scopes.map((scope) => (
        <Checkbox
          mt='xs'
          ml={33}
          label={scope.label}
          name={`${permissionModule}.${scope.value}`}
          color={'var(--mantine-color-primary-9)'}
          key={scope.value}
          checked={scope.checked}
          onChange={(e) => {
            handlers.setState((current) =>
              current.map((value) => ({
                ...value,
                scopes: value.scopes.map((scope) => ({
                  ...scope,
                  checked:
                    value.module_type === permissionModule &&
                    `${permissionModule}.${scope.value}` === e.target.name
                      ? !scope.checked
                      : scope.checked,
                })),
              }))
            );

            setTrackCheckAll(true);
          }}
        />
      ));
    };

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
            onChange={(event) =>
              form.setFieldValue('role_name', event.currentTarget.value)
            }
            error={form.errors.role_name && ''}
            size={'sm'}
            required
          />

          <Switch
            label={'Status'}
            mb={20}
            onLabel='Active'
            offLabel='Inactive'
            color={'var(--mantine-color-secondary-9)'}
            checked={form.values.active}
            labelPosition={'left'}
            fw={500}
            size={'sm'}
            sx={{ cursor: 'pointer' }}
            onChange={(event) =>
              form.setFieldValue('active', event.currentTarget.checked)
            }
          />

          <Paper shadow={'xs'} p={'lg'} withBorder>
            <Stack>
              <Title order={4} ta={'center'}>
                Permissions
              </Title>
              <Divider />

              {permissionFields.map((permission) => (
                <React.Fragment key={permission.module_type}>
                  <Stack gap={1}>
                    <Checkbox
                      label={permission.label}
                      description={permission.description}
                      checked={permission.checked}
                      indeterminate={permission.indeterminate}
                      name={`${permission.module_type}`}
                      color={'var(--mantine-color-primary-9)'}
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
                                ? value.scopes.map((scope) => ({
                                    ...scope,
                                    checked: !permission.checked,
                                  }))
                                : value.scopes,
                          }))
                        );
                      }}
                    />
                    {dynamicScopes(permission.scopes, permission.module_type)}
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
