import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import { Card, Flex, Group, Text } from '@mantine/core';
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
    label: 'Item No.',
    width: '12%',
  },
  {
    id: 'unit_issue',
    label: 'Unit',
    width: '14%',
  },
  {
    id: 'description',
    label: 'Description',
    width: '56%',
    required: true,
  },
  {
    id: 'quantity',
    label: 'Quantity',
    width: '20%',
  },
];

const InspectionAcceptanceReportClient = forwardRef<
  HTMLFormElement,
  ModalInspectionAcceptanceReportContentProps
>(({ data, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(() => {
    return {
      iar_date: currentData?.iar_date ?? '',
      invoice_no: currentData?.invoice_no ?? '',
      invoice_date: currentData?.invoice_date ?? '',
      inspected_date: currentData?.inspected_date ?? '',
      inspected_by: currentData?.sig_inspection_id ?? '',
      received_date: currentData?.received_date ?? '',
      acceptance_complete: currentData?.acceptance_complete ?? false,
      acceptance_partial: currentData?.acceptance_partial ?? false,
      sig_acceptance_id: currentData?.sig_acceptance_id ?? '',
      items:
        currentData?.items &&
        typeof currentData?.items !== undefined &&
        currentData?.items.length > 0
          ? currentData?.items?.map((item, index) => ({
              key: randomId(),
              id: item.id,
              stock_no: item.pr_item?.stock_no ?? 1,
              unit_issue: item.pr_item?.unit_issue?.unit_name ?? '-',
              description: item.po_item?.description ?? '',
              quantity: item.pr_item?.quantity,
              accepted: item.accepted ?? false,
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
  const [companyType, setCompanyType] = useState('Loading...');

  useEffect(() => {
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

        setProvince(company?.province?.toUpperCase() ?? '');
        setMunicipality(company?.municipality?.toUpperCase() ?? '');
        setCompanyType(company?.company_type?.toUpperCase() ?? '');
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
              variant={readOnly ? 'unstyled' : 'filled'}
              placeholder={'Description'}
              defaultValue={readOnly ? undefined : item.description}
              value={readOnly ? item.description : undefined}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              autosize
              readOnly
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

      default:
        return <></>;
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={form.onSubmit((values) => {
        console.log(values);

        // if (handleCreateUpdate) {
        //   handleCreateUpdate({
        //     ...values,
        //     purchase_request_id: currentData?.purchase_request_id,
        //     po_date: values.po_date
        //       ? dayjs(values.po_date).format('YYYY-MM-DD')
        //       : '',
        //     delivery_date: values.delivery_date
        //       ? dayjs(values.delivery_date).format('YYYY-MM-DD')
        //       : '',
        //     document_type: documentType,
        //     items: JSON.stringify(values.items),
        //   });
        // }
      })}
    >
      <Stack p={'md'} justify={'center'}>
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
              <Text fz={lgScreenAndBelow ? 'h4' : 'h3'} fw={600} mb={'sm'}>
                INSPECTION AND ACCEPTANCE REPORT
              </Text>
              <Text fz={lgScreenAndBelow ? 'h5' : 'h4'}>
                {municipality}, {province}
              </Text>
              <Text fz={lgScreenAndBelow ? 'h5' : 'h4'}>{companyType}</Text>
            </Stack>

            <Stack
              align={'center'}
              w={'100%'}
              p={0}
              justify={'center'}
              mb={'sm'}
            >
              <Flex
                w={'100%'}
                justify={'space-between'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
              >
                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                        Supplier:
                      </Text>
                    </Flex>
                    <TextInput
                      variant={'filled'}
                      placeholder={'None'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : currentData?.supplier?.supplier_name
                      }
                      value={
                        readOnly
                          ? currentData?.supplier?.supplier_name
                          : undefined
                      }
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      sx={{
                        flexBasis: '70%',
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

                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                        IAR No.
                      </Text>
                    </Flex>
                    <TextInput
                      variant={'filled'}
                      placeholder={'None'}
                      defaultValue={readOnly ? undefined : currentData?.iar_no}
                      value={readOnly ? currentData?.iar_no : undefined}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      sx={{
                        flexBasis: '70%',
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

                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
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
                    </Flex>
                    <DateInput
                      key={form.key('iar_date')}
                      {...form.getInputProps('iar_date')}
                      variant={'unstyled'}
                      valueFormat={'YYYY-MM-DD'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : form.values.iar_date
                            ? new Date(form.values.iar_date)
                            : undefined
                      }
                      value={
                        readOnly
                          ? form.values?.iar_date
                            ? new Date(form.values?.iar_date)
                            : undefined
                          : undefined
                      }
                      placeholder={
                        readOnly ? 'None' : 'Enter the IAR date here...'
                      }
                      error={form.errors.iar_date && ''}
                      sx={{
                        flexBasis: '100%',
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
                justify={'space-between'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
              >
                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                        PO NO.
                      </Text>
                    </Flex>
                    <TextInput
                      variant={'filled'}
                      placeholder={'None'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : currentData?.purchase_order?.po_no
                      }
                      value={
                        readOnly
                          ? currentData?.purchase_order?.po_no
                          : undefined
                      }
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      sx={{
                        flexBasis: '70%',
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

                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                        Date
                      </Text>
                    </Flex>
                    <DateInput
                      variant={'filled'}
                      valueFormat={'YYYY-MM-DD'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : currentData?.purchase_order?.po_date
                            ? new Date(currentData?.purchase_order?.po_date)
                            : undefined
                      }
                      value={
                        readOnly
                          ? currentData?.purchase_order?.po_date
                            ? new Date(currentData?.purchase_order?.po_date)
                            : undefined
                          : undefined
                      }
                      placeholder={'None'}
                      error={form.errors.invoice_date && ''}
                      sx={{
                        flexBasis: '100%',
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
                      readOnly
                    />
                  </Group>
                </Stack>

                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Flex sx={{ flexBasis: 'auto' }}>
                      <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                        Invoice No.
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
                      key={form.key('invoice_no')}
                      {...form.getInputProps('invoice_no')}
                      variant={'unstyled'}
                      placeholder={
                        readOnly ? 'None' : 'Enter invoice number here...'
                      }
                      defaultValue={
                        readOnly ? undefined : form.values.invoice_no
                      }
                      value={readOnly ? form.values?.invoice_no : undefined}
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
                      key={form.key('invoice_date')}
                      {...form.getInputProps('invoice_date')}
                      variant={'unstyled'}
                      valueFormat={'YYYY-MM-DD'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : form.values.invoice_date
                            ? new Date(form.values.invoice_date)
                            : undefined
                      }
                      value={
                        readOnly
                          ? form.values?.invoice_date
                            ? new Date(form.values?.invoice_date)
                            : undefined
                          : undefined
                      }
                      placeholder={
                        readOnly ? 'None' : 'Enter the invoice date here...'
                      }
                      error={form.errors.invoice_date && ''}
                      sx={{
                        flexBasis: '100%',
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

              <Stack w={'100%'}>
                <Stack px={'sm'}>
                  <Group sx={{ flexWrap: 'nowrap' }}>
                    <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
                      Requesting Office/Dept.
                    </Text>
                    <TextInput
                      variant={'filled'}
                      placeholder={'None'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : currentData?.purchase_request?.section?.section_name
                      }
                      value={
                        readOnly
                          ? currentData?.purchase_request?.section?.section_name
                          : undefined
                      }
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      sx={{
                        flexBasis: '50%',
                        borderBottom: '2px solid var(--mantine-color-gray-5)',
                        input: {
                          minHeight: '30px',
                          height: '30px',
                        },
                      }}
                    />
                  </Group>
                </Stack>
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
                </Table.Tbody>
              </Table>
            </Stack>

            <Stack
              align={'center'}
              w={'100%'}
              p={0}
              gap={0}
              justify={'center'}
              bd={'1px solid var(--mantine-color-gray-7)'}
            ></Stack>

            <Stack
              align={'center'}
              w={'100%'}
              p={0}
              gap={0}
              justify={'center'}
              bd={'1px solid var(--mantine-color-gray-7)'}
            ></Stack>
          </Stack>
        </Card>
      </Stack>
    </form>
  );
});

InspectionAcceptanceReportClient.displayName =
  'InspectionAcceptanceReportClient';

export default InspectionAcceptanceReportClient;
