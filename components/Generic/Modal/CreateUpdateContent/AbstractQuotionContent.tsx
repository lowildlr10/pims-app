'use client';

import {
  Box,
  Card,
  Checkbox,
  Flex,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  },
  {
    id: 'unit_cost',
    label: 'Unit Cost',
    width: '16%',
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

const AbstractQuotionContentClient = forwardRef<
  HTMLFormElement,
  ModalAbstractQuotationContentProps
>(({ data, isCreate, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(
    () => ({
      bids_awards_committee_id: currentData?.bids_awards_committee_id ?? '',
      mode_procurement_id: currentData?.mode_procurement_id ?? '',
      solicitation_no: currentData?.solicitation_no ?? '',
      solicitation_date:
        currentData?.solicitation_date ?? dayjs().format('YYYY-MM-DD'),
      opened_on: currentData?.opened_on ?? '',
      bac_action: currentData?.bac_action ?? '',
      sig_twg_chairperson_id: currentData?.sig_twg_chairperson_id ?? '',
      sig_twg_member_1_id: currentData?.sig_twg_member_1_id ?? '',
      sig_twg_member_2_id: currentData?.sig_twg_member_2_id ?? '',
      sig_chairman_id: currentData?.sig_chairman_id ?? '',
      sig_vice_chairman_id: currentData?.sig_vice_chairman_id ?? '',
      sig_member_1_id: currentData?.sig_member_1_id ?? '',
      sig_member_2_id: currentData?.sig_member_2_id ?? '',
      sig_member_3_id: currentData?.sig_member_3_id ?? '',
      items:
        currentData?.items &&
        typeof currentData?.items !== undefined &&
        currentData?.items.length > 0
          ? currentData?.items?.map((item, index) => ({
              key: randomId(),
              pr_item_id: item?.pr_item_id,
              stock_no: item.pr_item?.stock_no ?? 1,
              quantity: item.pr_item?.quantity,
              unit: item.pr_item?.unit_issue?.unit_name,
              description: item.pr_item?.description ?? '-',
              details: item.details?.map((detail) => ({
                key: randomId(),
                supplier_id: detail.supplier_id,
                supplier_name: detail.supplier?.supplier_name,
                brand_model: detail?.brand_model ?? '',
                unit_cost:
                  typeof detail?.unit_cost === 'string'
                    ? parseFloat(detail?.unit_cost ?? '0')
                    : (detail?.unit_cost ?? 0),
                total_cost:
                  typeof detail?.total_cost === 'string'
                    ? parseFloat(detail?.total_cost ?? '0')
                    : (detail?.total_cost ?? 0),
              })),
              included:
                item.pr_item?.awarded_to_id === undefined ||
                item.pr_item?.awarded_to_id === null ||
                !!item.pr_item.awarded_to_id === false
                  ? true
                  : false,
            }))
          : [],
    }),
    [currentData]
  );
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
  });
  const [supplierHeaders, setSupplierHeaders] = useState<object[]>([]);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    form.reset();
    form.setValues(currentForm);

    const items = currentForm?.items ?? [];
    const details = currentForm?.items[0]?.details ?? [];

    const headers = (details ?? []).map((detail) => {
      const relevantDetails = (items ?? []).flatMap(
        (item) => item?.details ?? []
      );

      return {
        supplier_id: detail?.supplier_id,
        supplier_name: detail?.supplier_name,
        unit_cost: relevantDetails
          .filter((_detail) => _detail?.supplier_id === detail?.supplier_id)
          .reduce((acc, _detail) => acc + (_detail?.unit_cost ?? 0), 0),
        total_cost: relevantDetails
          .filter((_detail) => _detail?.supplier_id === detail?.supplier_id)
          .reduce((acc, _detail) => acc + (_detail?.total_cost ?? 0), 0),
      };
    });

    setSupplierHeaders(headers);
  }, [currentForm]);

  useEffect(() => console.log(supplierHeaders), [supplierHeaders]);

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
              variant={isCreate || !item.included ? 'filled' : 'unstyled'}
              placeholder={isCreate ? 'To be quoted' : 'Brand/Model'}
              defaultValue={item?.brand_model}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              autosize
              // required={!readOnly && !isCreate && item.included}
              readOnly={readOnly || isCreate || !item.included}
            />
          </Table.Td>
        );

      case 'unit_cost':
        return (
          <Table.Td>
            <NumberInput
              key={form.key(`items.${index}.unit_cost`)}
              {...form.getInputProps(`items.${index}.unit_cost`)}
              variant={isCreate || !item.included ? 'filled' : 'unstyled'}
              placeholder={isCreate ? 'To be quoted' : 'Unit Cost'}
              defaultValue={item?.unit_cost}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              // clampBehavior={'strict'}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator={','}
              // required={!readOnly && !isCreate && item.included}
              readOnly={readOnly || isCreate || !item.included}
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
        console.log(values);

        if (handleCreateUpdate) {
          // handleCreateUpdate({
          //   ...values,
          //   purchase_request_id: currentData?.purchase_request_id,
          //   signed_type: signedType,
          //   rfq_date: values.rfq_date
          //     ? dayjs(values.rfq_date).format('YYYY-MM-DD')
          //     : '',
          //   opening_dt: values.opening_dt
          //     ? dayjs(values.opening_dt).format('YYYY-MM-DD HH:mm')
          //     : '',
          //   items: JSON.stringify(values.items),
          //   canvassers:
          //     values.canvassers.length > 0
          //       ? JSON.stringify(values.canvassers)
          //       : '',
          //   vat_registered: vatRegistered,
          // });
        }
      })}
    >
      <Stack p={'md'} justify={'center'}>
        <Card
          shadow={'xs'}
          padding={lgScreenAndBelow ? 'md' : 'lg'}
          radius={'xs'}
          withBorder
        >
          <Stack w={'100%'}>
            {!readOnly ? (
              <DynamicSelect
                key={form.key('bids_awards_committee_id')}
                {...form.getInputProps('bids_awards_committee_id')}
                label={'Bids and Awards Committee'}
                variant={
                  readOnly ||
                  currentData?.status === 'approved' ||
                  currentData?.status === 'awarded'
                    ? 'filled'
                    : 'unstyled'
                }
                sx={{
                  borderBottom: '2px solid var(--mantine-color-gray-5)',
                  input: {
                    minHeight: '30px',
                    height: '30px',
                  },
                }}
                endpoint={'/libraries/bids-awards-committees'}
                endpointParams={{ paginated: false }}
                column={'committee_name'}
                defaultData={
                  currentData?.bids_awards_committee_id
                    ? [
                        {
                          value: currentData?.bids_awards_committee_id ?? '',
                          label: currentData?.bids_awards_committee_name ?? '',
                        },
                      ]
                    : undefined
                }
                value={form.values.bids_awards_committee_id}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                placeholder={'Select a bids and awards committee...'}
                readOnly={readOnly}
                required={!readOnly}
              />
            ) : (
              <TextInput
                label={'Bids and Awards Committee'}
                variant={'unstyled'}
                placeholder={'None'}
                value={currentData?.bids_awards_committee_name ?? '-'}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                sx={{
                  borderBottom: '2px solid var(--mantine-color-gray-5)',
                  input: {
                    minHeight: '30px',
                    height: '30px',
                  },
                }}
                readOnly
              />
            )}

            {!readOnly ? (
              <DynamicSelect
                key={form.key('mode_procurement_id')}
                {...form.getInputProps('mode_procurement_id')}
                label={'Mode of Procurement'}
                variant={
                  readOnly ||
                  currentData?.status === 'approved' ||
                  currentData?.status === 'awarded'
                    ? 'filled'
                    : 'unstyled'
                }
                sx={{
                  borderBottom: '2px solid var(--mantine-color-gray-5)',
                  input: {
                    minHeight: '30px',
                    height: '30px',
                  },
                }}
                endpoint={'/libraries/procurement-modes'}
                endpointParams={{ paginated: false }}
                column={'mode_name'}
                defaultData={
                  currentData?.mode_procurement_id
                    ? [
                        {
                          value: currentData?.mode_procurement_id ?? '',
                          label: currentData?.procurement_mode_name ?? '',
                        },
                      ]
                    : undefined
                }
                value={form.values.mode_procurement_id}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                placeholder={'Select a mode of procurement...'}
                readOnly={readOnly}
                required={!readOnly}
              />
            ) : (
              <TextInput
                label={'Mode of Procurement'}
                variant={'unstyled'}
                placeholder={'None'}
                value={currentData?.procurement_mode_name ?? '-'}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                sx={{
                  borderBottom: '2px solid var(--mantine-color-gray-5)',
                  input: {
                    minHeight: '30px',
                    height: '30px',
                  },
                }}
                readOnly
              />
            )}
          </Stack>
        </Card>

        <Card
          shadow={'xs'}
          padding={lgScreenAndBelow ? 'md' : 'lg'}
          radius={'xs'}
          withBorder
        >
          <Stack align={'center'} w={'100%'} p={0} justify={'center'}>
            <Stack
              align={'center'}
              w={'100%'}
              p={0}
              justify={'center'}
              gap={0}
              mb={'md'}
            >
              <Text fz={lgScreenAndBelow ? 'h6' : 'h5'} fw={500}>
                Republic of the Philippines
              </Text>
              <Text fz={lgScreenAndBelow ? 'h5' : 'h4'} fw={500}>
                BIDS AND AWARDS COMMITTEE
              </Text>
              <Text fz={lgScreenAndBelow ? 'h5' : 'h4'} fw={500}>
                ABSTRACT OF BIDS OR QUOTATION
              </Text>
            </Stack>

            <Stack align={'center'} w={'100%'} p={0} justify={'center'}>
              <Flex
                w={'100%'}
                justify={'space-between'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
              >
                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                        Solicitation No.:
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
                    </Flex>
                    <TextInput
                      key={form.key('solicitation_no')}
                      {...form.getInputProps('solicitation_no')}
                      variant={'unstyled'}
                      placeholder={'Enter RFQ number here...'}
                      defaultValue={
                        readOnly ? undefined : form.values.solicitation_no
                      }
                      value={
                        readOnly ? currentData?.solicitation_no : undefined
                      }
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      sx={{
                        flexBasis: '49%',
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        input: {
                          minHeight: '30px',
                          height: '30px',
                        },
                      }}
                      required={!readOnly}
                      readOnly={readOnly}
                    />
                  </Group>
                </Stack>

                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                        Dated:
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
                    </Flex>
                    <DateInput
                      key={form.key('solicitation_date')}
                      {...form.getInputProps('solicitation_date')}
                      variant={'unstyled'}
                      valueFormat={'YYYY-MM-DD'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : form.values.solicitation_date
                            ? new Date(form.values.solicitation_date)
                            : undefined
                      }
                      value={
                        readOnly
                          ? currentData?.solicitation_date
                            ? new Date(currentData?.solicitation_date)
                            : undefined
                          : undefined
                      }
                      placeholder={'Enter the solicitation date here...'}
                      error={form.errors.solicitation_date && ''}
                      sx={{
                        flexBasis: '74%',
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        input: {
                          minHeight: '30px',
                          height: '30px',
                        },
                      }}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      leftSection={
                        !readOnly ? <IconCalendar size={18} /> : undefined
                      }
                      clearable
                      required={!readOnly}
                      readOnly={readOnly}
                    />
                  </Group>
                </Stack>

                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                        and opened on:
                      </Text>
                    </Flex>
                    <DateInput
                      key={form.key('opened_on')}
                      {...form.getInputProps('opened_on')}
                      variant={'unstyled'}
                      valueFormat={'YYYY-MM-DD'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : form.values.opened_on
                            ? new Date(form.values.opened_on)
                            : undefined
                      }
                      value={
                        readOnly
                          ? currentData?.opened_on
                            ? new Date(currentData?.opened_on)
                            : undefined
                          : undefined
                      }
                      placeholder={'Enter the opened on here...'}
                      error={form.errors.opened_on && ''}
                      sx={{
                        flexBasis: '53%',
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        input: {
                          minHeight: '30px',
                          height: '30px',
                        },
                      }}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      leftSection={
                        !readOnly ? <IconCalendar size={18} /> : undefined
                      }
                      clearable
                      readOnly={readOnly}
                    />
                  </Group>
                </Stack>

                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                        Abstract No.:
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
                    </Flex>
                    <TextInput
                      variant={'unstyled'}
                      placeholder={'Autogenerated'}
                      value={currentData?.abstract_no ?? ''}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      sx={{
                        flexBasis: '54%',
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        input: {
                          minHeight: '30px',
                          height: '30px',
                        },
                      }}
                      readOnly
                    />
                  </Group>
                </Stack>
              </Flex>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </form>
  );
});

AbstractQuotionContentClient.displayName = 'AbstractQuotionContentClient';

export default AbstractQuotionContentClient;
