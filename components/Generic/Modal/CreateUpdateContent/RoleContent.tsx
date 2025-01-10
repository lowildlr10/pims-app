import {
  Checkbox,
  Divider,
  Paper,
  Stack,
  Switch,
  TextInput,
  Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { useListState } from '@mantine/hooks';

const RoleContentClient = ({
  data,
  handleCreateUpdate,
  setPayload,
}: ModalRoleContentProps) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      role_name: data?.role_name ?? '',
      permissions: JSON.stringify(data?.permissions ?? []),
      active: data?.active ?? false,
    },
  });
  const [trackCheckAll, setTrackCheckAll] = useState<boolean>(true);
  const [permissionFields, handlers] = useListState<PermissionsFieldType>([
    {
      label: 'Purchase Request',
      description: 'Scope for Purchase Request module',
      module: 'pr',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
        {
          label: 'Approve',
          value: 'approve',
          checked: false,
        },
        {
          label: 'Disapprove',
          value: 'disapprove',
          checked: false,
        },
        {
          label: 'Cancel',
          value: 'cancel',
          checked: false,
        },
        {
          label: 'Submit',
          value: 'submit',
          checked: false,
        },
        {
          label: 'Print',
          value: 'print',
          checked: false,
        },
      ],
    },

    {
      label: 'Request for Quotation',
      description: 'Scope for Request for Quotation module',
      module: 'rfq',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
        {
          label: 'Approve',
          value: 'approve',
          checked: false,
        },
        {
          label: 'Issue',
          value: 'issue',
          checked: false,
        },
        {
          label: 'Receive',
          value: 'receive',
          checked: false,
        },
        {
          label: 'Print',
          value: 'print',
          checked: false,
        },
      ],
    },
    {
      label: 'Abstract of Quotation',
      description: 'Scope for Abstract of Quotation module',
      module: 'aoq',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Print',
          value: 'print',
          checked: false,
        },
      ],
    },
    {
      label: 'Purchase Order',
      description: 'Scope for Purchase Order module',
      module: 'po',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Print',
          value: 'print',
          checked: false,
        },
      ],
    },
    {
      label: 'Inspection & Acceptance Report',
      description: 'Scope for Inspection & Acceptance Report module',
      module: 'iar',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Print',
          value: 'print',
          checked: false,
        },
      ],
    },
    {
      label: 'Obligation Request & Status',
      description: 'Scope for Obligation Request & Status module',
      module: 'ors',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Print',
          value: 'print',
          checked: false,
        },
      ],
    },
    {
      label: 'Disbursement Voucher',
      description: 'Scope for Disbursement Voucher module',
      module: 'dv',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Print',
          value: 'print',
          checked: false,
        },
      ],
    },
    {
      label: 'Inventory',
      description: 'Scope for Inventory module',
      module: 'inventory',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Print',
          value: 'print',
          checked: false,
        },
      ],
    },
    {
      label: 'Payment',
      description: 'Scope for Payment module',
      module: 'payment',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Print',
          value: 'print',
          checked: false,
        },
      ],
    },

    // Account management
    {
      label: 'Department Library',
      description: 'Scope for Department Library module',
      module: 'account-department',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },
    {
      label: 'Section Library',
      description: 'Scope for Section Library module',
      module: 'account-section',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },
    {
      label: 'User Management',
      description: 'Scope for User Library module',
      module: 'account-user',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },

    // System libraries
    {
      label: 'Funding Source Library',
      description: 'Scope for Funding Source Library module',
      module: 'lib-fund-source',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },
    {
      label: 'Item Classification Library',
      description: 'Scope for Item Classification Library module',
      module: 'lib-item-class',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },
    {
      label: 'MFO/PAP Library',
      description: 'Scope for MFO/PAP Library module',
      module: 'lib-mfo-pap',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },
    {
      label: 'Mode of Procurement Library',
      description: 'Scope for Mode of Procurement Library module',
      module: 'lib-mode-proc',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },
    {
      label: 'Print Paper Size Library',
      description: 'Scope for Print Paper Size Library module',
      module: 'lib-paper-size',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },
    {
      label: 'Signatory Library',
      description: 'Scope for Signatory Library module',
      module: 'lib-signatory',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },
    {
      label: 'Supplier/Company Library',
      description: 'Scope for Supplier/Company Library module',
      module: 'lib-supplier',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },
    {
      label: 'UACS Code Library',
      description: 'Scope for UACS Code Library module',
      module: 'lib-uacs-code',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },
    {
      label: 'Unit of Issue Library',
      description: 'Scope for Unit of Issue Library module',
      module: 'lib-unit-issue',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'View',
          value: 'view',
          checked: false,
        },
        {
          label: 'Create',
          value: 'create',
          checked: false,
        },
        {
          label: 'Update',
          value: 'update',
          checked: false,
        },
      ],
    },

    // Specific roles
    {
      label: 'Administrator',
      description: 'Scope for Administrator role',
      module: 'super',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'All',
          value: '*',
          checked: false,
        },
      ],
    },
    {
      label: 'Agency Head',
      description: 'Scope for Agency Head role',
      module: 'head',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'All',
          value: '*',
          checked: false,
        },
      ],
    },
    {
      label: 'Supply Officer',
      description: 'Scope for Supply Officer role',
      module: 'supply',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'All',
          value: '*',
          checked: false,
        },
      ],
    },
    {
      label: 'Budget Officer',
      description: 'Scope for Budget Officer role',
      module: 'budget',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'All',
          value: '*',
          checked: false,
        },
      ],
    },
    {
      label: 'Accounting',
      description: 'Scope for Accounting role',
      module: 'accounting',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'All',
          value: '*',
          checked: false,
        },
      ],
    },
    {
      label: 'Cashier',
      description: 'Scope for Cashier role',
      module: 'cashier',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'All',
          value: '*',
          checked: false,
        },
      ],
    },
    {
      label: 'End User',
      description: 'Scope for End User role',
      module: 'user',
      checked: false,
      indeterminate: false,
      scopes: [
        {
          label: 'All',
          value: '*',
          checked: false,
        },
      ],
    },
  ]);

  useEffect(() => {
    if (data?.permissions) {
      data.permissions.forEach((permission) => {
        const [permissionModule, permissionScopes] = permission.split(':');
        const scopes = permissionScopes.split(',');

        handlers.setState((current) =>
          current.map((value) => {
            const isMatchingModule = value.module === permissionModule;
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
  }, [data]);

  useEffect(() => {
    setPayload(form.values);
  }, [form.values]);

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

        if (checked) return `${permission.module}:*`;
        return scopes ? `${permission.module}:${scopes}` : null;
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
                  value.module === permissionModule &&
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
      onSubmit={form.onSubmit(() => handleCreateUpdate && handleCreateUpdate())}
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
              <React.Fragment key={permission.module}>
                <Stack gap={1}>
                  <Checkbox
                    label={permission.label}
                    description={permission.description}
                    checked={permission.checked}
                    indeterminate={permission.indeterminate}
                    name={`${permission.module}`}
                    color={'var(--mantine-color-primary-9)'}
                    onChange={(e) => {
                      handlers.setState((current) =>
                        current.map((value) => ({
                          ...value,
                          checked:
                            e.target.name === value.module
                              ? e.target.checked
                              : value.checked,
                          indeterminate: false,
                          scopes:
                            value.module === permission.module
                              ? value.scopes.map((scope) => ({
                                  ...scope,
                                  checked: !permission.checked,
                                }))
                              : value.scopes,
                        }))
                      );
                    }}
                  />
                  {dynamicScopes(permission.scopes, permission.module)}
                </Stack>
                <Divider />
              </React.Fragment>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </form>
  );
};

export default RoleContentClient;
