import {
  ActionIcon,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import React, { forwardRef, ReactNode, useEffect, useState } from 'react';
import DynamicSelect from '../../DynamicSelect';
import { useForm } from '@mantine/form';
import { randomId, useMediaQuery } from '@mantine/hooks';
import { Button } from '@mantine/core';
import { IconAsterisk, IconPlus, IconTrash } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import { Loader } from '@mantine/core';

const itemHeaders: PurchaseRequestItemHeader[] = [
  {
    id: 'quantity',
    label: 'QTY',
    width: '12%',
    required: true,
  },
  {
    id: 'unit_issue',
    label: 'Unit of Issue',
    width: '11%',
    required: true,
  },
  {
    id: 'description',
    label: 'Description',
    width: '33%',
    required: true,
  },
  {
    id: 'stock_no',
    label: 'Stock No',
    width: '11%',
  },
  {
    id: 'estimated_unit_cost',
    label: 'Estimated Unit Cost',
    width: '16%',
    required: true,
  },
  {
    id: 'estimated_cost',
    label: 'Estimated Cost',
    width: '16%',
    required: true,
  },
  {
    id: 'delete',
    label: '',
    width: '2%',
  },
];

const PurchaseRequestContentClient = forwardRef<
  HTMLFormElement,
  ModalPurchaseRequestContentProps
>(({ data, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      section_id: data?.section_id ?? '',
      pr_date: data?.pr_date ?? dayjs().format('YYYY-MM-DD'),
      sai_no: data?.sai_no ?? '',
      sai_date: data?.sai_date ?? '',
      alobs_no: data?.alobs_no ?? '',
      alobs_date: data?.alobs_date ?? '',
      funding_source_id: data?.funding_source_id ?? '',
      purpose: data?.purpose ?? '',
      requested_by_id: data?.requested_by_id ?? '',
      sig_cash_availability_id: data?.sig_cash_availability_id ?? '',
      sig_approved_by_id: data?.sig_approved_by_id ?? '',
      items:
        data?.items &&
        typeof data?.items !== undefined &&
        data?.items.length > 0
          ? data?.items?.map((item, index) => ({
              key: randomId(),
              quantity: item.quantity,
              unit_issue_id: item.unit_issue_id,
              description: item.description,
              stock_no: item.stock_no,
              estimated_unit_cost: item.estimated_unit_cost,
              estimated_cost: item.estimated_cost,
            }))
          : [
              {
                key: randomId(),
                quantity: undefined,
                unit_issue_id: undefined,
                description: undefined,
                stock_no: 1,
                estimated_unit_cost: undefined,
                estimated_cost: undefined,
              },
            ],
    },
  });
  const [location, setLocation] = useState('Loading...');
  const [companyType, setCompanyType] = useState('Loading...');
  const [department, setDepartment] = useState('Loading...');
  const [unitIssues, setUnitIssues] = useState<string[]>([]);
  const [loadingUnitIssues, setLoadingUnitIssues] = useState(false);
  const [unitIssueData, setUnitIssueData] = useState<
    {
      value: string;
      label: string;
    }[]
  >();

  useEffect(() => {
    handleFetchUnitIssueData();
  }, []);

  useEffect(() => {
    if (!data?.items || data?.items.length === 0) return;

    setUnitIssues(data?.items.map((item) => item.unit_issue?.unit_name ?? '-'));
  }, [data?.items]);

  const handleFetchUnitIssueData = () => {
    setLoadingUnitIssues(true);

    API.get('/libraries/unit-issues', {
      paginated: false,
      show_all: true,
      sort_direction: 'asc',
    })
      .then((res) => {
        setUnitIssueData(
          res?.data?.length > 0
            ? res.data.map((item: any) => ({
                value: item['id'],
                label: item['unit_name'],
              }))
            : [{ label: 'No data.', value: '' }]
        );
        setLoadingUnitIssues(false);
      })
      .catch((err) => {
        const errors = getErrors(err);

        errors.forEach((error) => {
          notify({
            title: 'Failed',
            message: error,
            color: 'red',
          });
        });

        setLoadingUnitIssues(false);
      });
  };

  useEffect(() => {
    API.get('/companies')
      .then((res) => {
        const company: CompanyType = res?.data?.company;
        setLocation(
          `${company?.municipality}, ${company?.province}`.toUpperCase()
        );
        setCompanyType(company?.company_type ?? '');
        setDepartment(company?.company_name ?? '');
      })
      .catch((err) => {
        const errors = getErrors(err);

        errors.forEach((error) => {
          notify({
            title: 'Failed',
            message: error,
            color: 'red',
          });
        });
      });
  }, []);

  const renderDynamicTdContent = (
    id: string,
    item: PurchaseRequestItemsFieldType,
    index: number
  ): ReactNode => {
    switch (id) {
      case 'quantity':
        return (
          <Table.Td>
            <NumberInput
              key={form.key(`items.${index}.quantity`)}
              {...form.getInputProps(`items.${index}.quantity`)}
              variant={'unstyled'}
              placeholder={`Quantity ${
                item?.quantity?.toString() !== ''
                  ? `: ${item?.quantity?.toString()}`
                  : ''
              }`}
              defaultValue={item?.quantity}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              clampBehavior={'strict'}
              allowDecimal={false}
              required={!readOnly}
              readOnly={readOnly}
            />
          </Table.Td>
        );

      case 'unit_issue':
        return (
          <Table.Td>
            {!readOnly ? (
              <DynamicSelect
                key={form.key(`items.${index}.unit_issue_id`)}
                {...form.getInputProps(`items.${index}.unit_issue_id`)}
                variant={'unstyled'}
                placeholder={'Unit of Issue'}
                endpoint={'/libraries/unit-issues'}
                endpointParams={{ paginated: false, show_all: true }}
                column={'unit_name'}
                defaultData={
                  unitIssueData ??
                  (item?.unit_issue_id
                    ? [
                        {
                          value: item?.unit_issue_id,
                          label: unitIssues[index],
                        },
                      ]
                    : undefined)
                }
                value={item?.unit_issue_id}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                required={!readOnly}
                readOnly={readOnly}
                disableFetch
                isLoading={loadingUnitIssues}
              />
            ) : (
              <TextInput
                variant={'unstyled'}
                placeholder={'None'}
                defaultValue={unitIssues[index]}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                readOnly
              />
            )}
          </Table.Td>
        );

      case 'description':
        return (
          <Table.Td>
            <Textarea
              key={form.key(`items.${index}.description`)}
              {...form.getInputProps(`items.${index}.description`)}
              variant={'unstyled'}
              placeholder={
                item?.description?.trim() === '' || !item?.description?.trim()
                  ? 'Description'
                  : item?.description?.trim()
              }
              defaultValue={item?.description}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              autosize
              required={!readOnly}
              readOnly={readOnly}
            />
          </Table.Td>
        );

      case 'stock_no':
        return (
          <Table.Td>
            <NumberInput
              key={form.key(`items.${index}.stock_no`)}
              {...form.getInputProps(`items.${index}.stock_no`)}
              variant={'unstyled'}
              placeholder={`Stock No ${
                item?.stock_no?.toString() !== ''
                  ? `: ${item?.stock_no?.toString()}`
                  : ''
              }`}
              defaultValue={item?.stock_no}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              clampBehavior={'strict'}
              allowDecimal={false}
              required={!readOnly}
              readOnly={readOnly}
            />
          </Table.Td>
        );

      case 'estimated_unit_cost':
        return (
          <Table.Td>
            <NumberInput
              key={form.key(`items.${index}.estimated_unit_cost`)}
              {...form.getInputProps(`items.${index}.estimated_unit_cost`)}
              variant={'unstyled'}
              placeholder={`Estimated Unit Cost ${
                item?.estimated_unit_cost?.toString() !== ''
                  ? `: ${item?.estimated_unit_cost?.toString()}`
                  : ''
              }`}
              defaultValue={item?.estimated_unit_cost}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              clampBehavior={'strict'}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator={','}
              required={!readOnly}
              readOnly={readOnly}
            />
          </Table.Td>
        );

      case 'estimated_cost':
        return (
          <Table.Td>
            <NumberInput
              key={form.key(`items.${index}.estimated_cost`)}
              {...form.getInputProps(`items.${index}.estimated_cost`)}
              variant={'unstyled'}
              placeholder={`Estimated Cost ${
                item?.estimated_cost?.toString() !== ''
                  ? `: ${item?.estimated_cost?.toString()}`
                  : ''
              }`}
              defaultValue={item?.estimated_cost}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              clampBehavior={'strict'}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator={','}
              required={!readOnly}
              readOnly={readOnly}
            />
          </Table.Td>
        );

      default:
        return <></>;
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={form.onSubmit((values) => {
        if (handleCreateUpdate) {
          handleCreateUpdate({
            ...values,
            pr_date: values.pr_date
              ? dayjs(values.pr_date).format('YYYY-MM-DD')
              : '',
            sai_date: values.sai_date
              ? dayjs(values.sai_date).format('YYYY-MM-DD')
              : '',
            alobs_date: values.alobs_date
              ? dayjs(values.alobs_date).format('YYYY-MM-DD')
              : '',
            items: JSON.stringify(values.items),
          });
        }
      })}
    >
      <Stack
        bd={'1px solid var(--mantine-color-gray-8)'}
        justify={'center'}
        gap={0}
      >
        <Stack
          bd={'1px solid var(--mantine-color-gray-8)'}
          justify={'center'}
          align={'center'}
          pt={'lg'}
          pb={'sm'}
          gap={1}
        >
          <Text fz={lgScreenAndBelow ? 'h4' : 'h3'} fw={600}>
            Purchase Request
          </Text>
          <Text fz={lgScreenAndBelow ? 'h6' : 'h5'} fw={600} td={'underline'}>
            {location}
          </Text>
          <Text fz={lgScreenAndBelow ? 'h6' : 'h5'} fw={600}>
            {companyType}
          </Text>
        </Stack>
        <Group
          w={'100%'}
          justify={'center'}
          align={'flex-start'}
          gap={0}
          bd={'1px solid var(--mantine-color-gray-8)'}
        >
          <Stack p={'md'} flex={0.35}>
            <Group>
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Department:</Text>
              <TextInput
                variant={'unstyled'}
                placeholder={'Loading...'}
                value={department}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                leftSection={!department ? <Loader size={16} /> : undefined}
                readOnly
              />
            </Group>
            <Group>
              <Group gap={1} align={'flex-start'}>
                <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Section:</Text>
                {!readOnly && (
                  <Stack>
                    <IconAsterisk
                      size={7}
                      color={'var(--mantine-color-red-8)'}
                      stroke={2}
                    />
                  </Stack>
                )}
              </Group>
              <Stack justify={'center'} flex={1}>
                {!readOnly ? (
                  <DynamicSelect
                    key={form.key('section_id')}
                    {...form.getInputProps('section_id')}
                    variant={'unstyled'}
                    endpoint={'/accounts/sections'}
                    endpointParams={{ paginated: false }}
                    column={'section_name'}
                    defaultData={
                      data?.section_id
                        ? [
                            {
                              value: data?.section_id ?? '',
                              label: data?.section_name ?? '',
                            },
                          ]
                        : undefined
                    }
                    value={form.values.section_id}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    placeholder={'Select a section...'}
                    required={!readOnly}
                    readOnly={readOnly}
                  />
                ) : (
                  <TextInput
                    variant={'unstyled'}
                    placeholder={'None'}
                    defaultValue={data?.section_name ?? '-'}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    flex={1}
                    readOnly
                  />
                )}
              </Stack>
            </Group>
          </Stack>

          <Stack
            p={'md'}
            flex={0.65}
            sx={{ borderLeft: '1px solid var(--mantine-color-gray-8)' }}
          >
            <Group>
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>PR No.</Text>
              <TextInput
                variant={'unstyled'}
                placeholder={'Autogenerated'}
                defaultValue={data?.pr_no ?? 'Auto-generated'}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                readOnly
              />
              <Group gap={1} align={'flex-start'}>
                <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Date:</Text>
                {!readOnly && (
                  <Stack>
                    <IconAsterisk
                      size={7}
                      color={'var(--mantine-color-red-8)'}
                      stroke={2}
                    />
                  </Stack>
                )}
              </Group>
              <DateInput
                key={form.key('pr_date')}
                {...form.getInputProps('pr_date')}
                variant={'unstyled'}
                valueFormat={'YYYY-MM-DD'}
                defaultValue={
                  form.values.pr_date
                    ? new Date(form.values?.pr_date)
                    : undefined
                }
                placeholder={'Enter the PR Date here...'}
                error={form.errors.pr_date && ''}
                flex={1}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                clearable
                required={!readOnly}
                readOnly={readOnly}
              />
            </Group>
            <Group>
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>SAI No.</Text>
              <TextInput
                key={form.key('sai_no')}
                {...form.getInputProps('sai_no')}
                variant={'unstyled'}
                placeholder={
                  !readOnly ? 'Enter the SAI number here...' : 'None'
                }
                defaultValue={form.values.sai_no}
                error={form.errors.sai_no && ''}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                readOnly={readOnly}
              />
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Date:</Text>
              <DateInput
                key={form.key('sai_date')}
                {...form.getInputProps('sai_date')}
                variant={'unstyled'}
                valueFormat={'YYYY-MM-DD'}
                defaultValue={
                  form.values.sai_date
                    ? new Date(form.values?.sai_date)
                    : undefined
                }
                placeholder={!readOnly ? 'Enter the SAI date here...' : 'None'}
                error={form.errors.sai_date && ''}
                flex={1}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                clearable
                readOnly={readOnly}
              />
            </Group>
            <Group>
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>ALOBS No.</Text>
              <TextInput
                key={form.key('alobs_no')}
                {...form.getInputProps('alobs_no')}
                variant={'unstyled'}
                placeholder={
                  !readOnly ? 'Enter the ALOBS number here...' : 'None'
                }
                defaultValue={form.values.alobs_no}
                error={form.errors.alobs_no && ''}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                readOnly={readOnly}
              />
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Date:</Text>
              <DateInput
                key={form.key('alobs_date')}
                {...form.getInputProps('alobs_date')}
                variant={'unstyled'}
                valueFormat={'YYYY-MM-DD'}
                defaultValue={
                  form.values.alobs_date
                    ? new Date(form.values?.alobs_date)
                    : undefined
                }
                placeholder={
                  !readOnly ? 'Enter the ALOBS date here...' : 'None'
                }
                error={form.errors.alobs_date && ''}
                flex={1}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                clearable
                readOnly={readOnly}
              />
            </Group>
          </Stack>
        </Group>

        {(readOnly ||
          ['', 'draft', 'disapproved'].includes(data?.status ?? '')) && (
          <Stack>
            <Table
              withColumnBorders
              withRowBorders
              verticalSpacing={'sm'}
              withTableBorder
              m={0}
              borderColor={'var(--mantine-color-gray-8)'}
            >
              <Table.Thead>
                <Table.Tr>
                  {itemHeaders.map((header) => {
                    if (readOnly && header.id === 'delete') return;

                    if (!readOnly && header.id === 'estimated_cost') return;

                    return (
                      <Table.Th
                        key={header.id}
                        w={header?.width ?? undefined}
                        fz={lgScreenAndBelow ? 'sm' : 'md'}
                      >
                        <Group gap={1} align={'flex-start'}>
                          {header.label}{' '}
                          {header?.required && !readOnly && (
                            <Stack>
                              <IconAsterisk
                                size={7}
                                color={'var(--mantine-color-red-8)'}
                                stroke={2}
                              />
                            </Stack>
                          )}
                        </Group>
                      </Table.Th>
                    );
                  })}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {form.getValues().items.map((item, index) => (
                  <Table.Tr
                    key={`item-${item.key}`}
                    sx={{ verticalAlign: 'top' }}
                  >
                    {itemHeaders.map((header) => {
                      if (
                        header.id === 'delete' ||
                        (!readOnly && header.id === 'estimated_cost')
                      ) {
                        return null;
                      }

                      return (
                        <React.Fragment key={`field-${item.key}-${header.id}`}>
                          {renderDynamicTdContent(header.id, item, index)}
                        </React.Fragment>
                      );
                    })}

                    {!readOnly && (
                      <Table.Td>
                        <ActionIcon
                          w={'100%'}
                          color={'var(--mantine-color-red-7)'}
                          variant={'light'}
                          disabled={form.getValues().items.length === 1}
                          onClick={() => {
                            if (form.getValues().items.length === 1) return;
                            form.removeListItem('items', index);
                          }}
                        >
                          <IconTrash size={18} stroke={2} />
                        </ActionIcon>
                      </Table.Td>
                    )}
                  </Table.Tr>
                ))}
              </Table.Tbody>

              {!readOnly && (
                <Table.Tfoot>
                  <Table.Tr>
                    <Table.Td colSpan={readOnly ? 7 : 6}>
                      <Button
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        variant={'light'}
                        color={'var(--mantine-color-primary-9)'}
                        leftSection={<IconPlus size={18} stroke={2} />}
                        onClick={() =>
                          form.insertListItem('items', {
                            key: randomId(),
                            quantity: undefined,
                            unit_issue_id: undefined,
                            description: undefined,
                            stock_no:
                              (form.getValues().items[
                                form.getValues().items.length - 1
                              ]?.stock_no ?? 1) + 1,
                            estimated_unit_cost: undefined,
                            estimated_cost: undefined,
                          })
                        }
                        fullWidth
                      >
                        Add Item
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tfoot>
              )}
            </Table>
          </Stack>
        )}

        <Group
          align={'flex-start'}
          bd={'1px solid var(--mantine-color-gray-8)'}
          p={'md'}
          grow
        >
          <Textarea
            key={form.key('purpose')}
            {...form.getInputProps('purpose')}
            variant={'unstyled'}
            label={'Purpose'}
            placeholder={'Enter the purpose here...'}
            defaultValue={form.values.purpose}
            error={form.errors.purpose && ''}
            size={lgScreenAndBelow ? 'sm' : 'md'}
            autosize
            autoCapitalize={'sentences'}
            required={!readOnly}
            readOnly={readOnly}
          />

          {!readOnly ? (
            <DynamicSelect
              key={form.key('funding_source_id')}
              {...form.getInputProps('funding_source_id')}
              variant={'unstyled'}
              label={'Funding Source / Project'}
              placeholder={
                !readOnly ? 'Select a funding source or project...' : 'None'
              }
              endpoint={'/libraries/funding-sources'}
              endpointParams={{ paginated: false }}
              column={'title'}
              defaultData={
                data?.funding_source_id
                  ? [
                      {
                        value: data?.funding_source_id ?? '',
                        label: data?.funding_source_title ?? '',
                      },
                    ]
                  : undefined
              }
              value={form.values.funding_source_id}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              readOnly={readOnly}
            />
          ) : (
            <TextInput
              label={'Funding Source / Project'}
              variant={'unstyled'}
              placeholder={'None'}
              defaultValue={data?.funding_source_title ?? '-'}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              flex={1}
              readOnly
            />
          )}
        </Group>

        <Group align={'flex-start'} gap={0} grow>
          <Stack bd={'1px solid var(--mantine-color-gray-8)'} p={'md'}>
            {!readOnly ? (
              <DynamicSelect
                key={form.key('requested_by_id')}
                {...form.getInputProps('requested_by_id')}
                variant={'unstyled'}
                label={'Requested By'}
                placeholder={'Select a requestor...'}
                endpoint={'/accounts/users'}
                endpointParams={{
                  paginated: false,
                  show_all: true,
                  document: 'pr',
                }}
                column={'fullname'}
                defaultData={
                  data?.requested_by_id
                    ? [
                        {
                          value: data?.requested_by_id ?? '',
                          label: data?.requestor_fullname ?? '',
                        },
                      ]
                    : undefined
                }
                value={form.values.requested_by_id}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                required={!readOnly}
                readOnly={readOnly}
              />
            ) : (
              <TextInput
                label={'Requested By'}
                variant={'unstyled'}
                placeholder={'None'}
                defaultValue={data?.requestor_fullname ?? '-'}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                readOnly
              />
            )}
          </Stack>

          <Stack bd={'1px solid var(--mantine-color-gray-8)'} p={'md'}>
            {!readOnly ? (
              <DynamicSelect
                key={form.key('sig_cash_availability_id')}
                {...form.getInputProps('sig_cash_availability_id')}
                variant={'unstyled'}
                label={'Cash Availability'}
                placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                endpoint={'/libraries/signatories'}
                endpointParams={{
                  paginated: false,
                  show_all: true,
                  document: 'pr',
                  signatory_type: 'cash_availability',
                }}
                defaultData={
                  data?.sig_cash_availability_id
                    ? [
                        {
                          value: data?.sig_cash_availability_id ?? '',
                          label: data?.cash_available_fullname ?? '',
                        },
                      ]
                    : undefined
                }
                valueColumn={'signatory_id'}
                column={'fullname_designation'}
                value={form.values.sig_cash_availability_id}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                required={!readOnly}
                readOnly={readOnly}
              />
            ) : (
              <TextInput
                label={'Cash Availability'}
                variant={'unstyled'}
                placeholder={'None'}
                defaultValue={data?.cash_available_fullname ?? '-'}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                readOnly
              />
            )}
          </Stack>

          <Stack bd={'1px solid var(--mantine-color-gray-8)'} p={'md'}>
            {!readOnly ? (
              <DynamicSelect
                key={form.key('sig_approved_by_id')}
                {...form.getInputProps('sig_approved_by_id')}
                variant={'unstyled'}
                label={'Approved By'}
                placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                endpoint={'/libraries/signatories'}
                endpointParams={{
                  paginated: false,
                  show_all: true,
                  document: 'pr',
                  signatory_type: 'approved_by',
                }}
                valueColumn={'signatory_id'}
                column={'fullname_designation'}
                defaultData={
                  data?.sig_approved_by_id
                    ? [
                        {
                          value: data?.sig_approved_by_id ?? '',
                          label: data?.approval_fullname ?? '',
                        },
                      ]
                    : undefined
                }
                value={form.values.sig_approved_by_id}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                required={!readOnly}
                readOnly={readOnly}
              />
            ) : (
              <TextInput
                label={'Approved By'}
                variant={'unstyled'}
                placeholder={'None'}
                defaultValue={data?.approval_fullname ?? '-'}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                readOnly
              />
            )}
          </Stack>
        </Group>
      </Stack>
    </form>
  );
});

PurchaseRequestContentClient.displayName = 'PurchaseRequestContentClient';

export default PurchaseRequestContentClient;
