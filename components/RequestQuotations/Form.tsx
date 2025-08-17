'use client';

import {
  Box,
  Card,
  Checkbox,
  Flex,
  Group,
  NumberInput,
  Stack,
  Switch,
  Table,
  Text,
  Textarea,
  TextInput,
  Tooltip,
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
import DynamicMultiselect from '../Generic/DynamicMultiselect';

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
    label: '',
    width: '2%',
  },
];

const FormClient = forwardRef<
  HTMLFormElement,
  ModalRequestQuotationContentProps
>(({ data, isCreate, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(
    () => ({
      copies: 1,
      signed_type: currentData?.signed_type ?? 'lce',
      rfq_date: currentData?.rfq_date ?? dayjs().format('YYYY-MM-DD'),
      rfq_no: currentData?.rfq_no ?? '',
      supplier_id: currentData?.supplier_id ?? '',
      opening_dt: currentData?.opening_dt ?? '',
      sig_approval_id: currentData?.sig_approval_id ?? '',
      items:
        currentData?.items &&
        typeof currentData?.items !== undefined &&
        currentData?.items.length > 0
          ? currentData?.items?.map((item, index) => ({
              key: randomId(),
              pr_item_id: item?.pr_item_id,
              stock_no: item.pr_item?.stock_no ?? 1,
              quantity: item.pr_item?.quantity,
              description: item.pr_item?.description ?? '-',
              brand_model: item.brand_model ?? '',
              unit_cost: item?.unit_cost ?? undefined,
              total_cost: item?.total_cost ?? undefined,
              included: item?.included ?? true,
            }))
          : [],
      vat_registered: currentData?.vat_registered,
      canvassers:
        currentData?.canvassers?.map((canvasser) => canvasser.user_id) ?? [],
    }),
    [currentData]
  );
  const [vatRegistered, setVatRegistered] = useState<boolean | undefined>(
    currentForm.vat_registered
  );
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
  });
  const [signedType, setSignedType] = useState<'lce' | 'bac'>(
    currentData?.signed_type ?? 'lce'
  );
  const [municipality, setMunicipality] = useState('Loading...');

  useEffect(() => {
    if (!isCreate) return;

    API.get(`/purchase-requests/${currentData?.purchase_request_id}`)
      .then((res) => {
        const resData: PurchaseRequestType = res?.data?.data;

        setCurrentData({
          ...currentData,
          items: resData?.items?.map((item) => ({
            ...item,
            pr_item_id: item.id,
            pr_item: {
              stock_no: item?.stock_no,
              quantity: item?.quantity,
              description: item?.description,
              awarded_to_id: item?.awarded_to_id,
            },
          })),
          pr_no: resData?.pr_no,
          funding_source_title: resData?.funding_source?.title,
          funding_source_location:
            resData?.funding_source?.location?.location_name,
        });
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
  }, [isCreate]);

  useEffect(() => {
    setCurrentData(data);
    setVatRegistered(data?.vat_registered);
  }, [data]);

  useEffect(() => {
    setSignedType(currentForm.signed_type);

    form.reset();
    form.setValues(currentForm);
  }, [currentForm]);

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

  const handleToggleIncludedSlider = (checked: boolean) => {
    form.setFieldValue(
      'items',
      form.getValues()?.items?.map((item) => ({
        ...item,
        included: checked,
      }))
    );
    form.setInitialValues(form.getValues());
    form.setValues(form.getValues());
  };

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
              variant={
                (isCreate || !item.included) && !readOnly
                  ? 'filled'
                  : !readOnly
                    ? 'default'
                    : 'unstyled'
              }
              placeholder={
                isCreate ? 'To be quoted' : readOnly ? '' : 'Brand/Model'
              }
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
              variant={
                (isCreate || !item.included) && !readOnly
                  ? 'filled'
                  : !readOnly
                    ? 'default'
                    : 'unstyled'
              }
              placeholder={
                isCreate ? 'To be quoted' : readOnly ? '' : 'Unit Cost'
              }
              defaultValue={item?.unit_cost}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator={','}
              readOnly={readOnly || isCreate || !item.included}
            />
          </Table.Td>
        );

      case 'total_cost':
        return (
          <Table.Td>
            <NumberInput
              variant={readOnly ? 'unstyled' : 'filled'}
              placeholder={
                isCreate ? 'To be quoted' : readOnly ? '' : 'Total Cost'
              }
              defaultValue={item?.total_cost}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
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
            purchase_request_id: currentData?.purchase_request_id,
            signed_type: signedType,
            rfq_date: values.rfq_date
              ? dayjs(values.rfq_date).format('YYYY-MM-DD')
              : '',
            opening_dt: values.opening_dt
              ? dayjs(values.opening_dt).format('YYYY-MM-DD HH:mm')
              : '',
            items: values.items ?? [],
            canvassers: values.canvassers ?? [],
            vat_registered: vatRegistered,
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
          <Flex
            w={'100%'}
            direction={lgScreenAndBelow ? 'column' : 'row'}
            gap={'sm'}
          >
            {isCreate && (
              <NumberInput
                key={form.key('copies')}
                {...form.getInputProps('copies')}
                variant={readOnly ? 'unstyled' : 'default'}
                label={'Copies'}
                placeholder={'Copies'}
                defaultValue={1}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                w={lgScreenAndBelow ? 'auto' : '100%'}
                min={1}
                max={10}
                clampBehavior={'strict'}
                allowDecimal={false}
                required
              />
            )}

            <Select
              key={form.key('signed_type')}
              {...form.getInputProps('signed_type')}
              variant={readOnly ? 'default' : 'default'}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              label={'Signed Type'}
              data={[
                { label: 'Signed LCE', value: 'lce' },
                { label: 'Signed BAC Chairman', value: 'bac' },
              ]}
              value={signedType}
              onChange={(_value, option) =>
                setSignedType((option.value as 'lce' | 'bac') ?? 'lce')
              }
              w={lgScreenAndBelow ? 'auto' : '100%'}
              searchable
              required={!readOnly}
              readOnly={readOnly}
            />
          </Flex>
        </Card>

        <Card
          shadow={'xs'}
          padding={lgScreenAndBelow ? 'md' : 'lg'}
          radius={'xs'}
          withBorder
        >
          <Stack align={'center'} w={'100%'} p={0} justify={'center'}>
            <Text fz={lgScreenAndBelow ? 'h5' : 'h4'} ta={'center'}>
              MUNICIPALITY OF {municipality}
              <br />
              BIDS AND AWARD COMMITTEE
            </Text>

            {signedType === 'bac' && (
              <Stack w={'100%'} justify={'flex-start'}>
                <Group>
                  <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                    Purchase Request No.:
                  </Text>
                  <TextInput
                    variant={'unstyled'}
                    placeholder={'None'}
                    defaultValue={
                      currentData?.pr_no ??
                      currentData?.purchase_request?.pr_no ??
                      '-'
                    }
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                      input: {
                        minHeight: '30px',
                        height: '30px',
                      },
                      flex: lgScreenAndBelow ? 0.5 : 0.3,
                    }}
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
                    defaultValue={
                      readOnly
                        ? undefined
                        : (currentData?.funding_source_title ??
                          currentData?.purchase_request?.funding_source?.title)
                    }
                    value={
                      readOnly
                        ? (currentData?.funding_source_title ??
                          currentData?.purchase_request?.funding_source?.title)
                        : undefined
                    }
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                      input: {
                        minHeight: '30px',
                        height: '30px',
                      },
                      flex: lgScreenAndBelow ? 0.5 : 0.3,
                    }}
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
                    defaultValue={
                      readOnly
                        ? undefined
                        : (currentData?.funding_source_location ??
                          currentData?.purchase_request?.funding_source
                            ?.location?.location_name)
                    }
                    value={
                      readOnly
                        ? (currentData?.funding_source_location ??
                          currentData?.purchase_request?.funding_source
                            ?.location?.location_name)
                        : undefined
                    }
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                      input: {
                        minHeight: '30px',
                        height: '30px',
                      },
                      flex: lgScreenAndBelow ? 0.5 : 0.3,
                    }}
                    readOnly
                  />
                </Group>
              </Stack>
            )}

            <Text fz={lgScreenAndBelow ? 'h4' : 'h3'} fw={700}>
              REQUEST FOR QUOTATION
            </Text>

            <Flex
              w={'100%'}
              justify={'flex-end'}
              direction={lgScreenAndBelow ? 'column' : 'row'}
            >
              <Stack>
                <Group>
                  <Box display={'inline-flex'}>
                    <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
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
                  </Box>
                  <DateInput
                    key={form.key('rfq_date')}
                    {...form.getInputProps('rfq_date')}
                    variant={'unstyled'}
                    valueFormat={'YYYY-MM-DD'}
                    defaultValue={
                      readOnly
                        ? undefined
                        : form.values.rfq_date
                          ? new Date(form.values.rfq_date)
                          : undefined
                    }
                    value={
                      readOnly
                        ? currentData?.rfq_date
                          ? new Date(currentData?.rfq_date)
                          : undefined
                        : undefined
                    }
                    placeholder={`Enter the ${signedType === 'lce' ? 'quotation' : 'solicitation'} date here...`}
                    error={form.errors.rfq_date && ''}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                      input: {
                        minHeight: '30px',
                        height: '30px',
                      },
                      flex: 1,
                    }}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    leftSection={
                      !readOnly ? <IconCalendar size={18} /> : undefined
                    }
                    highlightToday
                    clearable
                    required={!readOnly}
                    readOnly={readOnly}
                  />
                </Group>
                <Group>
                  <Box display={'inline-flex'}>
                    <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                      {signedType === 'bac' ? (
                        <>Solicitation No.:</>
                      ) : (
                        <>Quotation No.:</>
                      )}
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
                  </Box>
                  <TextInput
                    key={form.key('rfq_no')}
                    {...form.getInputProps('rfq_no')}
                    variant={'unstyled'}
                    placeholder={'Enter RFQ number here...'}
                    defaultValue={readOnly ? undefined : form.values.rfq_no}
                    value={readOnly ? currentData?.rfq_no : undefined}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                      input: {
                        minHeight: '30px',
                        height: '30px',
                      },
                      flex: 1,
                    }}
                    required={!readOnly}
                    readOnly={readOnly}
                  />
                </Group>
              </Stack>
            </Flex>

            <Flex
              w={'100%'}
              justify={'flex-start'}
              direction={lgScreenAndBelow ? 'column' : 'row'}
            >
              <Stack>
                <Group>
                  <Box display={'inline-flex'}>
                    <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                      Company Name / Supplier:
                    </Text>
                  </Box>
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('supplier_id')}
                      {...form.getInputProps('supplier_id')}
                      variant={
                        readOnly || currentData?.status === 'completed'
                          ? 'filled'
                          : 'unstyled'
                      }
                      sx={{
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        input: {
                          minHeight: '30px',
                          height: '30px',
                          flex: 1,
                        },
                      }}
                      endpoint={'/libraries/suppliers'}
                      endpointParams={{ paginated: false, show_all: true }}
                      column={'supplier_name'}
                      defaultData={
                        currentData?.supplier_id
                          ? [
                              {
                                value: currentData?.supplier_id ?? '',
                                label:
                                  currentData?.supplier?.supplier_name ?? '',
                              },
                            ]
                          : undefined
                      }
                      defaultValue={form.values.supplier_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      placeholder={'Select a supplier...'}
                      readOnly={readOnly || currentData?.status === 'completed'}
                    />
                  ) : (
                    <TextInput
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={currentData?.supplier?.supplier_name ?? '-'}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      sx={{
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        input: {
                          minHeight: '30px',
                          height: '30px',
                        },
                        flex: 1,
                      }}
                      readOnly
                    />
                  )}
                </Group>

                {readOnly && (
                  <Group>
                    <Box display={'inline-flex'}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                        Address
                      </Text>
                    </Box>
                    <TextInput
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={currentData?.supplier?.address}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      sx={{
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        input: {
                          minHeight: '30px',
                          height: '30px',
                        },
                        flex: 1,
                      }}
                      readOnly
                    />
                  </Group>
                )}
              </Stack>
            </Flex>

            <Stack w={'100%'} gap={0}>
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Sir / Madam:</Text>

              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                Please quote your lowest price on the item/s listed below,
                subject to the conditions herein and submit your quotation duly
                signed by your representative.
              </Text>
            </Stack>

            <Flex
              w={'100%'}
              justify={'flex-end'}
              direction={lgScreenAndBelow ? 'column' : 'row'}
            >
              <Group
                justify={signedType === 'lce' ? 'space-between' : 'flex-end'}
                flex={0.5}
                gap={'xl'}
              >
                {signedType === 'lce' && (
                  <DateTimePicker
                    key={form.key('opening_dt')}
                    {...form.getInputProps('opening_dt')}
                    variant={'unstyled'}
                    label={'Date and Time of Opening'}
                    valueFormat={'YYYY-MM-DD hh:mm A'}
                    defaultValue={
                      readOnly
                        ? undefined
                        : form.values.opening_dt
                          ? new Date(form.values.opening_dt)
                          : undefined
                    }
                    value={
                      readOnly
                        ? currentData?.opening_dt
                          ? new Date(currentData?.opening_dt)
                          : undefined
                        : undefined
                    }
                    placeholder={
                      readOnly ? 'None' : 'Enter the opening date time here...'
                    }
                    error={form?.errors?.opening_dt && ''}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                      flex: 1,
                    }}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    leftSection={
                      !readOnly ? <IconCalendarClock size={18} /> : undefined
                    }
                    clearable
                    readOnly={readOnly}
                  />
                )}

                {!readOnly ? (
                  <DynamicSelect
                    key={form.key('sig_approval_id')}
                    {...form.getInputProps('sig_approval_id')}
                    variant={'unstyled'}
                    label={
                      signedType === 'bac' ? 'BAC Chairman' : 'Municipal Mayor'
                    }
                    placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                    endpoint={'/libraries/signatories'}
                    endpointParams={{
                      paginated: false,
                      show_all: true,
                      document: 'rfq',
                      signatory_type:
                        signedType === 'lce' ? 'approval_lce' : 'approval_bac',
                    }}
                    defaultData={
                      currentData?.sig_approval_id
                        ? [
                            {
                              value: currentData?.sig_approval_id ?? '',
                              label:
                                currentData?.signatory_approval?.user
                                  ?.fullname ?? '',
                            },
                          ]
                        : undefined
                    }
                    valueColumn={'signatory_id'}
                    column={'fullname_designation'}
                    defaultValue={form.values.sig_approval_id}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                      flex: 1,
                    }}
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
                    value={
                      currentData?.signatory_approval?.user?.fullname ?? '-'
                    }
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                      flex: 1,
                    }}
                    readOnly
                  />
                )}
              </Group>
            </Flex>

            <Stack w={'100%'} mt={'lg'} gap={0}>
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

                      if (signedType === 'bac' && header.id === 'brand_model')
                        return;

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
                            {header.id === 'include_checkbox' && (
                              <Tooltip label='Toggle All' refProp='rootRef'>
                                <Switch
                                  w={'100%'}
                                  radius={lgScreenAndBelow ? 'xs' : 'sm'}
                                  onLabel={'Yes'}
                                  offLabel={'No'}
                                  sx={{
                                    justifyItems: 'center',
                                  }}
                                  color={'var(--mantine-color-primary-9)'}
                                  onChange={(e) =>
                                    handleToggleIncludedSlider(
                                      e.currentTarget.checked
                                    )
                                  }
                                  defaultChecked
                                />
                              </Tooltip>
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
                          (!readOnly && header.id === 'total_cost') ||
                          (signedType === 'bac' && header.id === 'brand_model')
                        ) {
                          return null;
                        }

                        return (
                          <React.Fragment
                            key={`field-${item.key}-${header.id}`}
                          >
                            {renderDynamicTdContent(header.id, item, index)}
                          </React.Fragment>
                        );
                      })}

                      {!readOnly && (
                        <Table.Td valign={'top'} ta={'center'} pt={'sm'}>
                          <Tooltip label='Included?' refProp='rootRef'>
                            <Switch
                              key={form.key(`items.${index}.included`)}
                              {...form.getInputProps(`items.${index}.included`)}
                              w={'100%'}
                              radius={lgScreenAndBelow ? 'xs' : 'sm'}
                              onLabel={'Yes'}
                              offLabel={'No'}
                              sx={{
                                justifyItems: 'center',
                              }}
                              color={'var(--mantine-color-primary-9)'}
                              defaultChecked={item.included}
                            />
                          </Tooltip>

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

                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Textarea
                        variant={readOnly ? 'unstyled' : 'filled'}
                        label={'Purpose'}
                        placeholder={'Purpose'}
                        value={
                          currentData?.purchase_request?.purpose ??
                          currentData?.purpose ??
                          '-'
                        }
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        autosize
                        autoCapitalize={'sentences'}
                        readOnly
                      />
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Stack>

            <Stack p={'md'} gap={0}>
              <Text fz={lgScreenAndBelow ? 'h4' : 'h3'} fw={700}>
                Conditions
              </Text>

              <Stack pl={'md'}>
                <List type='ordered' size={lgScreenAndBelow ? 'sm' : 'md'}>
                  <List.Item>
                    All entries must be legibly printed/written.
                  </List.Item>
                  <List.Item>
                    All taxes are inclusive. Please check whether you are
                    <Stack mt='xs' mb='md'>
                      <Checkbox
                        label='VAT Registered OR'
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        variant='outline'
                        radius='xl'
                        checked={vatRegistered === true}
                        onChange={(e) => {
                          !readOnly &&
                            setVatRegistered(
                              e.currentTarget.checked ? true : undefined
                            );
                        }}
                      />
                      <Checkbox
                        label='Non VAT Registered'
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        variant='outline'
                        radius='xl'
                        checked={vatRegistered === false}
                        onChange={(e) => {
                          !readOnly &&
                            setVatRegistered(
                              e.currentTarget.checked ? false : undefined
                            );
                        }}
                      />
                    </Stack>
                  </List.Item>
                  <List.Item>
                    Warranty shall be for a period of three (3) months for
                    Expandable supplies and one (1) year for Non-expendable
                    supplies from date of acceptance by the procuring entity of
                    the delivered supplies, If applicable
                  </List.Item>
                  <List.Item>
                    PhilGEPS registration certificate shall be attached upon
                    submission of the quotation, if applicable.
                  </List.Item>
                  <List.Item>
                    Bidders shall submit original brochures showing
                    certifications of the products being offered, if applicable
                  </List.Item>
                  <List.Item>
                    The Procuring entity reserves the right to waive any defects
                    in the tender or offer as well as the right to accept the
                    bid most advantageous to the Municipal Government.
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

            <Flex
              w={'100%'}
              justify={'flex-end'}
              direction={lgScreenAndBelow ? 'column' : 'row'}
              gap={'xl'}
              mb={'lg'}
            >
              {!readOnly ? (
                <DynamicMultiselect
                  key={form.key('canvassers')}
                  {...form.getInputProps('canvassers')}
                  variant={'unstyled'}
                  endpoint={'/accounts/users'}
                  endpointParams={{
                    paginated: false,
                    show_all: true,
                    show_inactive: false,
                  }}
                  column={'fullname'}
                  label={'CANVASSERS'}
                  value={(form.values.canvassers as string[]) ?? undefined}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  sx={{
                    borderBottom: '2px solid var(--mantine-color-gray-5)',
                    flex: 0.5,
                  }}
                  readOnly={readOnly}
                />
              ) : (
                <Textarea
                  label={'CANVASSERS'}
                  variant={'unstyled'}
                  placeholder={'None'}
                  value={
                    currentData?.canvassers
                      ?.map((canvasser, i) => canvasser.user?.fullname)
                      .join('\n') ?? '-'
                  }
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  sx={{
                    borderBottom: '2px solid var(--mantine-color-gray-5)',
                    flex: 0.5,
                  }}
                  autosize
                  readOnly
                />
              )}
            </Flex>
          </Stack>
        </Card>
      </Stack>
    </form>
  );
});

FormClient.displayName = 'FormClient';

export default FormClient;
