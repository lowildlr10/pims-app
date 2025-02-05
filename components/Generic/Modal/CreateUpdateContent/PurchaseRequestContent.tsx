import { ActionIcon, Group, NumberInput, Stack, Switch, Table, Text, Textarea, TextInput } from '@mantine/core';
import React, { ReactNode, useEffect } from 'react';
import DynamicSelect from '../../DynamicSelect';
import { useForm } from '@mantine/form';
import { useListState } from '@mantine/hooks';
import { Button } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';

const itemHeaders: PurchaseRequestItemHeader[] = [
  {
    id: 'quantity',
    label: 'QTY',
    width: '12%'
  },
  {
    id: 'unit_issue',
    label: 'Unit of Issue',
    width: '11%'
  },
  {
    id: 'description',
    label: 'Description',
    width: '33%'
  },
  {
    id: 'stock_no',
    label: 'Stock No',
    width: '11%'
  },
  {
    id: 'estimated_unit_cost',
    label: 'Estimated Unit Cost',
    width: '16%'
  },
  {
    id: 'estimated_cost',
    label: 'Estimated Cost',
    width: '16%'
  },
  {
    id: 'delete',
    label: '',
    width: '2%'
  }
];

const ItemTableClient = ({items, onChange}: PurchaseRequestItemTableProps) => {
  const [itemFields, handlers] = useListState<PurchaseRequestItemsFieldType>([
    {
      item_key: 1,
      quantity: undefined,
      unit_issue_id: undefined,
      description: undefined,
      stock_no: 1,
      estimated_unit_cost: undefined,
      estimated_cost: undefined
    }
  ]);

  useEffect(() => {
    if (!items || items.length === 0) return;

    handlers.setState(
      items.map((item, index) => ({
        item_key: index + 1,
        quantity: item.quantity,
        unit_issue_id: item.unit_issue_id,
        description: item.description,
        stock_no: item.stock_no,
        estimated_unit_cost: item.estimated_unit_cost,
        estimated_cost: item.estimated_cost
      }))
    );
  }, [items]);

  useEffect(() => {
    if (!onChange) return;

    onChange(JSON.stringify(itemFields));
  }, [itemFields]);

  const renderDynamicTdContent = (id: string, item: PurchaseRequestItemsFieldType, index?: number): ReactNode => {
    switch (id) {
      case 'quantity':
        return (
          <Table.Td>
            <NumberInput
              placeholder={item?.quantity ? String(item?.quantity) : 'Quantity'}
              value={item?.quantity}
              size={'sm'}
              onChange={(value) =>
                index !== undefined && handlers.setItem(index, {
                  ...item,
                  quantity: value as number,
                  estimated_cost: parseFloat(((value as number) * (item.estimated_unit_cost ?? 0)).toFixed(2))
                })
              }
              required
            />
          </Table.Td>
        );
      
      case 'unit_issue':
        return (
          <Table.Td>
            <DynamicSelect
              endpoint={'/libraries/unit-issues'}
              endpointParams={{ paginated: false }}
              column={'unit_name'}
              value={item?.unit_issue_id}
              size={'sm'}
              onChange={(value) => 
                index !== undefined && handlers.setItem(index, {
                  ...item,
                  unit_issue_id: value
                })
              }
            />
          </Table.Td>
        );

      case 'description':
        return (
          <Table.Td>
            <Textarea
              placeholder={item?.description ?? 'Description'}
              value={item?.description}
              size={'sm'}
              onChange={(event) =>
                index !== undefined && handlers.setItem(index, {
                  ...item,
                  description: event.currentTarget.value 
                })
              }
              autosize
              required
            />
          </Table.Td>
        );

      case 'stock_no':
        return (
          <Table.Td>
            <NumberInput
              placeholder={item?.stock_no ? String(item?.stock_no) : 'Stock No'}
              value={item?.stock_no}
              size={'sm'}
              onChange={(value) =>
                index !== undefined && handlers.setItem(index, {
                  ...item,
                  stock_no: value as number
                })
              }
              required
            />
          </Table.Td>
        );

      case 'estimated_unit_cost':
        return (
          <Table.Td>
            <NumberInput
              placeholder={item?.estimated_unit_cost ? String(item?.estimated_unit_cost) : 'Estimated Unit Cost'}
              value={item?.estimated_unit_cost}
              size={'sm'}
              onChange={(value) =>
                index !== undefined && handlers.setItem(index, {
                  ...item,
                  estimated_unit_cost: value as number,
                  estimated_cost: parseFloat(((value as number) * (item.quantity ?? 0)).toFixed(2))
                })
              }
              required
            />
          </Table.Td>
        );

      case 'estimated_cost':
        return (
          <Table.Td>
            <NumberInput
              placeholder={item?.estimated_cost ? String(item?.estimated_cost) : 'Estimated Cost'}
              value={item?.estimated_cost}
              size={'sm'}
              onChange={(value) =>
                index !== undefined && handlers.setItem(index, {
                  ...item,
                  estimated_cost: value as number
                })
              }
              required
            />
          </Table.Td>
        );
    
      default:
        return <></>;
    }
  };

  return (
    <Table
      verticalSpacing={'sm'}
      withTableBorder
      m={0}
    >
      <Table.Thead>
        <Table.Tr>
          {itemHeaders.map(header => (
            <Table.Th 
              key={header.id}
              w={header?.width ?? undefined}
            >{header.label}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {itemFields.map((item, index) => (
          <Table.Tr key={`item-${index}-${item.item_key}`} sx={{ verticalAlign: 'top' }}>
            {itemHeaders.map(header => header.id !== 'delete' &&  (
              <React.Fragment key={`field-${index}-${header.id}`}>
                {renderDynamicTdContent(header.id, item, index)}
              </React.Fragment>
            ))}
            
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
                <IconTrash size={18} stroke={1.5} />
              </ActionIcon>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
      <Table.Tfoot>
        <Table.Tr>
          <Table.Td colSpan={7}>
            <Button 
              color={'var(--mantine-color-primary-9)'}
              variant={'outline'}
              leftSection={<IconPlus size={18} stroke={1.5} />}
              onClick={() => handlers.append({
                item_key: (itemFields[itemFields.length - 1]?.item_key ?? 1) + 1,
                quantity: undefined,
                unit_issue_id: undefined,
                description: undefined,
                stock_no: (itemFields[itemFields.length - 1]?.stock_no ?? 1) + 1,
                estimated_unit_cost: undefined,
                estimated_cost: undefined
              })}
              fullWidth
            >Add Item</Button>
          </Table.Td>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  );
}

const PurchaseRequestContentClient = ({
  data,
  handleCreateUpdate,
  setPayload,
}: ModalPurchaseRequestContentProps) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      section_id: data?.section_id ?? '',
      pr_date: data?.pr_date ?? dayjs().format('YYYY-MM-DD'),
      sai_no: data?.sai_no ?? '',
      sai_date: data?.sai_date,
      alobs_no: data?.alobs_no ?? '',
      alobs_date: data?.alobs_date,
      funding_source_id: data?.funding_source_id ?? '',
      purpose: data?.purpose ?? '',
      requested_by_id: data?.requested_by_id ?? '',
      sig_cash_availability_id: data?.sig_cash_availability_id ?? '',
      sig_approved_by_id: data?.sig_approved_by_id ?? '',
      items: data?.items ? JSON.stringify(data?.items) : ''
    },
  });

  useEffect(() => {
    setPayload(form.values);
  }, [form.values]);

  return (
    <form
      onSubmit={form.onSubmit(() => handleCreateUpdate && handleCreateUpdate())}
    >
      <Stack justify={'center'}>
        <Group 
          w={'100%'} 
          justify={'center'}
          align={'flex-start'}
          gap={0}
          bd={'1px solid var(--mantine-color-gray-5)'}
        >
          <Stack
            p={'md'} 
            flex={0.35}
          >
            <Group>
              <Text>Department:</Text>
              <TextInput
                placeholder='Department'
                value={'LGU-Atok'}
                size={'sm'}
                flex={1}
                readOnly
              /> 
            </Group>
            <Group>
              <Text>Section:</Text>
              <Stack justify={'center'} flex={1}>
                <DynamicSelect
                  endpoint={'/accounts/sections'}
                  endpointParams={{ paginated: false }}
                  column={'section_name'}
                  value={form.values.section_id}
                  size={'sm'}
                  onChange={(value) => 
                    form.setFieldValue('section_id', value)
                  }
                  required
                />
              </Stack>
            </Group>
          </Stack>

          <Stack 
            p={'md'} 
            flex={0.65}
            sx={{ borderLeft: '1px solid var(--mantine-color-gray-5)' }}
          >
            <Group>
              <Text>PR No.</Text>
              <TextInput
                placeholder='PR No.'
                value={data?.pr_no ?? 'Auto generated'}
                size={'sm'}
                flex={1}
                readOnly
              />
              <Text>Date:</Text>
              <DateInput
                valueFormat={'YYYY-MM-DD'}
                value={form.values.pr_date ? new Date(form.values?.pr_date) : undefined}
                onChange={(value) => 
                  form.setFieldValue('pr_date', value ? dayjs(value).format('YYYY-MM-DD') : '')
                }
                placeholder={'PR Date'}
                error={form.errors.pr_date && ''}
                flex={1}
                clearable
                required
              />
            </Group>
            <Group>
              <Text>SAI No.</Text>
              <TextInput
                placeholder={'SAI No.'}
                value={form.values.sai_no}
                onChange={(event) =>
                  form.setFieldValue('sai_no', event.currentTarget.value)
                }
                error={form.errors.sai_no && ''}
                size={'sm'}
                flex={1}
                required
              />
              <Text>Date:</Text>
              <DateInput
                valueFormat={'YYYY-MM-DD'}
                value={form.values.sai_date ? new Date(form.values?.sai_date) : undefined}
                onChange={(value) => 
                  form.setFieldValue('sai_date', value ? dayjs(value).format('YYYY-MM-DD') : '')
                }
                placeholder={'SAI Date'}
                error={form.errors.sai_date && ''}
                flex={1}
                clearable
                required
              />
            </Group>
            <Group>
              <Text>ALOBS No.</Text>
              <TextInput
                placeholder={'ALOBS No.'}
                value={form.values.alobs_no}
                onChange={(event) =>
                  form.setFieldValue('alobs_no', event.currentTarget.value)
                }
                error={form.errors.alobs_no && ''}
                size={'sm'}
                flex={1}
                required
              />
              <Text>Date:</Text>
              <DateInput
                valueFormat={'YYYY-MM-DD'}
                value={form.values.alobs_date ? new Date(form.values?.alobs_date) : undefined}
                onChange={(value) => 
                  form.setFieldValue('alobs_date', value ? dayjs(value).format('YYYY-MM-DD') : '')
                }
                placeholder={'ALOBS Date'}
                error={form.errors.alobs_date && ''}
                flex={1}
                clearable
                required
              />
            </Group>
          </Stack>
        </Group>

        <Stack>
          <ItemTableClient 
            items={data?.items ?? []}
            onChange={(value) => form.setFieldValue('items', value)} 
          />
        </Stack>

        <Group 
          align={'flex-start'}
          bd={'1px solid var(--mantine-color-gray-5)'}
          p={'md'}
          grow
        >
          <Textarea
            label={'Purpose'}
            placeholder='Purpose'
            value={form.values.purpose}
            onChange={(event) =>
              form.setFieldValue('purpose', event.currentTarget.value)
            }
            error={form.errors.purpose && ''}
            size={'sm'}
            autosize
            autoCapitalize={'sentences'}
            required
          />

          <DynamicSelect
            label={'Funding Source / Project'}
            endpoint={'/libraries/funding-sources'}
            endpointParams={{ paginated: false }}
            column={'title'}
            value={form.values.funding_source_id}
            size={'sm'}
            onChange={(value) => 
              form.setFieldValue('funding_source_id', value)
            }
          />
        </Group>

        <Group 
          align={'flex-start'}
          bd={'1px solid var(--mantine-color-gray-5)'}
          p={'md'}
          grow
        >
          <DynamicSelect
            label={'Requested By'}
            endpoint={'/accounts/users'}
            endpointParams={{ paginated: false }}
            column={'fullname'}
            value={form.values.requested_by_id}
            size={'sm'}
            onChange={(value) => 
              form.setFieldValue('requested_by_id', value)
            }
            required
          />

          <DynamicSelect
            label={'Cash Availability'}
            endpoint={'/accounts/users'}
            endpointParams={{ paginated: false }}
            column={'fullname'}
            value={form.values.requested_by_id}
            size={'sm'}
            onChange={(value) => 
              form.setFieldValue('requested_by_id', value)
            }
          />

          <DynamicSelect
            label={'Approved By'}
            endpoint={'/accounts/users'}
            endpointParams={{ paginated: false }}
            column={'fullname'}
            value={form.values.requested_by_id}
            size={'sm'}
            onChange={(value) => 
              form.setFieldValue('requested_by_id', value)
            }
          />
        </Group>
      </Stack>
    </form>
  );
};

export default PurchaseRequestContentClient;
