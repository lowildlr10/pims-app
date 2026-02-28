import {
  Accordion,
  Badge,
  Box,
  Checkbox,
  Group,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import { PERMISSIONS_CONFIG } from '@/config/permissions';
import {
  IconBriefcase,
  IconBuilding,
  IconBook,
  IconPackage,
  IconShield,
} from '@tabler/icons-react';

type GroupDef = {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  modules: ModuleType[];
};

const PERMISSION_GROUPS: GroupDef[] = [
  {
    id: 'roles',
    label: 'Specific Roles',
    description: 'Pre-defined role-based permission presets',
    icon: IconShield,
    color: 'var(--mantine-color-violet-6)',
    modules: [
      'super',
      'head',
      'supply',
      'budget',
      'accountant',
      'cashier',
      'user',
    ] as ModuleType[],
  },
  {
    id: 'procurement',
    label: 'Procurement',
    description: 'Purchase requests, quotations, orders, and payments',
    icon: IconBriefcase,
    color: 'var(--mantine-color-primary-9)',
    modules: ['pr', 'rfq', 'aoq', 'po', 'iar', 'obr', 'dv'] as ModuleType[],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    description: 'Supply and issuance management',
    icon: IconPackage,
    color: 'var(--mantine-color-teal-7)',
    modules: ['inv-supply', 'inv-issuance'] as ModuleType[],
  },
  {
    id: 'account',
    label: 'Account Management',
    description: 'Users, departments, and sections',
    icon: IconBuilding,
    color: 'var(--mantine-color-orange-6)',
    modules: [
      'account-department',
      'account-section',
      'account-user',
    ] as ModuleType[],
  },
  {
    id: 'libraries',
    label: 'Libraries & Settings',
    description: 'Reference data and system configurations',
    icon: IconBook,
    color: 'var(--mantine-color-gray-6)',
    modules: [
      'lib-account-class',
      'lib-account',
      'lib-bid-committee',
      'lib-fpp',
      'lib-fund-source',
      'lib-item-class',
      'lib-mode-proc',
      'lib-paper-size',
      'lib-responsibility-center',
      'lib-signatory',
      'lib-supplier',
      'lib-unit-issue',
      'company',
      'system-log',
    ] as ModuleType[],
  },
];

const buildPermissionFields = (permissions: string[]): PermissionsFieldType[] =>
  PERMISSIONS_CONFIG.map((value) => {
    const match = permissions.find((p) =>
      p.startsWith(`${value.module_type}:`)
    );
    if (!match)
      return {
        ...value,
        checked: false,
        indeterminate: false,
        scopes: value.scopes.map((s) => ({ ...s, checked: false })),
      };
    const [, scopesRaw] = match.split(':');
    const scopes = scopesRaw ? scopesRaw.split(',') : [];
    const allChecked = scopes.includes('*');
    return {
      ...value,
      checked: allChecked,
      indeterminate: !allChecked && scopes.length > 0,
      scopes: value.scopes.map((s) => ({
        ...s,
        checked: allChecked || scopes.includes(s.value),
      })),
    };
  });

const FormClient = forwardRef<HTMLFormElement, ModalRoleContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const form = useForm({
      mode: 'controlled',
      initialValues: {
        role_name: data?.role_name ?? '',
        permissions: JSON.stringify(data?.permissions ?? []),
        active: data?.active ?? false,
      },
    });

    const [permissionFields, setPermissionFields] = useState<
      PermissionsFieldType[]
    >(() => buildPermissionFields(data?.permissions ?? []));

    // Sync form + permission fields when data prop changes (edit mode)
    useEffect(() => {
      if (!data) return;
      form.setValues({
        role_name: data.role_name ?? '',
        active: data.active ?? false,
      });
      setPermissionFields(buildPermissionFields(data.permissions ?? []));
    }, [data]);

    // Derive permissions string — no extra state or setState call needed
    const permissionsString = useMemo(() => {
      const perms = permissionFields
        .map((p) => {
          const checked = p.scopes.filter((s) => s.checked);
          if (checked.length === 0) return null;
          if (checked.length === p.scopes.length) return `${p.module_type}:*`;
          return `${p.module_type}:${checked.map((s) => s.value).join(',')}`;
        })
        .filter(Boolean) as string[];
      return JSON.stringify(perms);
    }, [permissionFields]);

    useEffect(() => {
      form.setFieldValue('permissions', permissionsString);
    }, [permissionsString]);

    // Keep external payload in sync
    useEffect(() => {
      setPayload(form.values);
    }, [form.values, setPayload]);

    // Derived per-module checkbox states (no separate useState)
    const moduleStates = useMemo(
      () =>
        Object.fromEntries(
          permissionFields.map((p) => {
            const checkedCount = p.scopes.filter((s) => s.checked).length;
            const allChecked = checkedCount === p.scopes.length;
            return [
              p.module_type,
              {
                checked: allChecked,
                indeterminate: checkedCount > 0 && !allChecked,
              },
            ];
          })
        ) as Record<ModuleType, { checked: boolean; indeterminate: boolean }>,
      [permissionFields]
    );

    const toggleModule = useCallback(
      (moduleType: ModuleType, checked: boolean) => {
        setPermissionFields((current) =>
          current.map((p) =>
            p.module_type !== moduleType
              ? p
              : { ...p, scopes: p.scopes.map((s) => ({ ...s, checked })) }
          )
        );
      },
      []
    );

    const toggleScope = useCallback(
      (moduleType: ModuleType, scopeValue: string) => {
        setPermissionFields((current) =>
          current.map((p) =>
            p.module_type !== moduleType
              ? p
              : {
                  ...p,
                  scopes: p.scopes.map((s) =>
                    s.value === scopeValue ? { ...s, checked: !s.checked } : s
                  ),
                }
          )
        );
      },
      []
    );

    return (
      <form ref={ref} onSubmit={form.onSubmit(() => handleCreateUpdate?.())}>
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
            onLabel='Active'
            offLabel='Inactive'
            color='var(--mantine-color-secondary-9)'
            checked={form.values.active}
            labelPosition='left'
            fw={500}
            size='sm'
            onChange={(e) =>
              form.setFieldValue('active', e.currentTarget.checked)
            }
          />

          <Box>
            <Text fw={600} size='sm' mb='xs'>
              Permissions
            </Text>

            <Accordion multiple variant='separated'>
              {PERMISSION_GROUPS.map((group) => {
                const groupModules = permissionFields.filter((p) =>
                  group.modules.includes(p.module_type)
                );
                const activeCount = groupModules.filter((p) => {
                  const s = moduleStates[p.module_type];
                  return s?.checked || s?.indeterminate;
                }).length;

                return (
                  <Accordion.Item key={group.id} value={group.id}>
                    <Accordion.Control>
                      <Group gap='sm' wrap='nowrap'>
                        <ThemeIcon
                          color={group.color}
                          variant='light'
                          size={28}
                          radius='sm'
                          style={{ flexShrink: 0 }}
                        >
                          <group.icon size={15} />
                        </ThemeIcon>
                        <Box style={{ minWidth: 0 }}>
                          <Group gap='xs' align='center'>
                            <Text size='sm' fw={600}>
                              {group.label}
                            </Text>
                            {activeCount > 0 && (
                              <Badge
                                size='xs'
                                color='var(--mantine-color-primary-9)'
                                variant='light'
                              >
                                {activeCount}/{groupModules.length}
                              </Badge>
                            )}
                          </Group>
                          <Text size='xs' c='dimmed'>
                            {group.description}
                          </Text>
                        </Box>
                      </Group>
                    </Accordion.Control>

                    <Accordion.Panel>
                      <Stack gap='sm'>
                        {groupModules.map((permission) => {
                          const state = moduleStates[
                            permission.module_type
                          ] ?? {
                            checked: false,
                            indeterminate: false,
                          };
                          return (
                            <Box
                              key={permission.module_type}
                              p='sm'
                              style={{
                                borderRadius: 6,
                                border: '1px solid var(--mantine-color-gray-2)',
                                background:
                                  state.checked || state.indeterminate
                                    ? 'var(--mantine-color-gray-0)'
                                    : undefined,
                              }}
                            >
                              <Checkbox
                                checked={state.checked}
                                indeterminate={state.indeterminate}
                                label={
                                  <Box>
                                    <Text size='sm' fw={600}>
                                      {permission.label}
                                    </Text>
                                    {permission.description && (
                                      <Text size='xs' c='dimmed'>
                                        {permission.description}
                                      </Text>
                                    )}
                                  </Box>
                                }
                                color='var(--mantine-color-primary-9)'
                                onChange={(e) =>
                                  toggleModule(
                                    permission.module_type,
                                    e.currentTarget.checked
                                  )
                                }
                                mb={permission.scopes.length > 0 ? 'xs' : 0}
                              />
                              {permission.scopes.length > 0 && (
                                <SimpleGrid cols={2} spacing='xs' ml={26}>
                                  {permission.scopes.map((scope) => (
                                    <Checkbox
                                      key={scope.value}
                                      label={scope.label}
                                      checked={scope.checked}
                                      color='var(--mantine-color-primary-9)'
                                      size='sm'
                                      onChange={() =>
                                        toggleScope(
                                          permission.module_type,
                                          scope.value
                                        )
                                      }
                                    />
                                  ))}
                                </SimpleGrid>
                              )}
                            </Box>
                          );
                        })}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Box>
        </Stack>
      </form>
    );
  }
);

FormClient.displayName = 'FormClient';
export default FormClient;
