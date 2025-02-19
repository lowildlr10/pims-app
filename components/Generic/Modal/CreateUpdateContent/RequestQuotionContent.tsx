'use client';

import {
  Divider,
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
import {
  IconAsterisk,
  IconCalendar,
  IconCalendarClock,
} from '@tabler/icons-react';
import { DateInput, DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import { Switch } from '@mantine/core';
import { Select } from '@mantine/core';
import { List } from '@mantine/core';
import DynamicMultiselect from '../../DynamicMultiselect';
import { Radio } from '@mantine/core';

const itemHeaders: PurchaseRequestItemHeader[] = [
  {
    id: 'stock_no',
    label: 'Item No.',
    width: '11%',
  },
  {
    id: 'quantity',
    label: 'QTY',
    width: '12%',
  },
  {
    id: 'description',
    label: 'Item & Description',
    width: '28%',
  },
  {
    id: 'brand_model',
    label: 'Brand/Model',
    width: '16%',
    required: true,
  },
  {
    id: 'unit_cost',
    label: 'Unit Cost',
    width: '16%',
    required: true,
  },
  {
    id: 'total_cost',
    label: 'Total Cost',
    width: '16%',
  },
  {
    id: 'include_checkbox',
    label: 'Included?',
    width: '2%',
  },
];

const RequestQuotionContentClient = forwardRef<
  HTMLFormElement,
  ModalRequestQuotationContentProps
>(({ data, isCreate, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      signed_type: data?.signed_type ?? 'lce',
      rfq_date: data?.rfq_date ?? dayjs().format('YYYY-MM-DD'),
      rfq_no: data?.rfq_no ?? '',
      supplier_id: data?.supplier_id ?? '',
      openning_dt: data?.openning_dt ?? '',
      sig_approval_id: data?.sig_approval_id ?? '',
      items:
        data?.items &&
        typeof data?.items !== undefined &&
        data?.items.length > 0
          ? data?.items?.map((item, index) => ({
              key: randomId(),
              pr_item_id: item?.pr_item_id,
              stock_no: item.pr_item?.stock_no ?? 1,
              quantity: item.pr_item?.quantity,
              description: item.pr_item?.description ?? '-',
              brand_model: item.brand_model ?? '-',
              unit_cost: item?.unit_cost ?? undefined,
              total_cost: item?.total_cost ?? undefined,
              included: item?.included ?? true,
            }))
          : [],
      vat_registered:
        data?.vat_registered === undefined
          ? '1'
          : data?.vat_registered
            ? '1'
            : '0',
      canvassers: data?.canvassers?.map((canvasser) => canvasser.user_id) ?? [],
    },
  });
  const [signedType, setSignedType] = useState<'lce' | 'bac'>(
    data.signed_type ?? 'lce'
  );
  const [municipality, setMunicipality] = useState('Loading...');

  useEffect(() => {
    API.get('/companies')
      .then((res) => {
        const company: CompanyType = res?.data?.company;

        setMunicipality(company?.municipality?.toUpperCase() ?? '');
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
    item: RequestQuotationItemsFieldType,
    index: number
  ): ReactNode => {
    switch (id) {
      case 'stock_no':
        return (
          <Table.Td>
            <NumberInput
              variant={readOnly ? 'unstyled' : 'filled'}
              placeholder={`Item No ${
                item?.stock_no?.toString() !== ''
                  ? `: ${item?.stock_no?.toString()}`
                  : ''
              }`}
              defaultValue={item?.stock_no}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              clampBehavior={'strict'}
              allowDecimal={false}
              readOnly
            />
          </Table.Td>
        );

      case 'quantity':
        return (
          <Table.Td>
            <NumberInput
              variant={readOnly ? 'unstyled' : 'filled'}
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
              readOnly
            />
          </Table.Td>
        );

      case 'description':
        return (
          <Table.Td>
            <Textarea
              variant={readOnly ? 'unstyled' : 'filled'}
              placeholder={'Description'}
              defaultValue={item?.description}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              autosize
              readOnly
            />
          </Table.Td>
        );

      case 'brand_model':
        return (
          <Table.Td>
            <Textarea
              key={form.key(`items.${index}.brand_model`)}
              {...form.getInputProps(`items.${index}.brand_model`)}
              variant={isCreate ? 'filled' : 'unstyled'}
              placeholder={isCreate ? 'To be quoted' : 'Brand/Model'}
              defaultValue={item?.brand_model}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              autosize
              required={!readOnly && !isCreate}
              readOnly={readOnly || isCreate}
            />
          </Table.Td>
        );

      case 'unit_cost':
        return (
          <Table.Td>
            <NumberInput
              key={form.key(`items.${index}.unit_cost`)}
              {...form.getInputProps(`items.${index}.unit_cost`)}
              variant={isCreate ? 'filled' : 'unstyled'}
              placeholder={isCreate ? 'To be quoted' : 'Unit Cost'}
              defaultValue={item?.unit_cost}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              clampBehavior={'strict'}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator={','}
              required={!readOnly && !isCreate}
              readOnly={readOnly || isCreate}
            />
          </Table.Td>
        );

      case 'total_cost':
        return (
          <Table.Td>
            <NumberInput
              variant={readOnly ? 'unstyled' : 'filled'}
              placeholder={'Total Cost'}
              defaultValue={item?.total_cost}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              clampBehavior={'strict'}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator={','}
              readOnly
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
            purchase_request_id: data.purchase_request_id,
            signed_type: signedType,
            rfq_date: values.rfq_date
              ? dayjs(values.rfq_date).format('YYYY-MM-DD')
              : '',
            openning_dt: values.openning_dt
              ? dayjs(values.openning_dt).format('YYYY-MM-DD HH:mm')
              : '',
            items: JSON.stringify(values.items),
            canvassers:
              values.canvassers.length > 0
                ? JSON.stringify(values.canvassers)
                : '',
            vat_registered: values.vat_registered === '1' ? true : false,
          });
        }
      })}
    >
      <Stack justify={'center'} gap={0} p={'md'}>
        <Select
          key={form.key('signed_type')}
          {...form.getInputProps('signed_type')}
          variant={readOnly ? 'unstyled' : 'default'}
          size={lgScreenAndBelow ? 'md' : 'lg'}
          label={'Document Type'}
          data={[
            { label: 'Signed LCE', value: 'lce' },
            { label: 'Signed BAC Chairman', value: 'bac' },
          ]}
          value={signedType}
          onChange={(_value, option) =>
            setSignedType((option.value as 'lce' | 'bac') ?? 'lce')
          }
          searchable
          required={!readOnly}
          readOnly={readOnly}
        />

        <Divider />

        <Stack
          justify={'center'}
          align={'center'}
          pt={'lg'}
          pb={'sm'}
          mt={'lg'}
          gap={1}
        >
          <Text fz={lgScreenAndBelow ? 'h5' : 'h4'} fw={500}>
            MUNICIPALITY OF {municipality}
          </Text>
          <Text
            fz={lgScreenAndBelow ? 'h5' : 'h4'}
            fw={500}
            mb={signedType === 'bac' ? 0 : 'lg'}
          >
            BIDS AND AWARD COMMITTEE
          </Text>

          {signedType === 'bac' && (
            <Stack w={'100%'} p={'md'}>
              <Stack flex={0.5} gap={1}>
                <Group>
                  <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                    Purchase Request No.:
                  </Text>
                  <TextInput
                    variant={'unstyled'}
                    placeholder={'None'}
                    defaultValue={data?.pr_no ?? '-'}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    readOnly
                  />
                </Group>

                <Group>
                  <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                    Name of Project:
                  </Text>
                  <TextInput
                    variant={'unstyled'}
                    placeholder={'None'}
                    defaultValue={data?.funding_source_title ?? '-'}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    readOnly
                  />
                </Group>

                <Group>
                  <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                    Location of Project:
                  </Text>
                  <TextInput
                    variant={'unstyled'}
                    placeholder={'None'}
                    defaultValue={data?.funding_source_location ?? '-'}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    readOnly
                  />
                </Group>
              </Stack>
              <Stack flex={0.5}></Stack>
            </Stack>
          )}

          <Text fz={lgScreenAndBelow ? 'h4' : 'h3'} fw={700}>
            REQUEST FOR QUOTATION
          </Text>
        </Stack>

        <Group w={'100%'} justify={'center'} align={'flex-start'} gap={0} grow>
          <Stack p={'md'} align={'flex-end'}>
            <Group>
              <Group gap={1} align={'flex-start'}>
                <Text size={lgScreenAndBelow ? 'sm' : 'lg'} fw={500}>
                  Date:
                </Text>
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
                key={form.key('rfq_date')}
                {...form.getInputProps('rfq_date')}
                variant={readOnly ? 'unstyled' : 'default'}
                valueFormat={'YYYY-MM-DD'}
                defaultValue={
                  form.values.rfq_date
                    ? new Date(form.values?.rfq_date)
                    : undefined
                }
                placeholder={`Enter the ${signedType === 'lce' ? 'quotation' : 'solicitation'} date here...`}
                error={form.errors.rfq_date && ''}
                flex={1}
                size={lgScreenAndBelow ? 'sm' : 'lg'}
                leftSection={!readOnly ? <IconCalendar size={18} /> : undefined}
                clearable
                required={!readOnly}
                readOnly={readOnly}
              />
            </Group>

            <Group>
              <Group gap={1} align={'flex-start'}>
                <Text size={lgScreenAndBelow ? 'sm' : 'lg'} fw={500}>
                  {signedType === 'bac' ? (
                    <>Solicitation No.:</>
                  ) : (
                    <>Quotation No.:</>
                  )}
                </Text>
              </Group>
              <TextInput
                variant={readOnly ? 'unstyled' : 'default'}
                placeholder={'Autogenerated'}
                defaultValue={data?.rfq_no}
                size={lgScreenAndBelow ? 'sm' : 'lg'}
                flex={1}
                readOnly
              />
            </Group>
          </Stack>
        </Group>

        <Group w={'100%'} justify={'center'} align={'flex-start'} gap={0} grow>
          <Stack p={'md'} align={'flex-start'}>
            <Group>
              <Group gap={1} align={'flex-start'}>
                <Text size={lgScreenAndBelow ? 'sm' : 'lg'} fw={500}>
                  Company Name / Supplier:
                </Text>
              </Group>

              {!readOnly ? (
                <DynamicSelect
                  key={form.key('supplier_id')}
                  {...form.getInputProps('supplier_id')}
                  variant={
                    readOnly || data.status === 'completed'
                      ? 'filled'
                      : 'default'
                  }
                  endpoint={'/libraries/suppliers'}
                  endpointParams={{ paginated: false }}
                  column={'supplier_name'}
                  defaultData={
                    data?.supplier_id
                      ? [
                          {
                            value: data?.supplier_id ?? '',
                            label: data?.supplier_name ?? '',
                          },
                        ]
                      : undefined
                  }
                  value={form.values.supplier_id}
                  size={lgScreenAndBelow ? 'sm' : 'lg'}
                  placeholder={'Select a supplier...'}
                  required={!readOnly || data.status !== 'completed'}
                  readOnly={readOnly || data.status === 'completed'}
                />
              ) : (
                <TextInput
                  variant={'unstyled'}
                  placeholder={'None'}
                  defaultValue={data?.supplier_name ?? '-'}
                  size={lgScreenAndBelow ? 'sm' : 'lg'}
                  flex={1}
                  readOnly
                />
              )}
            </Group>
          </Stack>
        </Group>

        <Stack p={'md'} gap={0}>
          <Text size={lgScreenAndBelow ? 'sm' : 'lg'}>Sir / Madam:</Text>

          <Text size={lgScreenAndBelow ? 'sm' : 'lg'}>
            Please quote your lowest price on the item/s listed below, subject
            to the conditions herein and submit your quotation duly signed by
            your representative.
          </Text>
        </Stack>

        <Group w={'100%'} justify={'center'} align={'flex-start'} gap={0} grow>
          {signedType === 'lce' && (
            <Stack p={'md'} align={'flex-end'}>
              <DateTimePicker
                key={form.key('openning_dt')}
                {...form.getInputProps('openning_dt')}
                variant={readOnly ? 'unstyled' : 'default'}
                label={'(Date and Time of Opening)'}
                valueFormat={'YYYY-MM-DD HH:mm'}
                defaultValue={
                  form.values.openning_dt
                    ? new Date(form.values?.openning_dt)
                    : undefined
                }
                placeholder={'Enter the opening date time here...'}
                error={form?.errors?.openning_dt && ''}
                flex={1}
                size={lgScreenAndBelow ? 'sm' : 'lg'}
                leftSection={
                  !readOnly ? <IconCalendarClock size={18} /> : undefined
                }
                clearable
                readOnly={readOnly}
              />
            </Stack>
          )}

          <Stack p={'md'} align={'flex-end'}>
            {!readOnly ? (
              <DynamicSelect
                key={form.key('sig_approval_id')}
                {...form.getInputProps('sig_approval_id')}
                label={
                  signedType === 'bac' ? 'BAC Chairman' : 'Municipal Mayor'
                }
                placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                endpoint={'/libraries/signatories'}
                endpointParams={{
                  paginated: false,
                  show_all: true,
                  document: 'rfq',
                  signatory_type: 'approval',
                }}
                defaultData={
                  data?.sig_approval_id
                    ? [
                        {
                          value: data?.sig_approval_id ?? '',
                          label: data?.approval_fullname ?? '',
                        },
                      ]
                    : undefined
                }
                valueColumn={'signatory_id'}
                column={'fullname_designation'}
                value={form.values.sig_approval_id}
                size={lgScreenAndBelow ? 'sm' : 'lg'}
                required={!readOnly}
                readOnly={readOnly}
              />
            ) : (
              <TextInput
                label={
                  signedType === 'bac' ? 'BAC Chairman' : 'Municipal Mayor'
                }
                variant={'unstyled'}
                placeholder={'None'}
                defaultValue={data?.approval_fullname ?? '-'}
                size={lgScreenAndBelow ? 'sm' : 'lg'}
                flex={1}
                readOnly
              />
            )}
          </Stack>
        </Group>

        <Stack mt={'md'}>
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
                  if (readOnly && header.id === 'include_checkbox') return;

                  if (!readOnly && header.id === 'total_cost') return;

                  return (
                    <Table.Th
                      key={header.id}
                      w={header?.width ?? undefined}
                      fz={lgScreenAndBelow ? 'sm' : 'md'}
                    >
                      <Group gap={1} align={'flex-start'}>
                        {header.label}{' '}
                        {header?.required && !readOnly && !isCreate && (
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
                      header.id === 'include_checkbox' ||
                      (!readOnly && header.id === 'total_cost')
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
                    <Table.Td valign={'middle'}>
                      <Switch
                        key={form.key(`items.${index}.included`)}
                        {...form.getInputProps(`items.${index}.included`)}
                        w={'100%'}
                        size={lgScreenAndBelow ? 'xs' : 'sm'}
                        color={'var(--mantine-color-primary-9)'}
                        onLabel={'Yes'}
                        offLabel={'No'}
                        defaultChecked={item.included}
                        sx={{
                          label: {
                            justifyContent: 'center',
                          },
                        }}
                      />
                      <input
                        key={form.key(`items.${index}.quantity`)}
                        {...form.getInputProps(`items.${index}.quantity`)}
                        type={'hidden'}
                        value={item.quantity}
                      />
                      <input
                        key={form.key(`items.${index}.pr_item_id`)}
                        {...form.getInputProps(`items.${index}.pr_item_id`)}
                        type={'hidden'}
                        value={item.pr_item_id}
                      />
                    </Table.Td>
                  )}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>

        <Group
          align={'flex-start'}
          bd={'1px solid var(--mantine-color-gray-8)'}
          p={'md'}
          grow
        >
          <Textarea
            variant={readOnly ? 'unstyled' : 'filled'}
            label={'Purpose'}
            placeholder={'Purpose'}
            defaultValue={data?.purpose ?? '-'}
            size={lgScreenAndBelow ? 'sm' : 'md'}
            autosize
            autoCapitalize={'sentences'}
            readOnly
          />
        </Group>

        <Stack p={'md'} gap={0}>
          <Text fz={lgScreenAndBelow ? 'h4' : 'h3'} fw={700}>
            Conditions
          </Text>

          <Stack pl={'md'}>
            <List type='ordered' size={lgScreenAndBelow ? 'sm' : 'lg'}>
              <List.Item>
                All entries must be legibly printed/written.
              </List.Item>
              <List.Item>
                <Radio.Group
                  key={form.key('vat_registered')}
                  {...form.getInputProps('vat_registered')}
                  label={
                    'All taxes are inclusive. Please check whether you are '
                  }
                  size={lgScreenAndBelow ? 'sm' : 'lg'}
                  defaultValue={form.values.vat_registered}
                >
                  <Stack mt={'xs'} mb={'md'}>
                    <Radio value={'1'} label={'VAT Registered     OR'} />
                    <Radio value={'0'} label={'Non VAT Registered'} />
                  </Stack>
                </Radio.Group>
              </List.Item>
              <List.Item>
                Warranty shall be for a period of three (3) months for
                Expandable supplies and one (1) year for Non-expendable supplies
                from date of acceptance by the procuring entity of the delivered
                supplies, If applicable
              </List.Item>
              <List.Item>
                PhilGEPS registration certificate shall be attached upon
                submission of the quotation, if applicable.
              </List.Item>
              <List.Item>
                Bidders shall submit original brochures showing certifications
                of the products being offered, if applicable
              </List.Item>
              <List.Item>
                The Procuring entity reserves the right to waive any defects in
                the tender or offer as well as the right to accept the bid most
                advantageous to the Municipal Government.
              </List.Item>

              {signedType === 'lce' && (
                <>
                  <List.Item>Pick Up Price</List.Item>
                  <List.Item>With Delivery</List.Item>
                </>
              )}
            </List>
          </Stack>
        </Stack>

        <Stack p={'md'} align={'flex-end'} mb={'lg'}>
          {!readOnly ? (
            <DynamicMultiselect
              key={form.key('canvassers')}
              {...form.getInputProps('canvassers')}
              endpoint={'/accounts/users'}
              endpointParams={{
                paginated: false,
                show_all: true,
                show_inactive: false,
              }}
              column={'fullname'}
              label={'CANVASSERS'}
              value={(form.values.canvassers as string[]) ?? undefined}
              size={lgScreenAndBelow ? 'sm' : 'lg'}
              required={!readOnly}
              readOnly={readOnly}
            />
          ) : (
            <Textarea
              label={'CANVASSERS'}
              variant={'unstyled'}
              placeholder={'None'}
              defaultValue={data?.canvasser_names?.join('\n') ?? '-'}
              size={lgScreenAndBelow ? 'sm' : 'lg'}
              flex={1}
              autosize
              readOnly
            />
          )}
        </Stack>
      </Stack>
    </form>
  );
});

RequestQuotionContentClient.displayName = 'RequestQuotionContentClient';

export default RequestQuotionContentClient;
