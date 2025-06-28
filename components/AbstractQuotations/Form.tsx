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
import DynamicSelect from '../Generic/DynamicSelect';
import { useForm } from '@mantine/form';
import { randomId, useMediaQuery } from '@mantine/hooks';
import { IconAsterisk, IconCalendar } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { Tooltip } from '@mantine/core';
import { NumberFormatter } from '@mantine/core';
import { Select } from '@mantine/core';
import { Skeleton } from '@mantine/core';

const defaultItemHeaders: PurchaseRequestItemHeader[] = [
  {
    id: 'stock_no',
    label: 'Stock No.',
    width: '120px',
  },
  {
    id: 'quantity',
    label: 'QTY.',
    width: '120px',
  },
  {
    id: 'unit_issue',
    label: 'UNIT',
    width: '140px',
  },
  {
    id: 'description',
    label: 'DESCRIPTION/SPECIFICATION OF ARTICLES',
    width: '450px',
  },
];

const FormClient = forwardRef<
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
              unit_issue: item.pr_item?.unit_issue?.unit_name,
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
              awardee_id: item?.awardee_id ?? '',
              awardee_name: item.awardee?.supplier_name ?? '',
              document_type: item?.document_type ?? undefined,
              included:
                item?.included ??
                (item.pr_item?.awarded_to_id === undefined ||
                item.pr_item?.awarded_to_id === null ||
                !!item.pr_item.awarded_to_id === false
                  ? true
                  : false),
            }))
          : [],
    }),
    [currentData]
  );
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
  });
  const [itemHeaders, setItemHeaders] = useState(defaultItemHeaders);
  const [supplierHeaders, setSupplierHeaders] = useState<
    AbstractQuotationSupplierHeaderType[]
  >([]);

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

    setSupplierHeaders(headers as AbstractQuotationSupplierHeaderType[]);
  }, [currentForm]);

  useEffect(() => {
    const headers: PurchaseRequestItemHeader[] = supplierHeaders.map(
      (head) => ({
        id: 'supplier',
        label: head.supplier_id,
        width: '600px',
      })
    );

    setItemHeaders([
      ...defaultItemHeaders,
      ...headers,
      {
        id: 'awardee',
        label: 'Awardee',
        width: '350px',
      },
      {
        id: 'include_checkbox',
        label: 'Unawarded',
        width: '3px',
      },
    ]);
  }, [supplierHeaders]);

  const renderDynamicTdContent = (
    id: string,
    item: AbstractQuotationItemsFieldType,
    index: number,
    supplierId?: string
  ): ReactNode => {
    switch (id) {
      case 'stock_no':
        return (
          <Table.Td>
            <NumberInput
              variant={readOnly ? 'unstyled' : 'filled'}
              placeholder={'Stock No'}
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
              placeholder={'QTY'}
              defaultValue={item?.quantity}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              clampBehavior={'strict'}
              allowDecimal={false}
              readOnly
            />
          </Table.Td>
        );

      case 'unit_issue':
        return (
          <Table.Td>
            <TextInput
              variant={readOnly ? 'unstyled' : 'filled'}
              placeholder={'None'}
              defaultValue={item.unit_issue}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              flex={1}
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
              defaultValue={item?.description ?? '-'}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              autosize
              readOnly
            />
          </Table.Td>
        );

      case 'supplier':
        const detalIndex =
          item.details?.findIndex(
            (detail) => detail.supplier_id === supplierId
          ) ?? 0;
        const detail = item.details?.find(
          (detail) => detail.supplier_id === supplierId
        );

        return (
          <>
            <Table.Td>
              <Tooltip
                label={
                  <>
                    <strong>DESCRIPTION/SPECIFICATION OF ARTICLES</strong>
                    <br />
                    {item.description?.split('\n')?.map((description) => (
                      <>
                        {description}
                        <br />
                      </>
                    ))}
                  </>
                }
                w={350}
                position={'left-start'}
                offset={30}
                disabled={readOnly}
                multiline
              >
                <Textarea
                  key={form.key(
                    `items.${index}.details.${detalIndex}.brand_model`
                  )}
                  {...form.getInputProps(
                    `items.${index}.details.${detalIndex}.brand_model`
                  )}
                  variant={isCreate || !item.included ? 'filled' : 'default'}
                  placeholder={
                    isCreate
                      ? 'To be quoted'
                      : readOnly
                        ? 'None'
                        : 'Brand/Model'
                  }
                  defaultValue={detail?.brand_model}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  autosize
                  readOnly={readOnly || isCreate || !item.included}
                />
              </Tooltip>
            </Table.Td>
            <Table.Td>
              <Tooltip
                label={
                  <>
                    <strong>DESCRIPTION/SPECIFICATION OF ARTICLES</strong>
                    <br />
                    {item.description?.split('\n')?.map((description) => (
                      <>
                        {description}
                        <br />
                      </>
                    ))}
                  </>
                }
                w={350}
                position={'left-start'}
                offset={30}
                disabled={readOnly}
                multiline
              >
                <NumberInput
                  key={form.key(
                    `items.${index}.details.${detalIndex}.unit_cost`
                  )}
                  {...form.getInputProps(
                    `items.${index}.details.${detalIndex}.unit_cost`
                  )}
                  variant={isCreate || !item.included ? 'filled' : 'default'}
                  placeholder={isCreate ? 'To be quoted' : 'Unit Cost'}
                  defaultValue={detail?.unit_cost}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  min={0}
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator={','}
                  readOnly={readOnly || isCreate || !item.included}
                />
              </Tooltip>
            </Table.Td>

            {readOnly && (
              <Table.Td>
                <NumberInput
                  variant={readOnly ? 'unstyled' : 'filled'}
                  placeholder={'Total Cost'}
                  defaultValue={detail?.total_cost}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  min={0}
                  clampBehavior={'strict'}
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator={','}
                  readOnly
                />
              </Table.Td>
            )}
          </>
        );

      case 'awardee':
        return (
          <Table.Td>
            {!readOnly ? (
              <Tooltip
                label={
                  <>
                    <strong>DESCRIPTION/SPECIFICATION OF ARTICLES</strong>
                    <br />
                    {item.description?.split('\n')?.map((description) => (
                      <>
                        {description}
                        <br />
                      </>
                    ))}
                  </>
                }
                w={350}
                position={'left-start'}
                offset={30}
                multiline
              >
                <DynamicSelect
                  key={form.key(`items.${index}.awardee_id`)}
                  {...form.getInputProps(`items.${index}.awardee_id`)}
                  variant={readOnly ? 'unstyled' : 'default'}
                  label={'Awardee'}
                  placeholder={'Select an awardee here...'}
                  defaultData={
                    supplierHeaders &&
                    supplierHeaders?.map((supplier) => ({
                      value: supplier.supplier_id,
                      label: supplier.supplier_name,
                    }))
                  }
                  value={item?.awardee_id}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  readOnly={readOnly}
                  disableFetch
                />
              </Tooltip>
            ) : (
              <TextInput
                label={'Awardee'}
                variant={'unstyled'}
                placeholder={'None'}
                defaultValue={item.awardee_name}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                readOnly
              />
            )}

            <Select
              key={form.key(`items.${index}.document_type`)}
              {...form.getInputProps(`items.${index}.document_type`)}
              variant={readOnly ? 'unstyled' : 'default'}
              placeholder={readOnly ? 'None' : 'Select a document type here...'}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              label={'Document Type'}
              data={[
                { label: 'Purchase Order', value: 'po' },
                { label: 'Job Order', value: 'jo' },
              ]}
              value={item.document_type}
              mt={'md'}
              searchable
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
          const items = values.items.map((item) => ({
            pr_item_id: item.pr_item_id,
            awardee_id: item.awardee_id,
            document_type: item.document_type,
            included: item.included,
            details: item.details?.map((detail) => ({
              supplier_id: detail.supplier_id,
              brand_model: detail?.brand_model ?? '',
              quantity: item.quantity,
              unit_cost: detail.unit_cost,
            })),
          }));

          handleCreateUpdate({
            ...values,
            purchase_request_id: currentData?.purchase_request_id,
            solicitation_date: values.solicitation_date
              ? dayjs(values.solicitation_date).format('YYYY-MM-DD')
              : '',
            opened_on: values.opened_on
              ? dayjs(values.opened_on).format('YYYY-MM-DD HH:mm')
              : '',
            items: items ?? [],
          });
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
                    : 'default'
                }
                endpoint={'/libraries/bids-awards-committees'}
                endpointParams={{
                  paginated: false,
                  show_all: true,
                }}
                column={'committee_name'}
                defaultData={
                  currentData?.bids_awards_committee_id
                    ? [
                        {
                          value: currentData?.bids_awards_committee_id ?? '',
                          label:
                            currentData?.bids_awards_committee
                              ?.committee_name ?? '',
                        },
                      ]
                    : undefined
                }
                value={form.values.bids_awards_committee_id}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                placeholder={
                  readOnly ? 'None' : 'Select a bids and awards committee...'
                }
                readOnly={readOnly}
                required={!readOnly}
              />
            ) : (
              <TextInput
                label={'Bids and Awards Committee'}
                variant={'unstyled'}
                placeholder={'None'}
                value={
                  currentData?.bids_awards_committee?.committee_name ?? '-'
                }
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
                    : 'default'
                }
                endpoint={'/libraries/procurement-modes'}
                endpointParams={{
                  paginated: false,
                  show_all: true,
                }}
                column={'mode_name'}
                defaultData={
                  currentData?.mode_procurement_id
                    ? [
                        {
                          value: currentData?.mode_procurement_id ?? '',
                          label: currentData?.mode_procurement?.mode_name ?? '',
                        },
                      ]
                    : undefined
                }
                value={form.values.mode_procurement_id}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                placeholder={
                  readOnly ? 'None' : 'Select a mode of procurement...'
                }
                readOnly={readOnly}
                required={!readOnly}
              />
            ) : (
              <TextInput
                label={'Mode of Procurement'}
                variant={'unstyled'}
                placeholder={'None'}
                value={currentData?.mode_procurement?.mode_name ?? '-'}
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
                      placeholder={
                        readOnly
                          ? 'None'
                          : 'Enter the solicitation date here...'
                      }
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
                      required={!readOnly}
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

            <Stack
              bd={'1px solid var(--mantine-color-gray-7)'}
              w={'100%'}
              mt={'lg'}
              gap={0}
            >
              <Table.ScrollContainer
                minWidth={500}
                w={readOnly ? 'calc(100vw - 8.6em)' : 'calc(100vw - 6.7em)'}
                h={'calc(100vh - 20em)'}
              >
                <Table
                  withColumnBorders
                  withRowBorders
                  verticalSpacing={'sm'}
                  withTableBorder
                  m={0}
                  borderColor={'var(--mantine-color-gray-8)'}
                  stickyHeader
                  stickyHeaderOffset={-1}
                >
                  <Table.Thead>
                    <Table.Tr
                      sx={{
                        backgroundColor: 'var(--mantine-color-gray-2)',
                        th: {
                          borderLeft: '1px solid',
                        },
                      }}
                    >
                      {itemHeaders.map((header) => {
                        const supplierHeader =
                          header.id === 'supplier'
                            ? supplierHeaders.find(
                                (supplier) =>
                                  supplier.supplier_id === header?.label
                              )
                            : undefined;

                        if (readOnly && header.id === 'include_checkbox')
                          return;

                        return (
                          <Table.Th
                            key={
                              header.id === 'supplier'
                                ? header.label
                                : header.id
                            }
                            w={header?.width ?? undefined}
                            miw={header?.width ?? undefined}
                            fz={lgScreenAndBelow ? 'sm' : 'md'}
                            rowSpan={header.id === 'supplier' ? 1 : 2}
                            colSpan={
                              header.id === 'supplier' ? (readOnly ? 3 : 2) : 1
                            }
                          >
                            <Group gap={1} align={'center'} justify={'center'}>
                              {header.id === 'supplier'
                                ? supplierHeader?.supplier_name
                                : header.label}{' '}
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
                    <Table.Tr
                      sx={{
                        lineHeight: 0.4,
                        backgroundColor: 'var(--mantine-color-gray-2)',
                        th: {
                          border: '1px solid',
                        },
                      }}
                    >
                      {itemHeaders.map((header, index) => {
                        if (header.id !== 'supplier') return;

                        return (
                          <React.Fragment key={header.label}>
                            <Table.Th
                              ta={'center'}
                              w={'150px'}
                              miw={'150px'}
                              fz={lgScreenAndBelow ? 'sm' : 'md'}
                            >
                              Brand
                            </Table.Th>
                            <Table.Th
                              ta={'center'}
                              w={'225px'}
                              miw={'225px'}
                              fz={lgScreenAndBelow ? 'sm' : 'md'}
                            >
                              Unit Cost
                            </Table.Th>

                            {readOnly && (
                              <Table.Th
                                ta={'center'}
                                w={'225px'}
                                miw={'225px'}
                                fz={lgScreenAndBelow ? 'sm' : 'md'}
                              >
                                Total Cost
                              </Table.Th>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {form.getValues().items.length === 0 &&
                      Array.from({ length: 5 }).map((_, i) => (
                        <Table.Tr key={i}>
                          <Table.Td colSpan={supplierHeaders.length * 3 + 5}>
                            <Skeleton height={30} radius='sm' />
                          </Table.Td>
                        </Table.Tr>
                      ))}

                    {form.getValues().items.map((item, index) => (
                      <Table.Tr
                        key={`item-${item.key}`}
                        sx={{ verticalAlign: 'top' }}
                      >
                        {itemHeaders.map((header) => {
                          if (header.id === 'include_checkbox') {
                            return null;
                          }

                          return (
                            <React.Fragment
                              key={`field-${item.key}-${header.id === 'supplier' ? header.label : header.id}`}
                            >
                              {renderDynamicTdContent(
                                header.id,
                                item,
                                index,
                                header.id === 'supplier'
                                  ? header.label
                                  : undefined
                              )}
                            </React.Fragment>
                          );
                        })}

                        {!readOnly && (
                          <Table.Td valign={'top'} ta={'center'} pt={'sm'}>
                            <Checkbox
                              key={form.key(`items.${index}.included`)}
                              {...form.getInputProps(`items.${index}.included`)}
                              w={'100%'}
                              size={lgScreenAndBelow ? 'sm' : 'md'}
                              color={'var(--mantine-color-primary-9)'}
                              defaultChecked={item.included}
                              sx={{
                                justifyItems: 'center',
                              }}
                              disabled
                            />
                            <input
                              key={form.key(`items.${index}.quantity`)}
                              {...form.getInputProps(`items.${index}.quantity`)}
                              type={'hidden'}
                              value={item.quantity}
                            />
                            <input
                              key={form.key(`items.${index}.pr_item_id`)}
                              {...form.getInputProps(
                                `items.${index}.pr_item_id`
                              )}
                              type={'hidden'}
                              value={item.pr_item_id}
                            />
                          </Table.Td>
                        )}
                      </Table.Tr>
                    ))}

                    {readOnly && (
                      <Table.Tr>
                        <Table.Td colSpan={4}></Table.Td>

                        {supplierHeaders?.map((supplier) => (
                          <React.Fragment key={supplier.supplier_id}>
                            <Table.Td></Table.Td>
                            <Table.Td></Table.Td>
                            <Table.Td>
                              <NumberFormatter
                                style={{
                                  fontSize: lgScreenAndBelow
                                    ? '0.75rem'
                                    : '0.95rem',
                                  fontWeight: 600,
                                }}
                                prefix={'P '}
                                value={supplier.total_cost}
                                decimalScale={2}
                                fixedDecimalScale
                                thousandSeparator
                              />
                            </Table.Td>
                          </React.Fragment>
                        ))}

                        <Table.Td></Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
              <Table
                withColumnBorders
                withRowBorders
                verticalSpacing={'sm'}
                withTableBorder
                m={0}
                borderColor={'var(--mantine-color-gray-8)'}
              >
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      <Textarea
                        label={'Purpose'}
                        variant={readOnly ? 'unstyled' : 'filled'}
                        placeholder={'Purpose'}
                        value={currentData?.purchase_request?.purpose}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        autosize
                        readOnly
                      />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Textarea
                        key={form.key('bac_action')}
                        {...form.getInputProps('bac_action')}
                        label={'BAC Action'}
                        variant={readOnly ? 'unstyled' : 'default'}
                        placeholder={readOnly ? '' : 'Enter BAC action here...'}
                        defaultValue={
                          readOnly ? undefined : form.values.bac_action
                        }
                        value={readOnly ? currentData?.bac_action : undefined}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        autosize
                        readOnly={readOnly}
                        required={!readOnly}
                      />
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Stack>

            <Stack
              align={'center'}
              w={'100%'}
              p={0}
              my={'lg'}
              justify={'center'}
            >
              <Flex
                w={'100%'}
                justify={'space-between'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
              >
                <Stack px={'sm'}>
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('sig_twg_chairperson_id')}
                      {...form.getInputProps('sig_twg_chairperson_id')}
                      label={'BAC-TWG Chairperson'}
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
                      placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                      endpoint={'/libraries/signatories'}
                      endpointParams={{
                        paginated: false,
                        show_all: true,
                        document: 'aoq',
                        signatory_type: 'twg_chairperson',
                      }}
                      valueColumn={'signatory_id'}
                      column={'fullname_designation'}
                      defaultData={
                        currentData?.sig_twg_chairperson_id
                          ? [
                              {
                                value:
                                  currentData?.sig_twg_chairperson_id ?? '',
                                label:
                                  currentData?.signatory_twg_chairperson?.user
                                    ?.fullname ?? '',
                              },
                            ]
                          : undefined
                      }
                      value={form.values.sig_twg_chairperson_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      readOnly={readOnly}
                    />
                  ) : (
                    <TextInput
                      label={'BAC-TWG Chairperson'}
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={
                        currentData?.signatory_twg_chairperson?.user
                          ?.fullname ?? '-'
                      }
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

                <Stack px={'sm'}>
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('sig_twg_member_1_id')}
                      {...form.getInputProps('sig_twg_member_1_id')}
                      label={'TWG Member'}
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
                      placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                      endpoint={'/libraries/signatories'}
                      endpointParams={{
                        paginated: false,
                        show_all: true,
                        document: 'aoq',
                        signatory_type: 'twg_member',
                      }}
                      valueColumn={'signatory_id'}
                      column={'fullname_designation'}
                      defaultData={
                        currentData?.sig_twg_member_1_id
                          ? [
                              {
                                value: currentData?.sig_twg_member_1_id ?? '',
                                label:
                                  currentData?.signatory_twg_member_1?.user
                                    ?.fullname ?? '',
                              },
                            ]
                          : undefined
                      }
                      value={form.values.sig_twg_member_1_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      readOnly={readOnly}
                    />
                  ) : (
                    <TextInput
                      label={'TWG Member'}
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={
                        currentData?.signatory_twg_member_1?.user?.fullname ??
                        '-'
                      }
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

                <Stack px={'sm'}>
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('sig_twg_member_2_id')}
                      {...form.getInputProps('sig_twg_member_2_id')}
                      label={'TWG Member'}
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
                      placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                      endpoint={'/libraries/signatories'}
                      endpointParams={{
                        paginated: false,
                        show_all: true,
                        document: 'aoq',
                        signatory_type: 'twg_member',
                      }}
                      valueColumn={'signatory_id'}
                      column={'fullname_designation'}
                      defaultData={
                        currentData?.sig_twg_member_2_id
                          ? [
                              {
                                value: currentData?.sig_twg_member_2_id ?? '',
                                label:
                                  currentData?.signatory_twg_member_2?.user
                                    ?.fullname ?? '',
                              },
                            ]
                          : undefined
                      }
                      value={form.values.sig_twg_member_2_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      readOnly={readOnly}
                    />
                  ) : (
                    <TextInput
                      label={'TWG Member'}
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={
                        currentData?.signatory_twg_member_2?.user?.fullname ??
                        '-'
                      }
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
              </Flex>
            </Stack>

            <Stack
              align={'center'}
              w={'100%'}
              p={0}
              my={'lg'}
              justify={'center'}
            >
              <Flex
                w={'100%'}
                justify={'space-around'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
              >
                <Stack px={'sm'}>
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('sig_chairman_id')}
                      {...form.getInputProps('sig_chairman_id')}
                      label={'Chairman & Presiding Officer'}
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
                      placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                      endpoint={'/libraries/signatories'}
                      endpointParams={{
                        paginated: false,
                        show_all: true,
                        document: 'aoq',
                        signatory_type: 'chairman',
                      }}
                      valueColumn={'signatory_id'}
                      column={'fullname_designation'}
                      defaultData={
                        currentData?.sig_chairman_id
                          ? [
                              {
                                value: currentData?.sig_chairman_id ?? '',
                                label:
                                  currentData?.signatory_chairman?.user
                                    ?.fullname ?? '',
                              },
                            ]
                          : undefined
                      }
                      value={form.values.sig_chairman_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      readOnly={readOnly}
                    />
                  ) : (
                    <TextInput
                      label={'Chairman & Presiding Officer'}
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={
                        currentData?.signatory_chairman?.user?.fullname ?? '-'
                      }
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

                <Stack px={'sm'}>
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('sig_vice_chairman_id')}
                      {...form.getInputProps('sig_vice_chairman_id')}
                      label={'Vice Chairman'}
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
                      placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                      endpoint={'/libraries/signatories'}
                      endpointParams={{
                        paginated: false,
                        show_all: true,
                        document: 'aoq',
                        signatory_type: 'vice_chairman',
                      }}
                      valueColumn={'signatory_id'}
                      column={'fullname_designation'}
                      defaultData={
                        currentData?.sig_vice_chairman_id
                          ? [
                              {
                                value: currentData?.sig_vice_chairman_id ?? '',
                                label:
                                  currentData?.signatory_vice_chairman?.user
                                    ?.fullname ?? '',
                              },
                            ]
                          : undefined
                      }
                      value={form.values.sig_vice_chairman_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      readOnly={readOnly}
                    />
                  ) : (
                    <TextInput
                      label={'Vice Chairman'}
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={
                        currentData?.signatory_vice_chairman?.user?.fullname ??
                        '-'
                      }
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
              </Flex>
            </Stack>

            <Stack
              align={'center'}
              w={'100%'}
              p={0}
              my={'lg'}
              justify={'center'}
            >
              <Flex
                w={'100%'}
                justify={'space-between'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
              >
                <Stack px={'sm'}>
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('sig_member_1_id')}
                      {...form.getInputProps('sig_member_1_id')}
                      label={'Member'}
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
                      placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                      endpoint={'/libraries/signatories'}
                      endpointParams={{
                        paginated: false,
                        show_all: true,
                        document: 'aoq',
                        signatory_type: 'member',
                      }}
                      valueColumn={'signatory_id'}
                      column={'fullname_designation'}
                      defaultData={
                        currentData?.sig_member_1_id
                          ? [
                              {
                                value: currentData?.sig_member_1_id ?? '',
                                label:
                                  currentData?.signatory_member_1?.user
                                    ?.fullname ?? '',
                              },
                            ]
                          : undefined
                      }
                      value={form.values.sig_member_1_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      readOnly={readOnly}
                    />
                  ) : (
                    <TextInput
                      label={'Member'}
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={
                        currentData?.signatory_member_1?.user?.fullname ?? '-'
                      }
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

                <Stack px={'sm'}>
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('sig_member_2_id')}
                      {...form.getInputProps('sig_member_2_id')}
                      label={'Member'}
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
                      placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                      endpoint={'/libraries/signatories'}
                      endpointParams={{
                        paginated: false,
                        show_all: true,
                        document: 'aoq',
                        signatory_type: 'member',
                      }}
                      valueColumn={'signatory_id'}
                      column={'fullname_designation'}
                      defaultData={
                        currentData?.sig_member_2_id
                          ? [
                              {
                                value: currentData?.sig_member_2_id ?? '',
                                label:
                                  currentData?.signatory_member_2?.user
                                    ?.fullname ?? '',
                              },
                            ]
                          : undefined
                      }
                      value={form.values.sig_member_2_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      readOnly={readOnly}
                    />
                  ) : (
                    <TextInput
                      label={'Member'}
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={
                        currentData?.signatory_member_2?.user?.fullname ?? '-'
                      }
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

                <Stack px={'sm'}>
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('sig_member_3_id')}
                      {...form.getInputProps('sig_member_3_id')}
                      label={'Member'}
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
                      placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                      endpoint={'/libraries/signatories'}
                      endpointParams={{
                        paginated: false,
                        show_all: true,
                        document: 'aoq',
                        signatory_type: 'member',
                      }}
                      valueColumn={'signatory_id'}
                      column={'fullname_designation'}
                      defaultData={
                        currentData?.sig_member_3_id
                          ? [
                              {
                                value: currentData?.sig_member_3_id ?? '',
                                label:
                                  currentData?.signatory_member_3?.user
                                    ?.fullname ?? '',
                              },
                            ]
                          : undefined
                      }
                      value={form.values.sig_member_3_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      readOnly={readOnly}
                    />
                  ) : (
                    <TextInput
                      label={'Member'}
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={
                        currentData?.signatory_member_3?.user?.fullname ?? '-'
                      }
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
              </Flex>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </form>
  );
});

FormClient.displayName = 'FormClient';

export default FormClient;
