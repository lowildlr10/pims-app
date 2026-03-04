import {
  Accordion,
  Badge,
  Box,
  Group,
  Stack,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useForm } from '@mantine/form';
import DynamicSelect from '../../Generic/DynamicSelect';
import DynamicAutocomplete from '../../Generic/DynamicAutocomplete';
import { SIGNATORIES_CONFIG } from '@/config/signatories';
import {
  IconArrowsExchange,
  IconBriefcase,
  IconCash,
  IconClipboardCheck,
  IconClipboardList,
  IconDevices,
  IconFileSearch,
  IconPackage,
  IconReceipt,
  IconScale,
} from '@tabler/icons-react';

const DOCUMENT_META: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  pr: { icon: IconClipboardList, color: 'var(--mantine-color-primary-9)' },
  rfq: { icon: IconFileSearch, color: 'var(--mantine-color-teal-7)' },
  aoq: { icon: IconScale, color: 'var(--mantine-color-violet-6)' },
  po: { icon: IconBriefcase, color: 'var(--mantine-color-orange-6)' },
  iar: { icon: IconClipboardCheck, color: 'var(--mantine-color-green-7)' },
  obr: { icon: IconReceipt, color: 'var(--mantine-color-blue-6)' },
  dv: { icon: IconCash, color: 'var(--mantine-color-yellow-7)' },
  ris: { icon: IconArrowsExchange, color: 'var(--mantine-color-cyan-7)' },
  ics: { icon: IconPackage, color: 'var(--mantine-color-gray-6)' },
  are: { icon: IconDevices, color: 'var(--mantine-color-red-6)' },
};

const buildDetailFields = (
  existing: SignatoryDetailType[] = []
): SignatoryDetailsFieldType[] =>
  SIGNATORIES_CONFIG.map((config) => ({
    ...config,
    details: config.details.map((sub) => {
      const match = existing.find(
        (d) =>
          d.document === config.document &&
          d.signatory_type === sub.signatory_type
      );
      return { ...sub, checked: !!match, position: match?.position ?? '' };
    }),
  }));

