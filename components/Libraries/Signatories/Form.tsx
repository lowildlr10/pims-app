import { Divider, Paper, Stack, Switch, Text, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import { useListState } from '@mantine/hooks';
import DynamicSelect from '../../Generic/DynamicSelect';
import DynamicAutocomplete from '../../Generic/DynamicAutocomplete';
import { SIGNATORIES_CONFIG } from '@/config/signatories';

const SignatoryContentClient = forwardRef<
  HTMLFormElement,
  ModalSignatoryContentProps
>(({ data, handleCreateUpdate, setPayload }, ref) => {
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(
    () => ({
      user_id: currentData?.user_id ?? '',
      details: JSON.stringify(currentData?.details ?? []),
      active: currentData?.active ?? false,
    }),
    [currentData]
  );
  const form = useForm({
    mode: 'controlled',
    initialValues: currentForm,
  });

  const [detailFields, handlers] =
    useListState<SignatoryDetailsFieldType>(SIGNATORIES_CONFIG);

  useEffect(() => {
    form.setFieldValue(
      'details',
      JSON.stringify(
        detailFields
          .map((detail) =>
            detail.details
              .filter((subDetail) => subDetail.checked)
              .map((subDetail) => ({
                document: detail.document,
                signatory_type: subDetail.signatory_type,
                position: subDetail.position,
              }))
          )
          .flat()
      )
    );
  }, [detailFields]);

  useEffect(() => {
    if (currentData?.details) {
      currentData.details.forEach((detail) => {
        handlers.setState((current) =>
          current.map((value) => {
            const isMatching = value.document === detail.document;

            return {
              ...value,
              details: isMatching
                ? value.details.map((subDetail) => ({
                    ...subDetail,
                    checked:
                      subDetail.signatory_type === detail.signatory_type
                        ? true
                        : subDetail.checked,
                    position:
                      subDetail.signatory_type === detail.signatory_type
                        ? (detail?.position ?? '')
                        : subDetail.position,
                  }))
                : value.details,
            };
          })
        );
      });
    }
  }, [currentData]);

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

  return (
    <form
      ref={ref}
      onSubmit={form.onSubmit(() => handleCreateUpdate && handleCreateUpdate())}
    >
      <Stack>
        <Paper shadow={'xs'} p={'lg'} withBorder>
          <Stack gap={'sm'}>
            <Text fw={500}>Signatory</Text>
            <Divider />

            {!currentData?.user_id ? (
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
                value={currentData?.user?.fullname ?? ''}
                size={'sm'}
                flex={1}
                readOnly
              />
            )}

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
          </Stack>
        </Paper>

        {detailFields.map((detail) => (
          <Paper key={detail.document} shadow={'xs'} p={'lg'} withBorder>
            <Stack gap={'sm'}>
              <Text fw={500}>{detail.label}</Text>
              <Divider />

              {detail.details.map((subDetail) => (
                <Stack key={subDetail.signatory_type} mb={'sm'} pt={'sm'}>
                  <Switch
                    label={subDetail.label}
                    placeholder={
                      subDetail.checked ? subDetail.label : 'Disabled...'
                    }
                    color={'var(--mantine-color-primary-9)'}
                    size={'sm'}
                    checked={subDetail.checked}
                    onChange={(e) =>
                      handlers.setState((current) =>
                        current.map((currentDetail) => ({
                          ...currentDetail,
                          details: currentDetail.details.map(
                            (currentSubDetail) => ({
                              ...currentSubDetail,
                              checked:
                                currentSubDetail.signatory_type ===
                                subDetail.signatory_type
                                  ? e.target.checked
                                  : currentSubDetail.checked,
                              position:
                                currentSubDetail.signatory_type ===
                                subDetail.signatory_type
                                  ? ''
                                  : currentSubDetail.position,
                            })
                          ),
                        }))
                      )
                    }
                  />

                  {subDetail.checked && (
                    <Stack display={!subDetail.checked ? 'none' : undefined}>
                      <DynamicAutocomplete
                        endpoint={'/accounts/designations'}
                        endpointParams={{ paginated: false }}
                        column={'designation_name'}
                        size={'sm'}
                        label={'Designation'}
                        value={subDetail.position}
                        onChange={(value) =>
                          handlers.setState((current) =>
                            current.map((currentDetail) => ({
                              ...currentDetail,
                              details: currentDetail.details.map(
                                (currentSubDetail) => ({
                                  ...currentSubDetail,
                                  position:
                                    currentSubDetail.signatory_type ===
                                    subDetail.signatory_type
                                      ? value
                                      : currentSubDetail.position,
                                })
                              ),
                            }))
                          )
                        }
                        required={subDetail.checked}
                        readOnly={!subDetail.checked}
                      />
                    </Stack>
                  )}
                </Stack>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </form>
  );
});

SignatoryContentClient.displayName = 'SignatoryContentClient';

export default SignatoryContentClient;
