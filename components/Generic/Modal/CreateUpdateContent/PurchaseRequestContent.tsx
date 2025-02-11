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
import { useListState } from '@mantine/hooks';
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

const ItemTableClient = ({
  items,
  readOnly,
  onChange,
}: PurchaseRequestItemTableProps) => {
  const [itemFields, handlers] = useListState<PurchaseRequestItemsFieldType>([
    {
      item_key: 1,
      quantity: undefined,
      unit_issue_id: undefined,
      description: undefined,
      stock_no: 1,
      estimated_unit_cost: undefined,
      estimated_cost: undefined,
    },
  ]);

  useEffect(() => {
    if (!items || items.length === 0) return;

    handlers.setState(
      items.map((item, index) => ({
        item_key: index + 1,
        quantity: item.quantity,
        unit_issue_id: item.unit_issue_id,
        unit_issue: item.unit_issue?.unit_name,
        description: item.description,
        stock_no: item.stock_no,
        estimated_unit_cost: item.estimated_unit_cost,
        estimated_cost: item.estimated_cost,
      }))
    );
  }, [items]);

  useEffect(() => {
    if (!onChange) return;

    onChange(JSON.stringify(itemFields));
  }, [itemFields]);

  const renderDynamicTdContent = (
    id: string,
    item: PurchaseRequestItemsFieldType,
    index?: number
  ): ReactNode => {
    switch (id) {
      case 'quantity':
        return (
          <Table.Td>
            <NumberInput
              name={'quantity'}
              variant={'unstyled'}
              placeholder={item?.quantity ? String(item?.quantity) : 'Quantity'}
              defaultValue={item?.quantity}
              value={item?.quantity}
              size={'md'}
              onChange={(value) =>
                index !== undefined &&
                handlers.setItem(index, {
                  ...item,
                  quantity: (value as number) ?? 0,
                  estimated_cost: parseFloat(
                    (
                      (value as number) * (item.estimated_unit_cost ?? 0)
                    ).toFixed(2)
                  ),
                })
              }
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
                name={'unit_issue_id'}
                variant={'unstyled'}
                placeholder={'Unit of Issue'}
                endpoint={'/libraries/unit-issues'}
                endpointParams={{ paginated: false, show_all: true }}
                column={'unit_name'}
                value={item?.unit_issue_id}
                onChange={(value) =>
                  index !== undefined &&
                  handlers.setItem(index, {
                    ...item,
                    unit_issue_id: value,
                  })
                }
                size={'md'}
                required={!readOnly}
                readOnly={readOnly}
              />
            ) : (
              <TextInput
                variant={'unstyled'}
                placeholder={'None'}
                value={item?.unit_issue ?? '-'}
                size={'md'}
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
              name={'description'}
              variant={'unstyled'}
              placeholder={
                item?.description?.trim() === '' || !item?.description?.trim()
                  ? 'Description'
                  : item?.description?.trim()
              }
              value={item?.description}
              size={'md'}
              onChange={(e) =>
                index !== undefined &&
                handlers.setItem(index, {
                  ...item,
                  description: e.currentTarget.value,
                })
              }
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
              name={'stock_no'}
              variant={'unstyled'}
              placeholder={item?.stock_no ? String(item?.stock_no) : 'Stock No'}
              value={item?.stock_no}
              size={'md'}
              onChange={(value) =>
                index !== undefined &&
                handlers.setItem(index, {
                  ...item,
                  stock_no: (value as number) ?? 0,
                })
              }
              required={!readOnly}
              readOnly={readOnly}
            />
          </Table.Td>
        );

      case 'estimated_unit_cost':
        return (
          <Table.Td>
            <NumberInput
              name={'estimated_unit_cost'}
              variant={'unstyled'}
              placeholder={
                item?.estimated_unit_cost
                  ? String(item?.estimated_unit_cost)
                  : 'Estimated Unit Cost'
              }
              value={item?.estimated_unit_cost}
              size={'md'}
              onChange={(value) => {
                if (index !== undefined)
                  handlers.setItem(index, {
                    ...item,
                    estimated_unit_cost: (value as number) ?? 0,
                    estimated_cost: parseFloat(
                      ((value as number) * (item.quantity ?? 0)).toFixed(2)
                    ),
                  });
              }}
              required={!readOnly}
              readOnly={readOnly}
            />
          </Table.Td>
        );

      case 'estimated_cost':
        return (
          <Table.Td>
            <NumberInput
              name={'estimated_cost'}
              variant={'unstyled'}
              placeholder={
                item?.estimated_cost
                  ? String(item?.estimated_cost)
                  : 'Estimated Cost'
              }
              value={item?.estimated_cost}
              size={'md'}
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

            return (
              <Table.Th key={header.id} w={header?.width ?? undefined}>
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
        {itemFields.map((item, index) => (
          <Table.Tr
            key={`item-${index}-${item.item_key}`}
            sx={{ verticalAlign: 'top' }}
          >
            {itemHeaders.map(
              (header) =>
                header.id !== 'delete' && (
                  <React.Fragment key={`field-${index}-${header.id}`}>
                    {renderDynamicTdContent(header.id, item, index)}
                  </React.Fragment>
                )
            )}

            {!readOnly && (
              <Table.Td>
                <ActionIcon
                  color={'var(--mantine-color-red-7)'}
                  radius={'lg'}
                  variant={'outline'}
                  disabled={itemFields.length === 1}
                  onClick={() => {
                    if (itemFields.length === 1) return;
                    handlers.remove(index);
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
            <Table.Td colSpan={7}>
              <Button
                variant={'light'}
                color={'var(--mantine-color-primary-9)'}
                leftSection={<IconPlus size={18} stroke={2} />}
                onClick={() =>
                  handlers.append({
                    item_key:
                      (itemFields[itemFields.length - 1]?.item_key ?? 1) + 1,
                    quantity: undefined,
                    unit_issue_id: undefined,
                    description: undefined,
                    stock_no:
                      (itemFields[itemFields.length - 1]?.stock_no ?? 1) + 1,
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
  );
};

const PurchaseRequestContentClient = forwardRef<
  HTMLFormElement,
  ModalPurchaseRequestContentProps
>(({ data, readOnly, handleCreateUpdate }, ref) => {
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
      items: data?.items ? JSON.stringify(data?.items) : '',
    },
  });
  const [prStatus] = useState(data?.status ?? '');
  const [location, setLocation] = useState('Loading...');
  const [companyType, setCompanyType] = useState('Loading...');
  const [department, setDepartment] = useState('Loading...');

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

  return (
    <form
      ref={ref}
      onSubmit={form.onSubmit((values) => {
        if (!['', 'draft', 'disapproved'].includes(prStatus)) {
          notify({
            title: 'Update Failed',
            message:
              'Purchase Request cannot be updated as it is either already being processed or has been cancelled.',
            color: 'var(--mantine-color-red-7)',
          });
          return;
        }

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
          <Text fz={'h3'} fw={600}>
            Purchase Request
          </Text>
          <Text fz={'h5'} fw={600} td={'underline'}>
            {location}
          </Text>
          <Text fz={'h5'} fw={600}>
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
              <Text>Department:</Text>
              <TextInput
                variant={'unstyled'}
                placeholder={'Loading...'}
                value={department}
                size={'md'}
                flex={1}
                leftSection={!department ? <Loader size={16} /> : undefined}
                readOnly
              />
            </Group>
            <Group>
              <Group gap={1} align={'flex-start'}>
                <Text>Section:</Text>
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
                    value={form.values.section_id}
                    size={'md'}
                    placeholder={'Select a section...'}
                    required={!readOnly}
                    readOnly={readOnly}
                  />
                ) : (
                  <TextInput
                    variant={'unstyled'}
                    placeholder={'None'}
                    value={data?.section_name ?? '-'}
                    size={'md'}
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
              <Text>PR No.</Text>
              <TextInput
                variant={'unstyled'}
                placeholder={'Autogenerated'}
                value={data?.pr_no ?? 'Auto-generated'}
                size={'md'}
                flex={1}
                readOnly
              />
              <Group gap={1} align={'flex-start'}>
                <Text>Date:</Text>
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
                size={'md'}
                clearable
                required={!readOnly}
                readOnly={readOnly}
              />
            </Group>
            <Group>
              <Text>SAI No.</Text>
              <TextInput
                key={form.key('sai_no')}
                {...form.getInputProps('sai_no')}
                variant={'unstyled'}
                placeholder={!readOnly ? 'Enter the SAI number here...' : ''}
                defaultValue={form.values.sai_no}
                error={form.errors.sai_no && ''}
                size={'md'}
                flex={1}
                readOnly={readOnly}
              />
              <Text>Date:</Text>
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
                placeholder={!readOnly ? 'Enter the SAI date here...' : ''}
                error={form.errors.sai_date && ''}
                flex={1}
                size={'md'}
                clearable
                readOnly={readOnly}
              />
            </Group>
            <Group>
              <Text>ALOBS No.</Text>
              <TextInput
                key={form.key('alobs_no')}
                {...form.getInputProps('alobs_no')}
                variant={'unstyled'}
                placeholder={!readOnly ? 'Enter the ALOBS number here...' : ''}
                defaultValue={form.values.alobs_no}
                error={form.errors.alobs_no && ''}
                size={'md'}
                flex={1}
                readOnly={readOnly}
              />
              <Text>Date:</Text>
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
                placeholder={!readOnly ? 'Enter the ALOBS date here...' : ''}
                error={form.errors.alobs_date && ''}
                flex={1}
                size={'md'}
                clearable
                readOnly={readOnly}
              />
            </Group>
          </Stack>
        </Group>

        <Stack>
          <ItemTableClient
            key={form.key('items')}
            {...form.getInputProps('items')}
            items={data?.items ?? []}
            readOnly={readOnly}
          />
        </Stack>

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
            size={'md'}
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
              value={form.values.funding_source_id}
              size={'md'}
              readOnly={readOnly}
            />
          ) : (
            <TextInput
              label={'Funding Source / Project'}
              variant={'unstyled'}
              placeholder={'None'}
              value={data?.funding_source_title ?? '-'}
              size={'md'}
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
                endpointParams={{ paginated: false, show_all: true }}
                column={'fullname'}
                value={form.values.requested_by_id}
                size={'md'}
                required={!readOnly}
                readOnly={readOnly}
              />
            ) : (
              <TextInput
                label={'Requested By'}
                variant={'unstyled'}
                placeholder={'None'}
                value={data?.requestor_fullname ?? '-'}
                size={'md'}
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
                valueColumn={'signatory_id'}
                column={'fullname_designation'}
                value={form.values.sig_cash_availability_id}
                size={'md'}
                required={!readOnly}
                readOnly={readOnly}
              />
            ) : (
              <TextInput
                label={'Cash Availability'}
                variant={'unstyled'}
                placeholder={'None'}
                value={data?.cash_availability_fullname ?? ''}
                size={'md'}
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
                value={form.values.sig_approved_by_id}
                size={'md'}
                required={!readOnly}
                readOnly={readOnly}
              />
            ) : (
              <TextInput
                label={'Approved By'}
                variant={'unstyled'}
                placeholder={'None'}
                value={data?.approver_fullname ?? ''}
                size={'md'}
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