const FormClient = forwardRef<HTMLFormElement, ModalSignatoryContentProps>(
  ({ data, handleCreateUpdate, setPayload }, ref) => {
    const form = useForm({
      mode: 'controlled',
      initialValues: {
        user_id: data?.user_id ?? '',
        details: JSON.stringify(data?.details ?? []),
        active: data?.active ?? true,
      },
    });

    const [detailFields, setDetailFields] = useState<
      SignatoryDetailsFieldType[]
    >(() => buildDetailFields(data?.details));

    // Sync form + detail fields when data prop changes (edit mode)
    useEffect(() => {
      if (!data) return;
      form.setValues({
        user_id: data.user_id ?? '',
        active: data.active ?? true,
      });
      setDetailFields(buildDetailFields(data.details));
    }, [data]);

    // Derive details string — no extra state or setState chain needed
    const detailsString = useMemo(() => {
      const details = detailFields.flatMap((d) =>
        d.details
          .filter((sub) => sub.checked)
          .map((sub) => ({
            document: d.document,
            signatory_type: sub.signatory_type,
            position: sub.position,
          }))
      );
      return JSON.stringify(details);
    }, [detailFields]);

    useEffect(() => {
      form.setFieldValue('details', detailsString);
    }, [detailsString]);

    // Keep external payload in sync
    useEffect(() => {
      setPayload(form.values);
    }, [form.values, setPayload]);

    const toggleSubDetail = useCallback(
      (document: string, signatory_type: string, checked: boolean) => {
        setDetailFields((current) =>
          current.map((detail) =>
            detail.document !== document
              ? detail
              : {
                  ...detail,
                  details: detail.details.map((sub) =>
                    sub.signatory_type !== signatory_type
                      ? sub
                      : {
                          ...sub,
                          checked,
                          position: checked ? sub.position : '',
                        }
                  ),
                }
          )
        );
      },
      []
    );

    const updatePosition = useCallback(
      (document: string, signatory_type: string, position: string) => {
        setDetailFields((current) =>
          current.map((detail) =>
            detail.document !== document
              ? detail
              : {
                  ...detail,
                  details: detail.details.map((sub) =>
                    sub.signatory_type !== signatory_type
                      ? sub
                      : { ...sub, position }
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
          {!data?.user_id ? (
            <DynamicSelect
              endpoint={'/accounts/users'}
              endpointParams={{
                paginated: false,
                show_all: true,
                show_inactive: true,
              }}
              column={'fullname'}
              label='Name'
              value={form.values.user_id}
              size={'sm'}
              onChange={(value) => form.setFieldValue('user_id', value ?? '')}
              required
            />
          ) : (
            <TextInput
              label={'Name'}
              placeholder={'None'}
              value={data?.user?.fullname ?? ''}
              size={'sm'}
              readOnly
            />
          )}

          <Switch
            label={'Status'}
            onLabel='Active'
            offLabel='Inactive'
            color={'var(--mantine-color-secondary-9)'}
            checked={form.values.active}
            labelPosition={'left'}
            fw={500}
            size={'sm'}
            onChange={(e) =>
              form.setFieldValue('active', e.currentTarget.checked)
            }
          />

          <Box>
            <Text fw={600} size='sm' mb='xs'>
              Document Assignments
            </Text>

            <Accordion multiple variant='separated'>
              {detailFields.map((detail) => {
                const meta = DOCUMENT_META[detail.document] ?? {
                  icon: IconClipboardList,
                  color: 'var(--mantine-color-gray-6)',
                };
                const activeCount = detail.details.filter(
                  (s) => s.checked
                ).length;

                return (
                  <Accordion.Item key={detail.document} value={detail.document}>
                    <Accordion.Control>
                      <Group gap='sm' wrap='nowrap'>
                        <ThemeIcon
                          color={meta.color}
                          variant='light'
                          size={28}
                          radius='sm'
                          style={{ flexShrink: 0 }}
                        >
                          <meta.icon size={15} />
                        </ThemeIcon>
                        <Box style={{ minWidth: 0 }}>
                          <Group gap='xs' align='center'>
                            <Text size='sm' fw={600}>
                              {detail.label}
                            </Text>
                            {activeCount > 0 && (
                              <Badge
                                size='xs'
                                color='var(--mantine-color-primary-9)'
                                variant='light'
                              >
                                {activeCount}/{detail.details.length}
                              </Badge>
                            )}
                          </Group>
                        </Box>
                      </Group>
                    </Accordion.Control>

                    <Accordion.Panel>
                      <Stack gap='sm'>
                        {detail.details.map((subDetail) => (
                          <Box
                            key={subDetail.signatory_type}
                            p='sm'
                            style={{
                              borderRadius: 6,
                              border: '1px solid var(--mantine-color-gray-2)',
                              background: subDetail.checked
                                ? 'var(--mantine-color-gray-0)'
                                : undefined,
                            }}
                          >
                            <Switch
                              label={subDetail.label}
                              color='var(--mantine-color-primary-9)'
                              size='sm'
                              checked={subDetail.checked}
                              mb={subDetail.checked ? 'xs' : 0}
                              onChange={(e) =>
                                toggleSubDetail(
                                  detail.document,
                                  subDetail.signatory_type,
                                  e.target.checked
                                )
                              }
                            />
                            {subDetail.checked && (
                              <Box ml={26}>
                                <DynamicAutocomplete
                                  endpoint={'/accounts/designations'}
                                  endpointParams={{ paginated: false }}
                                  column={'designation_name'}
                                  size={'sm'}
                                  label={'Designation'}
                                  value={subDetail.position}
                                  onChange={(value) =>
                                    updatePosition(
                                      detail.document,
                                      subDetail.signatory_type,
                                      value
                                    )
                                  }
                                  required
                                />
                              </Box>
                            )}
                          </Box>
                        ))}
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
