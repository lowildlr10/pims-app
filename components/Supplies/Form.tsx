import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import { Card, Flex, Group, Text } from '@mantine/core';
import { Select } from '@mantine/core';
import { NumberInput, Stack, Table, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { randomId, useMediaQuery } from '@mantine/hooks';
import { IconAsterisk, IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ToWords } from 'to-words';
import DynamicAutocomplete from '../Generic/DynamicAutocomplete';
import DynamicSelect from '../Generic/DynamicSelect';

const itemHeaders: PurchaseRequestItemHeader[] = [
  {
    id: 'stock_no',
    label: 'Stock No.',
    width: '12%',
  },
  {
    id: 'unit_issue',
    label: 'Unit',
    width: '14%',
  },
  {
    id: 'description',
    label: 'Item and Description',
    width: '30%',
    required: true,
  },
  {
    id: 'quantity',
    label: 'Qty',
    width: '12%',
  },
  {
    id: 'unit_cost',
    label: 'Unit Cost',
    width: '16%',
  },
  {
    id: 'total_cost',
    label: 'Amount',
    width: '16%',
  },
];

const PurchaseOrderContentClient = forwardRef<
  HTMLFormElement,
  ModalPurchaseOrderContentProps
>(({ data, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(() => {
    const handleConvertAmountToWords = (amount: number) => {
      const toWords = new ToWords({
        localeCode: 'en-PH',
        converterOptions: {
          currency: true,
          ignoreDecimal: false,
          ignoreZeroCurrency: false,
          doNotAddOnly: false,
          currencyOptions: {
            name: 'Peso',
            plural: 'Pesos',
            symbol: '₱',
            fractionalUnit: {
              name: 'Centavo',
              plural: 'Centavos',
              symbol: '',
            },
          },
        },
      });

      return amount > 0 ? toWords.convert(amount).toUpperCase() : '';
    };

    return {
      po_date: currentData?.po_date ?? dayjs().format('YYYY-MM-DD'),
      place_delivery: currentData?.place_delivery?.location_name ?? '',
      delivery_date: currentData?.delivery_date ?? '',
      delivery_term: currentData?.delivery_term?.term_name ?? '',
      payment_term: currentData?.payment_term?.term_name ?? '',
      total_amount_words:
        currentData?.total_amount_words ??
        handleConvertAmountToWords(currentData?.total_amount ?? 0),
      sig_approval_id: currentData?.sig_approval_id ?? '',
      items:
        currentData?.items &&
        typeof currentData?.items !== undefined &&
        currentData?.items.length > 0
          ? currentData?.items?.map((item, index) => ({
              key: randomId(),
              pr_item_id: item?.pr_item_id,
              stock_no: item.pr_item?.stock_no ?? 1,
              unit_issue: item.pr_item?.unit_issue?.unit_name ?? '-',
              description: item.description ?? '',
              quantity: item.pr_item?.quantity,
              unit_cost: item?.unit_cost ?? 0,
              total_cost: item?.total_cost ?? 0,
            }))
          : [],
    };
  }, [currentData]);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
  });
  const [province, setProvince] = useState('Loading...');
  const [municipality, setMunicipality] = useState('Loading...');
  const [documentType, setDocumentType] = useState<'po' | 'jo'>(
    currentData?.document_type ?? 'po'
  );

  useEffect(() => {
    setDocumentType(data?.document_type ?? 'po');
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    form.reset();
    form.setValues(currentForm);
  }, [currentForm]);

  useEffect(() => {
    API.get('/companies')
      .then((res) => {
        const company: CompanyType = res?.data?.company;

        setProvince(company?.province ?? '');
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
    item: PurchaseOrderItemsFieldType,
    index: number
  ): ReactNode => {
    switch (id) {
      case 'stock_no':
        return (
          <Table.Td>
            <NumberInput
              size={lgScreenAndBelow ? 'sm' : 'md'}
              variant={readOnly ? 'unstyled' : 'filled'}
              value={item?.stock_no}
              readOnly
            />
          </Table.Td>
        );

      case 'unit_issue':
        return (
          <Table.Td align={'center'}>
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
              key={form.key(`items.${index}.description`)}
              {...form.getInputProps(`items.${index}.description`)}
              variant={readOnly ? 'unstyled' : 'default'}
              placeholder={'Description'}
              defaultValue={readOnly ? undefined : item.description}
              value={readOnly ? item.description : undefined}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              autosize
              readOnly={readOnly}
            />
          </Table.Td>
        );

      case 'quantity':
        return (
          <Table.Td>
            <NumberInput
              size={lgScreenAndBelow ? 'sm' : 'md'}
              variant={readOnly ? 'unstyled' : 'filled'}
              value={item?.quantity}
              readOnly
            />
          </Table.Td>
        );

      case 'unit_cost':
        return (
          <Table.Td colSpan={readOnly ? 1 : 2}>
            <NumberInput
              size={lgScreenAndBelow ? 'sm' : 'md'}
              variant={readOnly ? 'unstyled' : 'filled'}
              value={item?.unit_cost}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator={','}
              readOnly
            />
          </Table.Td>
        );

      case 'total_cost':
        return (
          <Table.Td>
            <NumberInput
              size={lgScreenAndBelow ? 'sm' : 'md'}
              variant={readOnly ? 'unstyled' : 'filled'}
              value={item?.total_cost}
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
            po_date: values.po_date
              ? dayjs(values.po_date).format('YYYY-MM-DD')
              : '',
            delivery_date: values.delivery_date
              ? dayjs(values.delivery_date).format('YYYY-MM-DD')
              : '',
            document_type: documentType,
            items: values.items ?? [],
          });
        }
      })}
    >
      <Stack p={'md'} justify={'center'}>
        {/* <Card
          shadow={'xs'}
          padding={lgScreenAndBelow ? 'md' : 'lg'}
          radius={'xs'}
          withBorder
        >
          <Stack w={'100%'}>
            <Select
              key={form.key('document_type')}
              {...form.getInputProps('document_type')}
              variant={'unstyled'}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              label={'Document Type'}
              sx={{ borderBottom: '2px solid var(--mantine-color-gray-5)' }}
              data={[
                { label: 'Purchase Order', value: 'po' },
                { label: 'Job Order', value: 'jo' },
              ]}
              value={documentType}
              onChange={(_value, option) =>
                setDocumentType((option.value as 'po' | 'po') ?? 'po')
              }
              searchable
              required={!readOnly}
              readOnly={readOnly}
            />
          </Stack>
        </Card> */}

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
              <Text fz={lgScreenAndBelow ? 'h6' : 'h5'}>
                Province of {province}
              </Text>
              <Text
                fz={lgScreenAndBelow ? 'h5' : 'h4'}
                fw={500}
                td={'underline'}
              >
                MUNICIPAL GOVERNMENT OF {municipality}
              </Text>
              <Text fz={lgScreenAndBelow ? 'h5' : 'h4'}>
                {municipality}, {province}
              </Text>
            </Stack>

            <Stack
              align={'center'}
              w={'100%'}
              p={0}
              gap={0}
              justify={'center'}
              bd={'1px solid var(--mantine-color-gray-7)'}
            >
              <Flex
                w={'100%'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
                gap={0}
              >
                <Stack
                  px={'sm'}
                  justify={'center'}
                  flex={1}
                  bd={'1px solid var(--mantine-color-gray-7)'}
                >
                  <Text
                    fz={lgScreenAndBelow ? 'h1' : 'h2'}
                    fw={600}
                    ta={'center'}
                  >
                    {documentType === 'po' ? (
                      <>Purchase Order</>
                    ) : (
                      <>Job Order</>
                    )}
                  </Text>
                </Stack>
                <Stack
                  p={'sm'}
                  flex={1}
                  gap={readOnly ? 1 : undefined}
                  bd={'1px solid var(--mantine-color-gray-7)'}
                >
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Number:</Text>
                    <TextInput
                      variant={readOnly ? 'unstyled' : 'filled'}
                      placeholder={'None'}
                      value={currentData?.po_no ?? '-'}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      flex={1}
                      sx={{
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        input: {
                          minHeight: '30px',
                          height: '30px',
                        },
                      }}
                      readOnly
                    />
                  </Group>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
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
                    </Flex>
                    <DateInput
                      key={form.key('po_date')}
                      {...form.getInputProps('po_date')}
                      variant={'unstyled'}
                      valueFormat={'YYYY-MM-DD'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : form.values.po_date
                            ? new Date(form.values.po_date)
                            : undefined
                      }
                      value={
                        readOnly
                          ? currentData?.po_date
                            ? new Date(currentData?.po_date)
                            : undefined
                          : undefined
                      }
                      placeholder={
                        readOnly ? 'None' : 'Enter the po date here...'
                      }
                      error={form.errors.po_date && ''}
                      flex={1}
                      sx={{
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
              </Flex>

              <Flex
                w={'100%'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
                gap={0}
              >
                <Stack
                  px={'sm'}
                  py={'xs'}
                  justify={'center'}
                  flex={1}
                  bd={'1px solid var(--mantine-color-gray-7)'}
                >
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Supplier</Text>
                    <TextInput
                      variant={readOnly ? 'unstyled' : 'filled'}
                      placeholder={'None'}
                      value={currentData?.supplier?.supplier_name ?? '-'}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      flex={1}
                      sx={{
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        fontWeight: 600,
                        input: {
                          minHeight: '30px',
                          height: '30px',
                        },
                      }}
                      readOnly
                    />
                  </Group>
                </Stack>

                <Stack
                  px={'sm'}
                  justify={'flex-end'}
                  flex={1}
                  bd={'1px solid var(--mantine-color-gray-7)'}
                >
                  <Text ta={'center'} size={lgScreenAndBelow ? 'sm' : 'md'}>
                    Mode of Procurement:
                  </Text>
                </Stack>
              </Flex>

              <Flex
                w={'100%'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
                gap={0}
              >
                <Stack
                  px={'sm'}
                  py={'xs'}
                  justify={'center'}
                  flex={1}
                  gap={readOnly ? 1 : undefined}
                  bd={'1px solid var(--mantine-color-gray-7)'}
                >
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Address</Text>
                    <TextInput
                      variant={readOnly ? 'unstyled' : 'filled'}
                      placeholder={'None'}
                      value={currentData?.supplier?.address ?? '-'}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      flex={1}
                      sx={{
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        input: {
                          minHeight: '30px',
                          height: '30px',
                        },
                      }}
                      readOnly
                    />
                  </Group>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Text size={lgScreenAndBelow ? 'sm' : 'md'}>TIN</Text>
                    <TextInput
                      variant={readOnly ? 'unstyled' : 'filled'}
                      placeholder={'None'}
                      value={currentData?.supplier?.tin_no ?? '-'}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      flex={1}
                      sx={{
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

                <Stack
                  p={'sm'}
                  justify={'center'}
                  flex={1}
                  bd={'1px solid var(--mantine-color-gray-7)'}
                >
                  <Text
                    ta={'center'}
                    fw={600}
                    size={lgScreenAndBelow ? 'lg' : 'xl'}
                  >
                    {currentData?.mode_procurement?.mode_name}
                  </Text>
                </Stack>
              </Flex>

              <Stack
                w={'100%'}
                px={'xl'}
                py={'xs'}
                justify={'flex-start'}
                gap={1}
                bd={'1px solid var(--mantine-color-gray-7)'}
              >
                <Text
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  fs={'italic'}
                  mb={'sm'}
                >
                  Gentlement:
                </Text>
                <Text size={lgScreenAndBelow ? 'sm' : 'md'} fs={'italic'}>
                  Please furnish this office the following articles subject to
                  the terms and conditions contained herein:
                </Text>
              </Stack>

              <Flex
                w={'100%'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
                gap={0}
              >
                <Stack
                  px={'sm'}
                  py={'xs'}
                  justify={'center'}
                  flex={1}
                  gap={readOnly ? 1 : undefined}
                  bd={'1px solid var(--mantine-color-gray-7)'}
                >
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                        Place of Delivery:
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

                    {!readOnly ? (
                      <DynamicAutocomplete
                        key={form.key('place_delivery')}
                        {...form.getInputProps('place_delivery')}
                        variant={'unstyled'}
                        endpoint={'/libraries/locations'}
                        endpointParams={{ paginated: false }}
                        column={'location_name'}
                        placeholder={'Enter place of delivery here...'}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        value={form.values.place_delivery}
                        required={!readOnly}
                        readOnly={readOnly}
                        sx={{
                          flex: 1,
                          borderBottom: '2px solid var(--mantine-color-gray-5)',
                          input: {
                            minHeight: '30px',
                            height: '30px',
                          },
                        }}
                      />
                    ) : (
                      <TextInput
                        variant={'unstyled'}
                        placeholder={'None'}
                        defaultValue={
                          currentData?.place_delivery?.location_name ?? ''
                        }
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        flex={1}
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
                  </Group>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                        Date of Delivery:
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
                      key={form.key('delivery_date')}
                      {...form.getInputProps('delivery_date')}
                      variant={'unstyled'}
                      valueFormat={'YYYY-MM-DD'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : form.values.delivery_date
                            ? new Date(form.values.delivery_date)
                            : undefined
                      }
                      value={
                        readOnly
                          ? currentData?.delivery_date
                            ? new Date(currentData?.delivery_date)
                            : undefined
                          : undefined
                      }
                      placeholder={
                        readOnly ? 'None' : 'Enter the delivery date here...'
                      }
                      error={form.errors.delivery_date && ''}
                      flex={1}
                      sx={{
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

                <Stack
                  px={'sm'}
                  py={'xs'}
                  justify={'center'}
                  flex={1}
                  gap={readOnly ? 1 : undefined}
                  bd={'1px solid var(--mantine-color-gray-7)'}
                >
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                        Delivery Term:
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

                    {!readOnly ? (
                      <DynamicAutocomplete
                        key={form.key('delivery_term')}
                        {...form.getInputProps('delivery_term')}
                        variant={'unstyled'}
                        endpoint={'/libraries/delivery-terms'}
                        endpointParams={{ paginated: false }}
                        column={'term_name'}
                        placeholder={'Enter delivery term here...'}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        value={form.values.delivery_term}
                        required={!readOnly}
                        readOnly={readOnly}
                        sx={{
                          flex: 1,
                          borderBottom: '2px solid var(--mantine-color-gray-5)',
                          input: {
                            minHeight: '30px',
                            height: '30px',
                          },
                        }}
                      />
                    ) : (
                      <TextInput
                        variant={'unstyled'}
                        placeholder={'None'}
                        defaultValue={
                          currentData?.delivery_term?.term_name ?? ''
                        }
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        flex={1}
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
                  </Group>

                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                        Payment Term:
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

                    {!readOnly ? (
                      <DynamicAutocomplete
                        key={form.key('payment_term')}
                        {...form.getInputProps('payment_term')}
                        variant={'unstyled'}
                        endpoint={'/libraries/payment-terms'}
                        endpointParams={{ paginated: false }}
                        column={'term_name'}
                        placeholder={'Enter payment term here...'}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        value={form.values.payment_term}
                        required={!readOnly}
                        readOnly={readOnly}
                        sx={{
                          flex: 1,
                          borderBottom: '2px solid var(--mantine-color-gray-5)',
                          input: {
                            minHeight: '30px',
                            height: '30px',
                          },
                        }}
                      />
                    ) : (
                      <TextInput
                        variant={'unstyled'}
                        placeholder={'None'}
                        defaultValue={
                          currentData?.payment_term?.term_name ?? ''
                        }
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        flex={1}
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
                  </Group>
                </Stack>
              </Flex>

              <Stack w={'100%'} gap={0}>
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
                        if (!readOnly && header.id === 'total_cost') return;

                        return (
                          <Table.Th
                            key={header.id}
                            w={header?.width ?? undefined}
                            fz={lgScreenAndBelow ? 'sm' : 'md'}
                            align={'center'}
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
                          if (!readOnly && header.id === 'total_cost') {
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
                      </Table.Tr>
                    ))}

                    <Table.Tr>
                      <Table.Td>
                        <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                          Purpose
                        </Text>
                      </Table.Td>
                      <Table.Td colSpan={4}>
                        <Textarea
                          variant={readOnly ? 'unstyled' : 'filled'}
                          value={currentData?.purchase_request?.purpose ?? '-'}
                          size={lgScreenAndBelow ? 'sm' : 'md'}
                          autosize
                          autoCapitalize={'sentences'}
                          readOnly
                          sx={{ fontWeight: 600 }}
                        />
                      </Table.Td>
                      <Table.Td></Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Td colSpan={2}>
                        <Flex sx={{ flexBasis: 'auto' }}>
                          <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                            Total (Amount in words)
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
                      </Table.Td>
                      <Table.Td colSpan={3}>
                        <Textarea
                          key={form.key('total_amount_words')}
                          {...form.getInputProps('total_amount_words')}
                          variant={readOnly ? 'unstyled' : 'default'}
                          placeholder={
                            readOnly
                              ? 'None'
                              : 'Enter total amount words here...'
                          }
                          defaultValue={
                            readOnly
                              ? undefined
                              : form.values.total_amount_words
                          }
                          value={
                            readOnly
                              ? currentData?.total_amount_words
                              : undefined
                          }
                          size={lgScreenAndBelow ? 'sm' : 'md'}
                          autosize
                          readOnly={readOnly}
                          sx={{ fontWeight: 600 }}
                        />
                      </Table.Td>
                      <Table.Td
                        fw={600}
                        fz={lgScreenAndBelow ? 'sm' : 'md'}
                        align={'right'}
                      >
                        <NumberInput
                          variant={readOnly ? 'unstyled' : 'filled'}
                          value={currentData?.total_amount}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale={true}
                          readOnly
                        />
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Stack>

              <Stack
                w={'100%'}
                px={'xl'}
                py={'xs'}
                justify={'flex-start'}
                bd={'1px solid var(--mantine-color-gray-7)'}
              >
                <Text size={lgScreenAndBelow ? 'sm' : 'md'} fs={'italic'}>
                  In case of failure to make the full delivery within the time
                  specified above, a penalty of one-tenth (1/10) of one percent
                  for every day of delay shall be imposed.
                </Text>

                {!readOnly ? (
                  <DynamicSelect
                    key={form.key('sig_approval_id')}
                    {...form.getInputProps('sig_approval_id')}
                    variant={'unstyled'}
                    label={'Very truly yours,'}
                    placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                    endpoint={'/libraries/signatories'}
                    endpointParams={{
                      paginated: false,
                      show_all: true,
                      document: 'po',
                      signatory_type: 'authorized_official',
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
                    value={form.values.sig_approval_id}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    required={!readOnly}
                    readOnly={readOnly}
                  />
                ) : (
                  <TextInput
                    label={'Municipal Mayor'}
                    variant={'unstyled'}
                    placeholder={'None'}
                    value={
                      currentData?.signatory_approval?.user?.fullname ?? '-'
                    }
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    readOnly
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </form>
  );
});

PurchaseOrderContentClient.displayName = 'PurchaseOrderContentClient';

export default PurchaseOrderContentClient;
