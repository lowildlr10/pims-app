import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { ActionIcon, Card, Flex, Group, Skeleton, Text } from '@mantine/core';
import { NumberInput, Stack, Table, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { randomId, useMediaQuery } from '@mantine/hooks';
import { IconAsterisk, IconCalendar, IconTrash } from '@tabler/icons-react';
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import DynamicSelect from '../../Generic/DynamicSelect';
import Helper from '@/utils/Helpers';
import dayjs from 'dayjs';
import CustomLoadingOverlay from '@/components/Generic/CustomLoadingOverlay';

const itemHeaders: PurchaseRequestItemHeader[] = [
  {
    id: 'quantity',
    label: 'Quantity',
    width: '11%',
    required: true,
  },
  {
    id: 'unit_issue',
    label: 'Unit',
    width: '10%',
  },
  {
    id: 'description',
    label: 'Description',
    width: '39%',
    required: true,
  },
  {
    id: 'acquired_date',
    label: 'Date Acquired',
    width: '13%',
  },
  {
    id: 'property_no',
    label: 'Property No.',
    width: '12%',
  },
  {
    id: 'total_cost',
    label: 'Amount',
    width: '13%',
  },
  {
    id: 'delete',
    label: '',
    width: '2%',
  },
];

const AreFormClient = forwardRef<
  HTMLFormElement,
  ModalInventoryIssuanceContentProps
>(({ data, isCreate, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [currentData, setCurrentData] = useState(data);
  const [poId, setPoId] = useState<string | undefined>(data?.purchase_order_id);
  const [poData, setPoData] = useState<PurchaseOrderType | undefined>();
  const [companyData, setCompanyData] = useState<CompanyType | undefined>();
  const [loading, setLoading] = useState(false);
  const [inventorySupplies, setInventorySupplies] = useState<
    InventorySupplyType[]
  >([]);
  const currentForm = useMemo(
    () => ({
      document_type: currentData?.document_type ?? '',
      purchase_order_id: currentData?.purchase_order_id ?? '',
      responsibility_center_id: currentData?.responsibility_center_id ?? '',
      inventory_date:
        currentData.inventory_date ?? dayjs().format('YYYY-MM-DD'),
      sai_no: currentData.sai_no ?? poData?.purchase_request?.sai_no ?? '',
      sai_date:
        currentData.sai_date ?? poData?.purchase_request?.sai_date ?? '',
      requested_by_id:
        currentData?.requested_by_id ??
        poData?.purchase_request?.requested_by_id ??
        '',
      requested_date: currentData.requested_date ?? '',
      sig_approved_by_id: currentData?.sig_approved_by_id ?? '',
      approved_date: currentData.approved_date ?? '',
      sig_issued_by_id: currentData?.sig_issued_by_id ?? '',
      issued_date: currentData.issued_date ?? '',
      received_by_id: currentData?.received_by_id ?? '',
      received_date: currentData.received_date ?? '',
      items: !Helper.empty(currentData?.items)
        ? currentData?.items?.map((item) => ({
            key: randomId(),
            inventory_supply_id: item.inventory_supply_id,
            quantity: item.quantity,
            unit_issue: item.supply?.unit_issue?.unit_name ?? '',
            description: item.description,
            acquired_date: item.acquired_date ?? '',
            property_no: item.property_no ?? '',
            available:
              isCreate && !readOnly
                ? item?.supply?.available
                : !isCreate && !readOnly
                  ? (item?.supply?.available ?? 0) + (item?.quantity ?? 0)
                  : (item?.supply?.available ?? 0),
            unit_cost: item.unit_cost,
            total_cost: item.total_cost,
          }))
        : !Helper.empty(inventorySupplies)
          ? inventorySupplies
              .map((supply, index) => ({
                key: randomId(),
                inventory_supply_id: supply.id,
                quantity: undefined,
                unit_issue: supply.unit_issue?.unit_name,
                description: supply.name
                  ? `${supply.name}\n${supply.description}`
                  : supply.description,
                acquired_date: undefined,
                property_no: undefined,
                available: supply?.available ?? 0,
                unit_cost: supply.unit_cost,
                total_cost: 0,
              }))
              .filter((item) => item.available !== 0)
          : [],
    }),
    [currentData, inventorySupplies, poData]
  );
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
  });

  useEffect(() => {
    form.reset();
    form.setValues(currentForm);
  }, [currentForm]);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    if (!data?.purchase_order_id) {
      return;
    }

    setPoId(data?.purchase_order_id);
  }, [data?.purchase_order_id]);

  useEffect(() => {
    if (!poId) {
      setInventorySupplies([]);
      return;
    }

    let companyRetries = 3;
    let poRetries = 3;
    let suppliesRetries = 3;

    const fetchCompany = () => {
      setLoading(true);

      API.get('/companies')
        .then((res) => {
          const company: CompanyType = res?.data?.company;

          setCompanyData(company);
        })
        .catch(() => {
          if (companyRetries > 0) {
            companyRetries -= 1;
            fetchCompany();
          } else {
            notify({
              title: 'Failed',
              message: 'Failed to fetch company after multiple retries',
              color: 'red',
            });
            setLoading(false);
          }
        })
        .finally(() => setLoading(false));
    };

    const fetchPurchaseOrder = () => {
      setLoading(true);

      API.get(`/purchase-orders/${poId}`)
        .then((res) => {
          setPoData(res?.data?.data ?? undefined);
        })
        .catch(() => {
          if (poRetries > 0) {
            poRetries -= 1;
            fetchPurchaseOrder();
          } else {
            notify({
              title: 'Failed',
              message: 'Failed to fetch purchase order after multiple retries',
              color: 'red',
            });
            setLoading(false);
          }
        })
        .finally(() => setLoading(false));
    };

    const fetchSupplies = () => {
      setLoading(true);

      API.get('/inventories/supplies', {
        paginated: false,
        show_all: true,
        grouped: false,
        document_type: currentData?.document_type ?? '',
        search_by_po: true,
        search: poId,
      })
        .then((res) => {
          setInventorySupplies(res?.data ?? []);
        })
        .catch((err) => {
          if (suppliesRetries > 0) {
            suppliesRetries -= 1;
            fetchSupplies();
          } else {
            notify({
              title: 'Failed',
              message:
                'Failed to fetch inventory supplies after multiple retries',
              color: 'red',
            });
            setLoading(false);
          }
        })
        .finally(() => setLoading(false));
    };

    fetchCompany();
    fetchPurchaseOrder();
    fetchSupplies();
  }, [poId, currentData?.document_type]);

  const renderDynamicTdContent = (
    id: string,
    item: InventoryIssuanceItemsFieldType,
    index: number
  ): ReactNode => {
    switch (id) {
      case 'quantity':
        return (
          <Table.Td>
            <NumberInput
              key={form.key(`items.${index}.quantity`)}
              {...form.getInputProps(`items.${index}.quantity`)}
              variant={readOnly ? 'unstyled' : 'default'}
              placeholder={`Quantity`}
              defaultValue={item?.quantity}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              min={0}
              max={
                isCreate && !readOnly
                  ? item?.available
                  : !isCreate && !readOnly
                    ? (item?.available ?? 0) + (item?.quantity ?? 0)
                    : (item?.available ?? 0)
              }
              clampBehavior={'strict'}
              allowDecimal={false}
              required={!readOnly}
              readOnly={readOnly}
            />
            {!readOnly && (
              <Text size={'xs'} c={'dimmed'} mt={'xs'} fs={'italic'}>
                Available: {item?.available}
              </Text>
            )}
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

      case 'acquired_date':
        return (
          <Table.Td>
            <DateInput
              key={form.key(`items.${index}.acquired_date`)}
              {...form.getInputProps(`items.${index}.acquired_date`)}
              variant={readOnly ? 'unstyled' : 'default'}
              valueFormat={'YYYY-MM-DD'}
              defaultValue={
                readOnly
                  ? undefined
                  : item.acquired_date
                    ? new Date(item.acquired_date)
                    : undefined
              }
              value={
                readOnly
                  ? item.acquired_date
                    ? new Date(item.acquired_date)
                    : undefined
                  : undefined
              }
              placeholder={
                readOnly ? 'None' : 'Enter the date acquired here...'
              }
              size={lgScreenAndBelow ? 'sm' : 'md'}
              leftSection={!readOnly ? <IconCalendar size={18} /> : undefined}
              clearable
              readOnly={readOnly}
            />
          </Table.Td>
        );

      case 'property_no':
        return (
          <Table.Td>
            <TextInput
              key={form.key(`items.${index}.property_no`)}
              {...form.getInputProps(`items.${index}.property_no`)}
              variant={readOnly ? 'unstyled' : 'default'}
              placeholder={
                readOnly ? 'None' : 'Enter inventory item number here...'
              }
              defaultValue={readOnly ? undefined : item.property_no}
              value={readOnly ? item.property_no : undefined}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              readOnly={readOnly}
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
            purchase_order_id: poId,
            sai_date: values.sai_date
              ? dayjs(values.sai_date).format('YYYY-MM-DD')
              : '',
            inventory_date: values.inventory_date
              ? dayjs(values.inventory_date).format('YYYY-MM-DD')
              : '',
            requested_date: values.requested_date
              ? dayjs(values.requested_date).format('YYYY-MM-DD')
              : '',
            approved_date: values.approved_date
              ? dayjs(values.approved_date).format('YYYY-MM-DD')
              : '',
            issued_date: values.issued_date
              ? dayjs(values.issued_date).format('YYYY-MM-DD')
              : '',
            received_date: values.received_date
              ? dayjs(values.received_date).format('YYYY-MM-DD')
              : '',
            items: values.items ?? [],
          });
        }
      })}
    >
      <CustomLoadingOverlay visible={loading} />

      <Stack p={'md'} justify={'center'}>
        <Card
          shadow={'xs'}
          padding={lgScreenAndBelow ? 'md' : 'lg'}
          radius={'xs'}
          withBorder
        >
          <Stack>
            <TextInput
              variant={
                !readOnly && isCreate
                  ? 'filled'
                  : !readOnly && !isCreate
                    ? 'filled'
                    : 'default'
              }
              label={'Document Type'}
              placeholder={'None'}
              value={Helper.mapInventoryIssuanceDocumentType(
                currentData?.document_type
              )}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              flex={1}
              readOnly
            />

            {isCreate ? (
              <DynamicSelect
                variant={readOnly ? 'unstyled' : 'default'}
                endpoint={'/purchase-orders'}
                endpointParams={{
                  paginated: false,
                  show_all: true,
                  grouped: false,
                  has_supplies_only: true,
                }}
                column={'po_no'}
                defaultData={
                  currentData?.purchase_order_id
                    ? [
                        {
                          value: currentData?.purchase_order_id ?? '',
                          label: currentData?.purchase_order?.po_no ?? '',
                        },
                      ]
                    : undefined
                }
                value={poId}
                onChange={(value) => {
                  setPoId(value ?? '');
                  form.setFieldValue('purchase_order_id', value ?? '');
                }}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                label={'Purchase Order'}
                placeholder={'Select a purchase order...'}
                required={!readOnly}
                readOnly={readOnly}
              />
            ) : (
              <TextInput
                label={'Purchase Order'}
                placeholder={'None'}
                variant={readOnly ? 'default' : 'filled'}
                value={currentData?.purchase_order?.po_no ?? '-'}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                readOnly
              />
            )}
          </Stack>
        </Card>

        {poId && (
          <Card
            shadow={'xs'}
            padding={lgScreenAndBelow ? 'md' : 'lg'}
            radius={'xs'}
            withBorder
          >
            <Stack align={'center'} w={'100%'} p={0} justify={'center'} gap={0}>
              <Stack
                align={'center'}
                w={'100%'}
                py={lgScreenAndBelow ? 'xs' : 'sm'}
                justify={'center'}
                gap={0}
                m={0}
                bd={'1px solid var(--mantine-color-gray-7)'}
              >
                <Text fz={lgScreenAndBelow ? 'h4' : 'h3'} mb={'lg'} fw={'bold'}>
                  ACKNOWLEDGMENT RECEIPT FOR EQUIPMENT
                </Text>
                <Stack align={'center'} w={'100%'} gap={0}>
                  <Text
                    fz={lgScreenAndBelow ? 'h4' : 'h3'}
                    fw={600}
                    td={'underline'}
                  >
                    {companyData?.municipality?.toUpperCase()},{' '}
                    {companyData?.province?.toUpperCase()}
                  </Text>
                  <Text fz={lgScreenAndBelow ? 'md' : 'lg'}>
                    {companyData?.company_type?.toUpperCase()}
                  </Text>
                </Stack>
              </Stack>

              <Stack
                align={'center'}
                w={'100%'}
                p={0}
                gap={0}
                m={0}
                justify={'center'}
                bd={'1px solid var(--mantine-color-gray-7)'}
              >
                <Flex
                  w={'100%'}
                  direction={lgScreenAndBelow ? 'column' : 'row'}
                  gap={0}
                >
                  <Stack px={'sm'} py={'sm'} flex={1}></Stack>

                  <Stack px={'sm'} py={'sm'} flex={1}></Stack>

                  <Stack px={'sm'} py={'sm'} flex={1}>
                    <Stack gap={readOnly ? 1 : undefined}>
                      <Group sx={{ flexWrap: 'nowrap' }} flex={1}>
                        <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                          ARE Number:
                        </Text>
                        <TextInput
                          variant={readOnly ? 'unstyled' : 'filled'}
                          placeholder={'Autogenerated'}
                          value={currentData.inventory_no ?? ''}
                          size={lgScreenAndBelow ? 'sm' : 'md'}
                          flex={1}
                          sx={{
                            borderBottom:
                              '2px solid var(--mantine-color-gray-5)',
                            input: {
                              minHeight: '30px',
                              height: '30px',
                            },
                          }}
                          readOnly
                        />
                      </Group>

                      <Group sx={{ flexWrap: 'nowrap' }} flex={1}>
                        <Flex sx={{ flexBasis: 'auto' }}>
                          <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
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
                        </Flex>
                        <DateInput
                          key={form.key('inventory_date')}
                          {...form.getInputProps('inventory_date')}
                          variant={'unstyled'}
                          valueFormat={'YYYY-MM-DD'}
                          defaultValue={
                            readOnly
                              ? undefined
                              : form.values.inventory_date
                                ? new Date(form.values.inventory_date)
                                : undefined
                          }
                          value={
                            readOnly
                              ? currentData?.inventory_date
                                ? new Date(currentData?.inventory_date)
                                : undefined
                              : undefined
                          }
                          placeholder={
                            readOnly ? 'None' : 'Enter the ICS date here...'
                          }
                          error={form.errors.inventory_date && ''}
                          flex={1}
                          sx={{
                            borderBottom:
                              '2px solid var(--mantine-color-gray-5)',
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
                  </Stack>
                </Flex>
              </Stack>
            </Stack>

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
                      if (readOnly && header.id === 'delete') return;

                      if (!readOnly && header.id === 'total_cost') return;

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
                  {loading &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <Table.Tr key={i}>
                        <Table.Td colSpan={itemHeaders?.length}>
                          <Skeleton height={30} radius='sm' />
                        </Table.Td>
                      </Table.Tr>
                    ))}

                  {Helper.empty(form.getValues()?.items) && !loading && (
                    <Table.Tr>
                      <Table.Td
                        c={'var(--mantine-color-red-5)'}
                        ta={'center'}
                        colSpan={itemHeaders?.length}
                        fz={{ base: 11, lg: 'xs', xl: 'sm' }}
                      >
                        No property or supply available.
                      </Table.Td>
                    </Table.Tr>
                  )}

                  {form.getValues()?.items?.map((item, index) => (
                    <Table.Tr
                      key={`item-${item.key}`}
                      sx={{ verticalAlign: 'top' }}
                    >
                      {itemHeaders.map((header) => {
                        if (
                          header.id === 'delete' ||
                          (!readOnly && header.id === 'total_cost')
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
                        <Table.Td>
                          <ActionIcon
                            w={'100%'}
                            color={'var(--mantine-color-red-7)'}
                            variant={'light'}
                            disabled={form.getValues()?.items?.length === 1}
                            onClick={() => {
                              if (form.getValues()?.items?.length === 1) return;
                              form.removeListItem('items', index);
                            }}
                          >
                            <IconTrash size={18} stroke={2} />
                          </ActionIcon>
                        </Table.Td>
                      )}
                    </Table.Tr>
                  ))}

                  <Table.Tr>
                    <Table.Td>
                      <Text
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        sx={{ fontWeight: 500 }}
                      >
                        Purpose
                      </Text>
                    </Table.Td>
                    <Table.Td colSpan={5}>
                      <Textarea
                        variant={readOnly ? 'unstyled' : 'filled'}
                        value={poData?.purchase_request?.purpose ?? '-'}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        autosize
                        autoCapitalize={'sentences'}
                        readOnly
                        fs={'italic'}
                        sx={{ fontWeight: 600 }}
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
              gap={0}
              m={0}
              justify={'center'}
              bd={'1px solid var(--mantine-color-gray-7)'}
            >
              <Flex
                w={'100%'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
                gap={0}
              >
                <Stack
                  bd={'1px solid var(--mantine-color-gray-8)'}
                  p={'md'}
                  flex={1}
                >
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('received_by_id')}
                      {...form.getInputProps('received_by_id')}
                      variant={'unstyled'}
                      label={'Received by:'}
                      placeholder={'Select a recipient...'}
                      endpoint={'/accounts/users'}
                      endpointParams={{
                        paginated: false,
                        show_all: true,
                        document: 'ics',
                      }}
                      column={'fullname'}
                      defaultData={
                        currentData?.received_by_id
                          ? [
                              {
                                value: currentData?.received_by_id ?? '',
                                label: currentData?.recipient?.fullname ?? '',
                              },
                            ]
                          : undefined
                      }
                      sx={{
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                      }}
                      value={form.values.received_by_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      required={!readOnly}
                      readOnly={readOnly}
                    />
                  ) : (
                    <TextInput
                      label={'Received by:'}
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={currentData?.recipient?.fullname ?? '-'}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      flex={1}
                      sx={{
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                      }}
                      readOnly
                    />
                  )}

                  <DateInput
                    key={form.key('received_date')}
                    {...form.getInputProps('received_date')}
                    variant={'unstyled'}
                    label={'Date'}
                    valueFormat={'YYYY-MM-DD'}
                    defaultValue={
                      readOnly
                        ? undefined
                        : form.values.received_date
                          ? new Date(form.values.received_date)
                          : undefined
                    }
                    value={
                      readOnly
                        ? currentData?.received_date
                          ? new Date(currentData?.received_date)
                          : undefined
                        : undefined
                    }
                    placeholder={
                      readOnly ? 'None' : 'Enter the received date here...'
                    }
                    error={form.errors.received_date && ''}
                    flex={1}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    leftSection={
                      !readOnly ? <IconCalendar size={18} /> : undefined
                    }
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    clearable
                    readOnly={readOnly}
                  />
                </Stack>

                <Stack
                  bd={'1px solid var(--mantine-color-gray-8)'}
                  p={'md'}
                  flex={1}
                >
                  {!readOnly ? (
                    <DynamicSelect
                      key={form.key('sig_issued_by_id')}
                      {...form.getInputProps('sig_issued_by_id')}
                      variant={'unstyled'}
                      label={'Received from:'}
                      placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                      endpoint={'/libraries/signatories'}
                      endpointParams={{
                        paginated: false,
                        show_all: true,
                        document: 'are',
                        signatory_type: 'received_from',
                      }}
                      defaultData={
                        currentData?.sig_issued_by_id
                          ? [
                              {
                                value: currentData?.sig_issued_by_id ?? '',
                                label:
                                  currentData?.signatory_issuer?.user
                                    ?.fullname ?? '',
                              },
                            ]
                          : undefined
                      }
                      valueColumn={'signatory_id'}
                      column={'fullname_designation'}
                      value={form.values.sig_issued_by_id}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      sx={{
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                      }}
                      required={!readOnly}
                      readOnly={readOnly}
                    />
                  ) : (
                    <TextInput
                      label={'Received From:'}
                      variant={'unstyled'}
                      placeholder={'None'}
                      value={
                        currentData?.signatory_issuer?.user?.fullname ?? '-'
                      }
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      sx={{
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                      }}
                      readOnly
                    />
                  )}

                  <DateInput
                    key={form.key('issued_date')}
                    {...form.getInputProps('issued_date')}
                    variant={'unstyled'}
                    label={'Date'}
                    valueFormat={'YYYY-MM-DD'}
                    defaultValue={
                      readOnly
                        ? undefined
                        : form.values.issued_date
                          ? new Date(form.values.issued_date)
                          : undefined
                    }
                    value={
                      readOnly
                        ? currentData?.issued_date
                          ? new Date(currentData?.issued_date)
                          : undefined
                        : undefined
                    }
                    placeholder={
                      readOnly ? 'None' : 'Enter the received from date here...'
                    }
                    error={form.errors.issued_date && ''}
                    flex={1}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    leftSection={
                      !readOnly ? <IconCalendar size={18} /> : undefined
                    }
                    clearable
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    readOnly={readOnly}
                  />
                </Stack>
              </Flex>
            </Stack>
          </Card>
        )}
      </Stack>
    </form>
  );
});

AreFormClient.displayName = 'AreFormClient';

export default AreFormClient;
