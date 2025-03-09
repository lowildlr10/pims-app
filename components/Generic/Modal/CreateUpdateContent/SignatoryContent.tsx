import { Divider, Paper, Stack, Switch, Text, TextInput } from '@mantine/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import { useListState } from '@mantine/hooks';
import DynamicSelect from '../../DynamicSelect';
import DynamicAutocomplete from '../../DynamicAutocomplete';

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

  const [detailFields, handlers] = useListState<SignatoryDetailsFieldType>([
    {
      document: 'pr',
      label: 'Purchase Request Document',
      details: [
        {
          checked: false,
          label: 'Cash Availability',
          signatory_type: 'cash_availability',
          position: '',
        },
        {
          checked: false,
          label: 'Approved By',
          signatory_type: 'approved_by',
          position: '',
        },
      ],
    },
    {
      document: 'rfq',
      label: 'Request for Quotation Document',
      details: [
        {
          checked: false,
          label: 'Approval',
          signatory_type: 'approval',
          position: '',
        },
      ],
    },
    {
      document: 'aoq',
      label: 'Abstract of Bids or Quotation Document',
      details: [
        {
          checked: false,
          label: 'BAC-TWG Chairperson',
          signatory_type: 'twg_chairperson',
          position: '',
        },
        {
          checked: false,
          label: 'TWG Member',
          signatory_type: 'twg_member',
          position: '',
        },
        {
          checked: false,
          label: 'Chairman & Presiding Officer',
          signatory_type: 'chairman',
          position: '',
        },
        {
          checked: false,
          label: 'Vice Chairman',
          signatory_type: 'vice_chairman',
          position: '',
        },
        {
          checked: false,
          label: 'Member',
          signatory_type: 'member',
          position: '',
        },
      ],
    },
    {
      document: 'po',
      label: 'Purchase/Job Order Document',
      details: [
        {
          checked: false,
          label: 'Authorized Official',
          signatory_type: 'authorized_official',
          position: '',
        },
      ],
    },
    {
      document: 'iar',
      label: 'Inspection and Acceptance Report Document',
      details: [
        {
          checked: false,
          label: 'Inspection',
          signatory_type: 'inspection',
          position: '',
        },
        {
          checked: false,
          label: 'Acceptance',
          signatory_type: 'acceptance',
          position: '',
        },
      ],
    },
    {
      document: 'ris',
      label: 'Requisition and Issue Slip Document',
      details: [
        {
          checked: false,
          label: 'Approved By',
          signatory_type: 'approved_by',
          position: '',
        },
        {
          checked: false,
          label: 'Issued By',
          signatory_type: 'issued_by',
          position: '',
        },
      ],
    },
    {
      document: 'ics',
      label: 'Inventory Custodian Slip Document',
      details: [
        {
          checked: false,
          label: 'Received From',
          signatory_type: 'received_from',
          position: '',
        },
      ],
    },
    {
      document: 'are',
      label: 'Acknowledgement Receipt for Equipment Document',
      details: [
        {
          checked: false,
          label: 'Received From',
          signatory_type: 'received_from',
          position: '',
        },
      ],
    },
  ]);

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
                onChange={(value) => form.setFieldValue('user_id', value)}
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
